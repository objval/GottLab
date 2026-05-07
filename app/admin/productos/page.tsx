'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Search, Pencil, Trash2, AlertCircle, Package } from 'lucide-react'

const formatCLP = (n: number) => `$${Number(n).toLocaleString('es-CL')}`

export default function AdminProductos() {
  const [productos, setProductos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [eliminando, setEliminando] = useState<number | null>(null)

  const cargar = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('productos')
      .select('id_producto, nombre, precio_venta, stock_total, estado, categorias(nombre), imagenes_productos(url)')
      .order('id_producto', { ascending: false })
    setProductos(data || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return
    setEliminando(id)
    await supabase.from('productos').delete().eq('id_producto', id)
    await cargar()
    setEliminando(null)
  }

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Productos</h1>
          <p className="text-stone-400 text-sm">{productos.length} productos en total</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      {/* Buscador */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-10 w-10 text-stone-700 mb-3" />
          <p className="text-stone-400">No se encontraron productos</p>
        </div>
      ) : (
        <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-800">
                <th className="text-left px-4 py-3 text-stone-400 font-medium">Producto</th>
                <th className="text-left px-4 py-3 text-stone-400 font-medium hidden sm:table-cell">Categoría</th>
                <th className="text-right px-4 py-3 text-stone-400 font-medium">Precio</th>
                <th className="text-right px-4 py-3 text-stone-400 font-medium hidden md:table-cell">Stock</th>
                <th className="text-center px-4 py-3 text-stone-400 font-medium hidden md:table-cell">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filtrados.map((p) => {
                const img = p.imagenes_productos?.[0]?.url
                const cat = Array.isArray(p.categorias) ? p.categorias[0]?.nombre : p.categorias?.nombre
                return (
                  <tr key={p.id_producto} className="hover:bg-stone-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-stone-800 flex-shrink-0">
                          {img
                            ? <Image src={img} alt={p.nombre} width={36} height={36} className="object-cover w-full h-full" />
                            : <Package className="h-4 w-4 text-stone-600 m-auto mt-2.5" />
                          }
                        </div>
                        <span className="text-white font-medium line-clamp-1">{p.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-400 capitalize hidden sm:table-cell">{cat || '—'}</td>
                    <td className="px-4 py-3 text-right text-white">{formatCLP(p.precio_venta)}</td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span className={p.stock_total > 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {p.stock_total}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        p.estado === 'activo'
                          ? 'bg-emerald-900/50 text-emerald-400'
                          : 'bg-stone-700 text-stone-400'
                      }`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          href={`/admin/productos/${p.id_producto}/editar`}
                          className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => eliminar(p.id_producto)}
                          disabled={eliminando === p.id_producto}
                          className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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
