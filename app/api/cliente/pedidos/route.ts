import { NextRequest, NextResponse } from 'next/server'
import { supabase as supabaseServer } from '@/lib/supabaseServer'
import { verifyToken } from '@/lib/jwt'

interface TokenPayload {
  userId: number
  email: string
  role: string
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

  const clienteId = session.perfilId
  if (!clienteId) {
    return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
  }

  const { data: pedidos, error } = await supabaseServer
    .from('pedidos')
    .select(`
      id_pedido,
      fecha,
      estado,
      total,
      detalles:cantidad,
      detalles:producto(nombre)
    `)
    .eq('id_cliente', clienteId)
    .order('fecha', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar pedidos' }, { status: 500 })
  }

  return NextResponse.json({ pedidos: pedidos || [] })
}
