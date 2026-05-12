import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase as supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  const { nombre, apellido, email, password } = await req.json()

  if (!email || !password || !nombre || !apellido) {
    return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 })
  }

  const normalizedEmail = String(email).trim().toLowerCase()

  // Verificar si ya existe un usuario con ese correo
  const { data: existingUsuario } = await supabaseServer
    .from('usuarios')
    .select('id_usuario')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (existingUsuario) {
    return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  // Crear usuario en tabla centralizada
  const { data: usuarioInsert, error: usuarioError } = await supabaseServer
    .from('usuarios')
    .insert({
      email: normalizedEmail,
      password: passwordHash,
      rol: 'cliente',
      activo: true,
    })
    .select('id_usuario')
    .maybeSingle()

  if (usuarioError || !usuarioInsert) {
    console.log('❌ Error al crear usuario:', usuarioError)
    return NextResponse.json({ error: 'No se pudo crear el usuario: ' + (usuarioError?.message || 'Error desconocido') }, { status: 500 })
  }

  const { data: clienteInsert, error: clienteError } = await supabaseServer
    .from('clientes')
    .insert({
      id_usuario: usuarioInsert.id_usuario,
      nombre: String(nombre).trim(),
      apellido: String(apellido).trim(),
      rut: null,
      telefono: null,
    })
    .select('id_cliente')
    .maybeSingle()

  if (clienteError || !clienteInsert) {
    console.log('❌ Error al crear cliente:', clienteError)
    await supabaseServer.from('usuarios').delete().eq('id_usuario', usuarioInsert.id_usuario)
    return NextResponse.json({ error: 'No se pudo registrar al cliente: ' + (clienteError?.message || 'Error desconocido') }, { status: 500 })
  }

  return NextResponse.json({ success: true, usuarioId: usuarioInsert.id_usuario, clienteId: clienteInsert.id_cliente })
}
