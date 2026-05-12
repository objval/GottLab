import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase as supabaseServer } from '@/lib/supabaseServer'
import { signToken, UsuarioRol } from '@/lib/jwt'

interface UsuarioBase {
  id_usuario: number
  email: string
  rol: UsuarioRol
  activo: boolean
  password: string
}

interface ClienteRow {
  id_cliente: number
  nombre: string | null
  apellido: string | null
  telefono: string | null
  rut: string | null
}

interface EmpleadoRow {
  id_empleado: number
  nombre: string | null
  apellido: string | null
  telefono: string | null
  rut: string | null
  cargo: string | null
  estado: string | null
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
  }

  const normalizedEmail = String(email).trim().toLowerCase()

  const { data: usuarioData, error } = await supabaseServer
    .from('usuarios')
    .select('id_usuario, email, rol, activo, password')
    .eq('email', normalizedEmail)
    .maybeSingle()

  const usuario = usuarioData as UsuarioBase | null

  if (error || !usuario) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
  }

  if (!usuario.activo) {
    return NextResponse.json({ error: 'Cuenta inactiva' }, { status: 403 })
  }

  const passwordValida = await bcrypt.compare(password, usuario.password)

  if (!passwordValida) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
  }

  let perfil: any = null
  let perfilId: number | undefined
  let nombre: string | null = null

  if (usuario.rol === 'cliente') {
    const { data: clienteData } = await supabaseServer
      .from('clientes')
      .select('id_cliente, nombre, apellido, telefono, rut')
      .eq('id_usuario', usuario.id_usuario)
      .maybeSingle()

    const cliente = clienteData as ClienteRow | null

    if (cliente) {
      perfil = {
        id: cliente.id_cliente,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        telefono: cliente.telefono,
        rut: cliente.rut,
      }
      perfilId = cliente.id_cliente
      nombre = cliente.nombre
    }
  } else {
    const { data: empleadoData } = await supabaseServer
      .from('empleados')
      .select('id_empleado, nombre, apellido, telefono, rut, cargo, estado')
      .eq('id_usuario', usuario.id_usuario)
      .maybeSingle()

    const empleado = empleadoData as EmpleadoRow | null

    if (!empleado) {
      return NextResponse.json({ error: 'Empleado no registrado. Contacte al administrador.' }, { status: 403 })
    }

    if (empleado.estado !== 'activo') {
      return NextResponse.json({ error: 'Cuenta inactiva' }, { status: 403 })
    }

    perfil = {
      id: empleado.id_empleado,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      telefono: empleado.telefono,
      rut: empleado.rut,
      cargo: empleado.cargo,
      estado: empleado.estado,
    }
    perfilId = empleado.id_empleado
    nombre = empleado.nombre
  }

  const token = await signToken({
    userId: usuario.id_usuario,
    email: usuario.email,
    role: usuario.rol,
    nombre,
    perfilId,
  })

  const response = NextResponse.json({
    usuario: {
      id: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol,
      nombre,
      perfil,
    }
  })

  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return response
}
