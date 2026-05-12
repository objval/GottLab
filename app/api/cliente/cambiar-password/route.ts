import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase as supabaseServer } from '@/lib/supabaseServer'
import { verifyToken } from '@/lib/jwt'

interface TokenPayload {
  userId: number
  email: string
  role: string
}

async function getSessionUser(req: NextRequest): Promise<TokenPayload | null> {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null
  return payload as TokenPayload
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req)
  if (!session || session.role !== 'cliente') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { currentPassword, newPassword } = await req.json()

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Contraseña actual y nueva son requeridas' }, { status: 400 })
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' }, { status: 400 })
  }

  const { data: usuario, error } = await supabaseServer
    .from('usuarios')
    .select('id_usuario, password')
    .eq('id_usuario', session.userId)
    .maybeSingle()

  if (error || !usuario) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  const passwordValida = await bcrypt.compare(currentPassword, usuario.password)
  if (!passwordValida) {
    return NextResponse.json({ error: 'Contraseña actual incorrecta' }, { status: 401 })
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10)

  const { error: updateError } = await supabaseServer
    .from('usuarios')
    .update({ password: newPasswordHash })
    .eq('id_usuario', session.userId)

  if (updateError) {
    return NextResponse.json({ error: 'Error al actualizar contraseña' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
