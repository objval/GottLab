import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ user: null, profile: null })
  }

  const { data: cliente } = await supabase.from('clientes')
    .select('id_cliente, nombre, apellido, email, telefono, rut')
    .eq('auth_id', user.id).maybeSingle()

  if (cliente) {
    return NextResponse.json({ user: { id: user.id, email: user.email }, profile: { ...(cliente as any), role: 'cliente' } })
  }

  const { data: empleado } = await supabase.from('empleados')
    .select('id_empleado, nombre, apellido, email, telefono, rut, cargo, estado')
    .eq('auth_id', user.id).maybeSingle()

  if (empleado) {
    const emp = empleado as any
    const role = emp.cargo?.toLowerCase() === 'admin' ? 'admin' : 'empleado'
    return NextResponse.json({ user: { id: user.id, email: user.email }, profile: { ...emp, role } })
  }

  return NextResponse.json({ user: { id: user.id, email: user.email }, profile: null })
}
