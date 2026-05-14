'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Shield, ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react'

const cargoConfig: Record<string, { label: string; icon: any; color: string }> = {
  admin: { label: 'Admin', icon: ShieldAlert, color: 'text-red-400 bg-red-900/30' },
  administrador: { label: 'Admin', icon: ShieldAlert, color: 'text-red-400 bg-red-900/30' },
  vendedor: { label: 'Vendedor', icon: ShieldCheck, color: 'text-amber-400 bg-amber-900/30' },
  vendedora: { label: 'Vendedora', icon: ShieldCheck, color: 'text-amber-400 bg-amber-900/30' },
}
const cargoDefault = { label: 'Empleado', icon: Shield, color: 'text-stone-400 bg-stone-800' }

export default function AdminEmpleados() {
  const { isAdmin } = useAuth()
  const [empleados, setEmpleados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [cambiando, setCambiando] = useState<number | null>(null)

  const cargar = async () => {
    setLoading(true)
    const { data } = await supabase.from('empleados')
      .select('id_empleado, rut, nombre, apellido, email, telefono, cargo, estado')
      .order('nombre')
    setEmpleados(data || [])
    setLoading(false)
  }
  useEffect(() => { cargar() }, [])

  const cambiarCargo = async (id: number, nuevoCargo: string) => {
    if (!isAdmin) return
    setCambiando(id)
    await supabase.from('empleados').update({ cargo: nuevoCargo }).eq('id_empleado', id)
    await cargar()
    setCambiando(null)
  }

  const filtrados = empleados.filter(e =>
    e.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.rut?.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (!isAdmin) return <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center"><ShieldOff className="h-10 w-10 text-stone-600 mb-3" /><p className="text-stone-400">Solo los administradores pueden ver esta seccion</p></div>

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6"><h1 className="text-xl font-bold text-stone-900 dark:text-white">Empleados</h1><p className="text-stone-500 dark:text-stone-400 text-sm">{empleados.length} empleados registrados</p></div>
      <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
        <input type="text" placeholder="Buscar por nombre, email o RUT..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>
      {loading ? <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-stone-200 dark:border-stone-800">
              <th className="text-left px-4 py-3 text-stone-500 dark:text-stone-400 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 text-stone-500 dark:text-stone-400 font-medium hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-stone-500 dark:text-stone-400 font-medium hidden lg:table-cell">RUT</th>
              <th className="text-center px-4 py-3 text-stone-500 dark:text-stone-400 font-medium">Cargo</th>
              <th className="text-center px-4 py-3 text-stone-500 dark:text-stone-400 font-medium hidden sm:table-cell">Estado</th>
              <th className="text-center px-4 py-3 text-stone-500 dark:text-stone-400 font-medium hidden md:table-cell">Cambiar cargo</th>
            </tr></thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtrados.map((e) => {
                const cc = cargoConfig[e.cargo?.toLowerCase()] || cargoDefault
                return (
                  <tr key={e.id_empleado} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-stone-600 dark:text-stone-300 text-xs font-bold uppercase">{e.nombre?.[0]}</span></div><span className="text-stone-900 dark:text-white font-medium">{e.nombre || '—'}</span></div></td>
                    <td className="px-4 py-3 text-stone-500 dark:text-stone-400 hidden sm:table-cell">{e.email}</td>
                    <td className="px-4 py-3 text-stone-500 dark:text-stone-400 hidden lg:table-cell">{e.rut || '—'}</td>
                    <td className="px-4 py-3 text-center"><span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full ${cc.color}`}><cc.icon className="h-3 w-3" />{cc.label}</span></td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell"><span className={`text-[11px] font-medium px-2 py-1 rounded-full ${e.estado === 'activo' ? 'text-emerald-400 bg-emerald-900/30' : 'text-stone-500 bg-stone-800'}`}>{e.estado || '—'}</span></td>
                    <td className="px-4 py-3 text-center hidden md:table-cell"><select value={e.cargo || ''} disabled={cambiando === e.id_empleado} onChange={ev => cambiarCargo(e.id_empleado, ev.target.value)} className="bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"><option value="admin">Admin</option><option value="vendedor">Vendedor</option><option value="vendedora">Vendedora</option></select></td>
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
