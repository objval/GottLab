'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Tag, Plus, Trash2, Pencil } from 'lucide-react'

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [nueva, setNueva] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [editando, setEditando] = useState<{ id: number; nombre: string } | null>(null)

  const cargar = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('categorias')
      .select('id_categoria, nombre')
      .order('nombre')
    setCategorias(data || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const agregar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nueva.trim()) return
    setGuardando(true)
    await supabase.from('categorias').insert({ nombre: nueva.trim().toLowerCase() })
    setNueva('')
    await cargar()
    setGuardando(false)
  }

  const guardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editando) return
    setGuardando(true)
    await supabase
      .from('categorias')
      .update({ nombre: editando.nombre.trim().toLowerCase() })
      .eq('id_categoria', editando.id)
    setEditando(null)
    await cargar()
    setGuardando(false)
  }

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría? Los productos asociados quedarán sin categoría.')) return
    await supabase.from('categorias').delete().eq('id_categoria', id)
    await cargar()
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-stone-900 dark:text-white">Categorías</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm">{categorias.length} categorías</p>
      </div>

      {/* Agregar nueva */}
      <form onSubmit={agregar} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nueva categoría..."
          value={nueva}
          onChange={e => setNueva(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={guardando || !nueva.trim()}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl divide-y divide-stone-100 dark:divide-stone-800">
          {categorias.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Tag className="h-8 w-8 text-stone-300 dark:text-stone-700 mb-2" />
              <p className="text-stone-500 text-sm">No hay categorías</p>
            </div>
          ) : categorias.map((cat) => (
            <div key={cat.id_categoria} className="flex items-center gap-3 px-4 py-3">
              {editando?.id === cat.id_categoria ? (
                <form onSubmit={guardarEdicion} className="flex-1 flex gap-2">
                  <input
                    autoFocus
                    value={editando!.nombre}
                    onChange={e => setEditando({ id: editando!.id, nombre: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-emerald-500 rounded-lg text-sm text-stone-900 dark:text-white focus:outline-none"
                  />
                  <button type="submit" disabled={guardando} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium">
                    Guardar
                  </button>
                  <button type="button" onClick={() => setEditando(null)} className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded-lg text-xs font-medium">
                    Cancelar
                  </button>
                </form>
              ) : (
                <>
                  <Tag className="h-4 w-4 text-stone-400 dark:text-stone-500 flex-shrink-0" />
                  <span className="flex-1 text-sm text-stone-900 dark:text-white capitalize">{cat.nombre}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditando({ id: cat.id_categoria, nombre: cat.nombre })}
                      className="p-1.5 text-stone-500 hover:text-white hover:bg-stone-700 rounded-lg transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => eliminar(cat.id_categoria)}
                      className="p-1.5 text-stone-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
