import { NextRequest, NextResponse } from 'next/server'
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

async function getClienteId(userId: number): Promise<number | null> {
  const { data: cliente } = await supabaseServer
    .from('clientes')
    .select('id_cliente')
    .eq('id_usuario', userId)
    .maybeSingle()
  return cliente?.id_cliente || null
}

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req)
  if (!session || session.role !== 'cliente') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const clienteId = await getClienteId(session.userId)
  if (!clienteId) {
    return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
  }

  const { data: direcciones, error } = await supabaseServer
    .from('direcciones')
    .select('id_direccion, alias, tipo, direccion, comuna, ciudad, region, codigo_postal')
    .eq('id_cliente', clienteId)
    .order('id_direccion', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar direcciones' }, { status: 500 })
  }

  return NextResponse.json({ direcciones: direcciones || [] })
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req)
  if (!session || session.role !== 'cliente') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const clienteId = await getClienteId(session.userId)
  if (!clienteId) {
    return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
  }

  const { alias, tipo, direccion, comuna, ciudad, region, codigo_postal } = await req.json()

  if (!direccion) {
    return NextResponse.json({ error: 'La dirección es obligatoria' }, { status: 400 })
  }

  const { data: nuevaDireccion, error } = await supabaseServer
    .from('direcciones')
    .insert({
      id_cliente: clienteId,
      alias: alias ? String(alias).trim() : null,
      tipo: tipo ? String(tipo).trim() : 'casa',
      direccion: String(direccion).trim(),
      comuna: comuna ? String(comuna).trim() : null,
      ciudad: ciudad ? String(ciudad).trim() : null,
      region: region ? String(region).trim() : null,
      codigo_postal: codigo_postal ? String(codigo_postal).trim() : null,
    })
    .select('id_direccion, alias, tipo, direccion, comuna, ciudad, region, codigo_postal')
    .maybeSingle()

  if (error || !nuevaDireccion) {
    return NextResponse.json({ error: 'Error al crear dirección' }, { status: 500 })
  }

  return NextResponse.json({ direccion: nuevaDireccion })
}

export async function PUT(req: NextRequest) {
  const session = await getSessionUser(req)
  if (!session || session.role !== 'cliente') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const clienteId = await getClienteId(session.userId)
  if (!clienteId) {
    return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID de dirección requerido' }, { status: 400 })
  }

  const { alias, tipo, direccion, comuna, ciudad, region, codigo_postal } = await req.json()

  if (!direccion) {
    return NextResponse.json({ error: 'La dirección es obligatoria' }, { status: 400 })
  }

  const { data: direccionActualizada, error } = await supabaseServer
    .from('direcciones')
    .update({
      alias: alias ? String(alias).trim() : null,
      tipo: tipo ? String(tipo).trim() : 'casa',
      direccion: String(direccion).trim(),
      comuna: comuna ? String(comuna).trim() : null,
      ciudad: ciudad ? String(ciudad).trim() : null,
      region: region ? String(region).trim() : null,
      codigo_postal: codigo_postal ? String(codigo_postal).trim() : null,
    })
    .eq('id_direccion', parseInt(id))
    .eq('id_cliente', clienteId)
    .select('id_direccion, alias, tipo, direccion, comuna, ciudad, region, codigo_postal')
    .maybeSingle()

  if (error || !direccionActualizada) {
    return NextResponse.json({ error: 'Error al actualizar dirección' }, { status: 500 })
  }

  return NextResponse.json({ direccion: direccionActualizada })
}

export async function DELETE(req: NextRequest) {
  const session = await getSessionUser(req)
  if (!session || session.role !== 'cliente') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const clienteId = await getClienteId(session.userId)
  if (!clienteId) {
    return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID de dirección requerido' }, { status: 400 })
  }

  const { error } = await supabaseServer
    .from('direcciones')
    .delete()
    .eq('id_direccion', parseInt(id))
    .eq('id_cliente', clienteId)

  if (error) {
    return NextResponse.json({ error: 'Error al eliminar dirección' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
