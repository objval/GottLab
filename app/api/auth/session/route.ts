import { NextRequest, NextResponse } from 'next/server'
import { supabase as supabaseServer } from '@/lib/supabaseServer'
import { verifyToken, UsuarioRol } from '@/lib/jwt'

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

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ usuario: null })

  const payload = await verifyToken(token)
  if (!payload) return NextResponse.json({ usuario: null })

  const { userId, role } = payload

  const { data: usuarioData } = await supabaseServer
    .from('usuarios')
    .select('id_usuario, email, rol, activo')
    .eq('id_usuario', userId)
    .maybeSingle()

  if (!usuarioData || !usuarioData.activo) {
    return NextResponse.json({ usuario: null })
  }

  let perfil: any = null
  let nombre: string | null = null

  if (role === 'cliente') {
    const { data: clienteData } = await supabaseServer
      .from('clientes')
      .select('id_cliente, nombre, apellido, telefono, rut')
      .eq('id_usuario', userId)
      .maybeSingle()

    const cliente = clienteData as ClienteRow | null
    if (cliente) {
      perfil = cliente
      nombre = cliente.nombre
    }
  } else {
    const { data: empleadoData } = await supabaseServer
      .from('empleados')
      .select('id_empleado, nombre, apellido, telefono, rut, cargo, estado')
      .eq('id_usuario', userId)
      .maybeSingle()

    const empleado = empleadoData as EmpleadoRow | null
    if (empleado) {
      perfil = empleado
      nombre = empleado.nombre
    }
  }

  return NextResponse.json({
    usuario: {
      id: usuarioData.id_usuario,
      email: usuarioData.email,
      rol: usuarioData.rol as UsuarioRol,
      nombre,
      perfil,
    }
  })
}
