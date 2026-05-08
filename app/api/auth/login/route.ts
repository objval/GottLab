import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase as supabaseServer } from '@/lib/supabaseServer'
import { signToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
  }

  const { data: empleado, error } = await supabaseServer
    .from('empleados')
    .select('id_empleado, nombre, email, password_hash, cargo, estado')
    .eq('email', email)
    .single()

  if (error || !empleado) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
  }

  if (empleado.estado !== 'activo') {
    return NextResponse.json({ error: 'Cuenta inactiva' }, { status: 403 })
  }

  const passwordValida = await bcrypt.compare(password, empleado.password_hash)
  if (!passwordValida) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
  }

  const token = await signToken({
    id: empleado.id_empleado,
    email: empleado.email,
    nombre: empleado.nombre,
    cargo: empleado.cargo,
  })

  const response = NextResponse.json({
    empleado: {
      id: empleado.id_empleado,
      nombre: empleado.nombre,
      email: empleado.email,
      cargo: empleado.cargo,
    }
  })

  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  })

  return response
}
