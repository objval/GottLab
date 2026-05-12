import { NextRequest, NextResponse } from 'next/server'
import { supabase as supabaseServer } from '@/lib/supabaseServer'
import { verifyToken } from '@/lib/jwt'

interface TokenPayload {
  userId: number
  email: string
  role: string
  nombre?: string | null
  perfilId?: number
}

async function getSessionUser(req: NextRequest): Promise<TokenPayload | null> {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null
  return payload as TokenPayload
}

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req)
  if (!session || session.role !== 'cliente') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data: cliente } = await supabaseServer
    .from('clientes')
    .select('id_cliente, nombre, apellido, telefono, rut, email')
    .eq('id_usuario', session.userId)
    .maybeSingle()

  if (!cliente) {
    return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
  }

  return NextResponse.json({ cliente })
}

export async function PUT(req: NextRequest) {
  const session = await getSessionUser(req)
  if (!session || session.role !== 'cliente') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { nombre, apellido, telefono, rut } = await req.json()

  if (!nombre || !apellido) {
    return NextResponse.json({ error: 'Nombre y apellido son obligatorios' }, { status: 400 })
  }

  const { data: cliente, error } = await supabaseServer
    .from('clientes')
    .update({
      nombre: String(nombre).trim(),
      apellido: String(apellido).trim(),
      telefono: telefono ? String(telefono).trim() : null,
      rut: rut ? String(rut).trim() : null,
    })
    .eq('id_usuario', session.userId)
    .select('id_cliente, nombre, apellido, telefono, rut')
    .maybeSingle()

  if (error || !cliente) {
    return NextResponse.json({ error: 'Error al actualizar perfil' }, { status: 500 })
  }

  return NextResponse.json({ cliente })
}
