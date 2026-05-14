'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Tag, Plus, Trash2, Pencil, Search, X, Check } from 'lucide-react'

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [editando, setEditando] = useState<{ id: number; nombre: string } | null>(null)
  const [modalNueva, setModalNueva] = useState(false)
  const [nueva, setNueva] = useState('')
  const [errorNueva, setErrorNueva] = useState('')

  const cargar = async () => {
    setLoading(true)
    const { data } = await supabase.from('categorias').select('id_categoria, nombre').order('nombre')
    setCategorias(data || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const agregar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nueva.trim()) return
    const nombreNorm = nueva.trim().toLowerCase()
    const duplicado = categorias.some(c => c.nombre.toLowerCase() === nombreNorm)
    if (duplicado) { setErrorNueva(`Ya existe una categoría llamada "${nombreNorm}"`); return }
    setGuardando(true)
    await supabase.from('categorias').insert({ nombre: nombreNorm })
    setNueva('')
    setErrorNueva('')
    setModalNueva(false)
    await cargar()
    setGuardando(false)
  }

  const guardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editando) return
    setGuardando(true)
    await supabase.from('categorias').update({ nombre: editando.nombre.trim().toLowerCase() }).eq('id_categoria', editando.id)
    setEditando(null)
    await cargar()
    setGuardando(false)
  }

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría? Los productos asociados quedarán sin categoría.')) return
    await supabase.from('categorias').delete().eq('id_categoria', id)
    await cargar()
  }

  const filtradas = categorias.filter(c => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-white">Categorías</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">{categorias.length} categorías</p>
        </div>
        <button
          onClick={() => { setNueva(''); setErrorNueva(''); setModalNueva(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nueva categoría
        </button>
      </div>

      {/* Buscador */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar categoría..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl divide-y divide-stone-100 dark:divide-stone-800">
          {filtradas.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Tag className="h-8 w-8 text-stone-300 dark:text-stone-700 mb-2" />
              <p className="text-stone-500 dark:text-stone-400 text-sm">{busqueda ? 'Sin resultados' : 'No hay categorías'}</p>
            </div>
          ) : filtradas.map((cat) => (
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
                  <button type="button" onClick={() => setEditando(null)} className="px-3 py-1.5 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-600 dark:text-stone-300 rounded-lg text-xs font-medium">
                    Cancelar
                  </button>
                </form>
              ) : (
                <>
                  <Tag className="h-4 w-4 text-stone-400 dark:text-stone-500 flex-shrink-0" />
                  <span className="flex-1 text-sm text-stone-900 dark:text-white capitalize">{cat.nombre}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setEditando({ id: cat.id_categoria, nombre: cat.nombre })}
                      className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => eliminar(cat.id_categoria)}
                      className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal nueva categoría */}
      {modalNueva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 dark:border-stone-700">
              <h3 className="font-semibold text-stone-900 dark:text-white">Nueva categoría</h3>
              <button onClick={() => setModalNueva(false)} className="text-stone-400 hover:text-stone-600 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={agregar} className="p-5 space-y-4">
              <input
                autoFocus
                type="text"
                placeholder="Nombre de la categoría..."
                value={nueva}
                onChange={e => { setNueva(e.target.value); setErrorNueva('') }}
                onKeyDown={e => e.key === 'Escape' && setModalNueva(false)}
                className={`w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border rounded-lg text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 ${
                  errorNueva ? 'border-red-400 focus:ring-red-400' : 'border-stone-300 dark:border-stone-600 focus:ring-emerald-500'
                }`}
              />
              {errorNueva && (
                <p className="text-xs text-red-500 -mt-2">{errorNueva}</p>
              )}
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setModalNueva(false)}
                  className="px-4 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={guardando || !nueva.trim()}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
                  {guardando ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check className="h-4 w-4" />}
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
