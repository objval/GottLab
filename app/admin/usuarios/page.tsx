'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { Users, Search, Shield, ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react'

type Rol = 'admin' | 'vendedor' | 'cliente'

const rolConfig: Record<Rol, { label: string; icon: any; color: string }> = {
  admin: { label: 'Admin', icon: ShieldAlert, color: 'text-red-400 bg-red-900/30' },
  vendedor: { label: 'Vendedor', icon: ShieldCheck, color: 'text-amber-400 bg-amber-900/30' },
  cliente: { label: 'Cliente', icon: Shield, color: 'text-stone-400 bg-stone-800' },
}

export default function AdminUsuarios() {
  const { isAdmin } = useAuth()
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [cambiando, setCambiando] = useState<string | null>(null)

  const cargar = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre, email, rol, created_at')
      .order('created_at', { ascending: false })
    setUsuarios(data || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const cambiarRol = async (idUsuario: string, nuevoRol: Rol) => {
    if (!isAdmin) return
    setCambiando(idUsuario)
    await supabase
      .from('usuarios')
      .update({ rol: nuevoRol })
      .eq('id_usuario', idUsuario)
    await cargar()
    setCambiando(null)
  }

  const filtrados = usuarios.filter(u =>
    u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email?.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (!isAdmin) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <ShieldOff className="h-10 w-10 text-stone-600 mb-3" />
        <p className="text-stone-400">No tienes permisos para ver esta sección</p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Usuarios</h1>
        <p className="text-stone-400 text-sm">{usuarios.length} usuarios registrados</p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-800">
                <th className="text-left px-4 py-3 text-stone-400 font-medium">Usuario</th>
                <th className="text-left px-4 py-3 text-stone-400 font-medium hidden sm:table-cell">Email</th>
                <th className="text-center px-4 py-3 text-stone-400 font-medium">Rol</th>
                <th className="text-center px-4 py-3 text-stone-400 font-medium hidden md:table-cell">Cambiar rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filtrados.map((u) => {
                const rc = rolConfig[u.rol as Rol] || rolConfig.cliente
                return (
                  <tr key={u.id_usuario} className="hover:bg-stone-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-stone-300 text-xs font-bold uppercase">
                            {(u.nombre || u.email)?.[0]}
                          </span>
                        </div>
                        <span className="text-white font-medium">{u.nombre || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-400 hidden sm:table-cell">{u.email}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full ${rc.color}`}>
                        <rc.icon className="h-3 w-3" />
                        {rc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <select
                        value={u.rol}
                        disabled={cambiando === u.id_usuario}
                        onChange={e => cambiarRol(u.id_usuario, e.target.value as Rol)}
                        className="bg-stone-800 border border-stone-700 text-stone-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                      >
                        <option value="cliente">Cliente</option>
                        <option value="vendedor">Vendedor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
