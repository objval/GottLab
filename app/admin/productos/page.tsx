'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { Plus, Search, Pencil, Trash2, Package, X, ImagePlus, Check, Images, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

const formatCLP = (n: number) => `$${Number(n).toLocaleString('es-CL')}`

function prioridadLabel(v: number) {
  if (v <= 3) return { label: 'Baja', color: 'text-red-500' }
  if (v <= 6) return { label: 'Media', color: 'text-amber-500' }
  return { label: 'Alta', color: 'text-emerald-500' }
}

function prioridadBg(v: number) {
  const r = Math.round(255 * (1 - v / 10))
  const g = Math.round(180 * (v / 10))
  return `rgb(${r},${g},60)`
}

// ─── Modal de imágenes ────────────────────────────────────────────────────────
function ImagenesModal({ productoId, onClose }: { productoId: number; onClose: () => void }) {
  const [imagenes, setImagenes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [nueva, setNueva] = useState('')
  const [preview, setPreview] = useState('')
  const [previewOk, setPreviewOk] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cargar = async () => {
    setLoading(true)
    const { data } = await supabase.from('imagenes_productos').select('id_imagen, url').eq('id_producto', productoId)
    setImagenes(data || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [productoId])

  const handleUrlChange = (val: string) => {
    setNueva(val)
    setPreviewOk(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.trim()) {
      debounceRef.current = setTimeout(() => setPreview(val.trim()), 600)
    } else {
      setPreview('')
    }
  }

  const agregar = async () => {
    if (!nueva.trim() || !previewOk) return
    setGuardando(true)
    await supabase.from('imagenes_productos').insert({ id_producto: productoId, url: nueva.trim() })
    setNueva('')
    setPreview('')
    setPreviewOk(false)
    await cargar()
    setGuardando(false)
  }

  const eliminar = async (id: number) => {
    await supabase.from('imagenes_productos').delete().eq('id_imagen', id)
    await cargar()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 dark:border-stone-700">
          <h3 className="font-semibold text-stone-900 dark:text-white flex items-center gap-2">
            <Images className="h-4 w-4 text-emerald-500" /> Imágenes del producto
          </h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">

          {/* Grid imágenes existentes */}
          {loading ? (
            <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {imagenes.map(img => (
                <div key={img.id_imagen} className="relative group aspect-square rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <Image src={img.url} alt="" fill className="object-cover" />
                  <button
                    onClick={() => eliminar(img.id_imagen)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              {imagenes.length === 0 && (
                <p className="col-span-3 text-center text-stone-400 text-sm py-4">Sin imágenes aún</p>
              )}
            </div>
          )}

          {/* Input URL + preview */}
          <div className="border border-stone-200 dark:border-stone-700 rounded-xl p-3 space-y-3">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">Añadir imagen por URL</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={nueva}
                onChange={e => handleUrlChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && agregar()}
                className="flex-1 px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={agregar}
                disabled={guardando || !nueva.trim() || !previewOk}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                <ImagePlus className="h-4 w-4" />
                Añadir
              </button>
            </div>

            {/* Vista previa */}
            {preview && (
              <div className="flex items-start gap-3">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0 border border-stone-200 dark:border-stone-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onLoad={() => setPreviewOk(true)}
                    onError={() => { setPreviewOk(false) }}
                  />
                </div>
                <div className="flex-1 pt-1">
                  {previewOk ? (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> URL válida — listo para añadir
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 font-medium">
                      No se puede cargar esta imagen. Verifica la URL.
                    </span>
                  )}
                  <p className="text-[10px] text-stone-400 mt-1 break-all line-clamp-2">{preview}</p>
                </div>
              </div>
            )}
            {!preview && nueva.trim() && (
              <p className="text-xs text-stone-400 italic">Esperando para previsualizar…</p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Modal de edición / creación ─────────────────────────────────────────────
function EditarModal({ producto, categorias, onClose, onGuardado }: {
  producto: any | null
  categorias: any[]
  onClose: () => void
  onGuardado: () => void
}) {
  const esNuevo = !producto?.id_producto
  const [form, setForm] = useState({
    nombre: producto?.nombre || '',
    nombre_cientifico: producto?.nombre_cientifico || '',
    descripcion: producto?.descripcion || '',
    precio_venta: producto?.precio_venta ?? '',
    precio_costo: producto?.precio_costo ?? '',
    stock_total: producto?.stock_total ?? 0,
    id_categoria: producto?.id_categoria ?? '',
    tipo_venta: producto?.tipo_venta || 'normal',
    estado: producto?.estado || 'activo',
    destacado: producto?.destacado || false,
    nuevo: producto?.nuevo || false,
    prioridad: producto?.prioridad ?? 0,
  })
  const [guardando, setGuardando] = useState(false)
  const [verImagenes, setVerImagenes] = useState(false)
  const [nuevoId, setNuevoId] = useState<number | null>(null)
  const prio = prioridadLabel(form.prioridad)

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const guardar = async () => {
    setGuardando(true)
    const payload = {
      nombre: form.nombre,
      nombre_cientifico: form.nombre_cientifico || null,
      descripcion: form.descripcion || null,
      precio_venta: Number(form.precio_venta),
      precio_costo: form.precio_costo ? Number(form.precio_costo) : null,
      stock_total: Number(form.stock_total),
      id_categoria: form.id_categoria || null,
      tipo_venta: form.tipo_venta,
      estado: form.estado,
      destacado: form.destacado,
      nuevo: form.nuevo,
      prioridad: Number(form.prioridad),
    }
    if (esNuevo) {
      const { data } = await supabase.from('productos').insert(payload).select('id_producto').single()
      if (data?.id_producto) {
        setNuevoId(data.id_producto)
        setVerImagenes(true)
      }
    } else {
      await supabase.from('productos').update(payload).eq('id_producto', producto.id_producto)
    }
    setGuardando(false)
    onGuardado()
    if (!esNuevo) onClose()
  }

  const inputCls = "w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
  const labelCls = "block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1"

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-700 flex-shrink-0">
            <h2 className="font-semibold text-stone-900 dark:text-white">{esNuevo ? 'Nuevo producto' : 'Editar producto'}</h2>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-6 space-y-5">
            {/* Nombre + Nombre científico */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Nombre *</label>
                <input className={inputCls} value={form.nombre} onChange={e => set('nombre', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Nombre científico</label>
                <input className={inputCls} value={form.nombre_cientifico} onChange={e => set('nombre_cientifico', e.target.value)} placeholder="Ej: Monstera deliciosa" />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className={labelCls}>Descripción</label>
              <textarea className={`${inputCls} resize-none`} rows={3} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
            </div>

            {/* Precios + Stock */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Precio venta</label>
                <input type="number" className={inputCls} value={form.precio_venta} onChange={e => set('precio_venta', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Precio costo</label>
                <input type="number" className={inputCls} value={form.precio_costo} onChange={e => set('precio_costo', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Stock</label>
                <input type="number" className={inputCls} value={form.stock_total} onChange={e => set('stock_total', e.target.value)} />
              </div>
            </div>

            {/* Categoría + Tipo venta + Estado */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Categoría</label>
                <select className={inputCls} value={form.id_categoria} onChange={e => set('id_categoria', e.target.value)}>
                  <option value="">Sin categoría</option>
                  {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Tipo venta</label>
                <select className={inputCls} value={form.tipo_venta} onChange={e => set('tipo_venta', e.target.value)}>
                  <option value="normal">Normal</option>
                  <option value="preventa">Preventa</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Estado</label>
                <select className={inputCls} value={form.estado} onChange={e => set('estado', e.target.value)}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            {/* Prioridad */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls + ' mb-0'}>Prioridad</label>
                <span className={`text-xs font-semibold ${prio.color}`}>
                  {form.prioridad} / 10 · {prio.label}
                </span>
              </div>
              <div className="relative h-6 flex items-center">
                <div className="absolute w-full h-2 rounded-full overflow-hidden"
                  style={{ background: 'linear-gradient(to right, #ef4444, #f59e0b, #22c55e)' }} />
                <input
                  type="range" min={0} max={10} step={1}
                  value={form.prioridad}
                  onChange={e => set('prioridad', Number(e.target.value))}
                  className="relative w-full h-2 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                  style={{ '--thumb-color': prioridadBg(form.prioridad) } as any}
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 mt-1 px-0.5">
                {[0,1,2,3,4,5,6,7,8,9,10].map(n => <span key={n}>{n}</span>)}
              </div>
            </div>

            {/* Checkboxes + Imágenes */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.destacado} onChange={e => set('destacado', e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded" />
                  <span className="text-sm text-stone-700 dark:text-stone-300">Destacado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.nuevo} onChange={e => set('nuevo', e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded" />
                  <span className="text-sm text-stone-700 dark:text-stone-300">Nuevo</span>
                </label>
              </div>
              <button
                onClick={() => setVerImagenes(true)}
                disabled={esNuevo && !nuevoId}
                title={esNuevo && !nuevoId ? 'Crea el producto primero' : undefined}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-stone-300 dark:border-stone-600 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Images className="h-4 w-4" />
                Gestionar imágenes
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200 dark:border-stone-700 flex-shrink-0">
            <button onClick={onClose} className="px-4 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">
              {esNuevo && nuevoId ? 'Cerrar' : 'Cancelar'}
            </button>
            {(!esNuevo || !nuevoId) && (
              <button
                onClick={guardar}
                disabled={guardando || !form.nombre.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {guardando ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check className="h-4 w-4" />}
                {esNuevo ? 'Crear producto' : 'Guardar cambios'}
              </button>
            )}
            {esNuevo && nuevoId && (
              <button
                onClick={() => setVerImagenes(true)}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Images className="h-4 w-4" />
                Añadir imágenes
              </button>
            )}
          </div>
        </div>
      </div>
      {verImagenes && <ImagenesModal productoId={nuevoId ?? producto?.id_producto} onClose={() => setVerImagenes(false)} />}
    </>
  )
}

// ─── Picker estado inline ─────────────────────────────────────────────────────
function EstadoPicker({ valor, onSelect, onClose }: {
  valor: string
  onSelect: (v: string) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const opciones = [
    { value: 'activo',   label: 'Activo',   cls: 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50' },
    { value: 'inactivo', label: 'Inactivo', cls: 'text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-700' },
  ]

  return (
    <div ref={ref} className="absolute z-30 top-full mt-1 left-1/2 -translate-x-1/2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-xl shadow-xl overflow-hidden w-32">
      {opciones.map(o => (
        <button
          key={o.value}
          onClick={() => onSelect(o.value)}
          className={`w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold hover:opacity-80 transition-opacity ${
            valor === o.value ? 'opacity-100' : 'opacity-60'
          }`}
        >
          <span className={`px-2 py-0.5 rounded-full ${o.cls}`}>{o.label}</span>
          {valor === o.value && <span className="text-emerald-500">✓</span>}
        </button>
      ))}
    </div>
  )
}

// ─── Celda inline editable ────────────────────────────────────────────────────
type InlineCell =
  | { id: number; field: 'nombre' | 'precio_venta' | 'stock_total'; value: string }
  | { id: number; field: 'prioridad'; value: number }
  | { id: number; field: 'id_categoria'; value: string | null }
  | { id: number; field: 'estado'; value: string }
  | { id: number; field: 'imagenes' }

// ─── Dropdown categoría inline ───────────────────────────────────────────────
function CategoriaDropdown({ categorias, valor, onSelect, onClose }: {
  categorias: any[]
  valor: string | null
  onSelect: (id: string | null, nombre: string) => void
  onClose: () => void
}) {
  const [q, setQ] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const filtradas = categorias.filter(c =>
    c.nombre.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div ref={ref} className="absolute z-30 mt-1 w-52 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-xl shadow-xl overflow-hidden">
      <div className="p-2 border-b border-stone-100 dark:border-stone-700">
        <input
          autoFocus
          type="text"
          placeholder="Buscar categoría..."
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Escape' && onClose()}
          className="w-full px-2 py-1.5 text-xs bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div className="max-h-48 overflow-y-auto py-1">
        <button
          onClick={() => onSelect(null, '—')}
          className={`w-full text-left px-3 py-2 text-xs hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors ${
            !valor ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          Sin categoría
        </button>
        {filtradas.map(c => (
          <button
            key={c.id_categoria}
            onClick={() => onSelect(String(c.id_categoria), c.nombre)}
            className={`w-full text-left px-3 py-2 text-xs hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors capitalize ${
              String(c.id_categoria) === valor ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-stone-700 dark:text-stone-200'
            }`}
          >
            {c.nombre}
          </button>
        ))}
        {filtradas.length === 0 && (
          <p className="px-3 py-3 text-xs text-stone-400 text-center">Sin resultados</p>
        )}
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function AdminProductos() {
  const [productos, setProductos] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [eliminando, setEliminando] = useState<number | null>(null)
  const [editando, setEditando] = useState<any | null>(null)
  const [creando, setCreando] = useState(false)
  const [inline, setInline] = useState<InlineCell | null>(null)
  const [pagina, setPagina] = useState(1)
  const POR_PAGINA = 50
  const [sortCol, setSortCol] = useState<'nombre' | 'categoria' | 'precio_venta' | 'stock_total' | 'prioridad' | 'estado' | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [sortKey, setSortKey] = useState(0)

  const toggleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
    setSortKey(k => k + 1)
    setPagina(1)
  }

  const cargar = async () => {
    setLoading(true)
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('productos').select('id_producto, nombre, nombre_cientifico, descripcion, precio_venta, precio_costo, stock_total, estado, destacado, nuevo, prioridad, id_categoria, tipo_venta, categorias(id_categoria, nombre), imagenes_productos(id_imagen, url)').order('prioridad', { ascending: false }),
      supabase.from('categorias').select('id_categoria, nombre').order('nombre'),
    ])
    setProductos(prods || [])
    setCategorias(cats || [])
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

  const guardarInline = async (id: number, field: string, value: any) => {
    await supabase.from('productos').update({ [field]: value }).eq('id_producto', id)
    setProductos(prev => prev.map(p => p.id_producto === id ? { ...p, [field]: value } : p))
    setInline(null)
  }

  const filtrados = productos
    .filter(p => p.nombre?.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      if (!sortCol) return 0
      let va: any, vb: any
      if (sortCol === 'nombre') {
        va = (a.nombre || '').toLowerCase(); vb = (b.nombre || '').toLowerCase()
        return sortDir === 'asc' ? va.localeCompare(vb, 'es') : vb.localeCompare(va, 'es')
      }
      if (sortCol === 'categoria') {
        va = ((Array.isArray(a.categorias) ? a.categorias[0]?.nombre : a.categorias?.nombre) || '').toLowerCase()
        vb = ((Array.isArray(b.categorias) ? b.categorias[0]?.nombre : b.categorias?.nombre) || '').toLowerCase()
        return sortDir === 'asc' ? va.localeCompare(vb, 'es') : vb.localeCompare(va, 'es')
      }
      if (sortCol === 'estado') {
        va = (a.estado || '').toLowerCase(); vb = (b.estado || '').toLowerCase()
        return sortDir === 'asc' ? va.localeCompare(vb, 'es') : vb.localeCompare(va, 'es')
      }
      va = a[sortCol] ?? 0; vb = b[sortCol] ?? 0
      return sortDir === 'asc' ? va - vb : vb - va
    })

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const inlineTxtCls = "w-full px-2 py-1 text-sm bg-white dark:bg-stone-800 border border-emerald-500 rounded-md text-stone-900 dark:text-white focus:outline-none"

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-white">Productos</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">{productos.length} productos en total</p>
        </div>
        <button
          onClick={() => setCreando(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => { setBusqueda(e.target.value); setPagina(1) }}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-10 w-10 text-stone-300 dark:text-stone-700 mb-3" />
          <p className="text-stone-500 dark:text-stone-400">No se encontraron productos</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
          <p className="text-[11px] text-stone-400 px-4 pt-2 pb-1 italic">Doble clic sobre nombre, precio, stock o prioridad para editar directo</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800">
                {([
                  { col: 'nombre',       label: 'Producto',  align: 'left',   cls: '' },
                  { col: 'categoria',    label: 'Categoría', align: 'left',   cls: 'hidden sm:table-cell' },
                  { col: 'precio_venta', label: 'Precio',    align: 'right',  cls: '' },
                  { col: 'stock_total',  label: 'Stock',     align: 'right',  cls: 'hidden md:table-cell' },
                  { col: 'prioridad',    label: 'Prioridad', align: 'center', cls: 'hidden lg:table-cell' },
                  { col: 'estado',       label: 'Estado',    align: 'center', cls: 'hidden md:table-cell' },
                ] as const).map(({ col, label, align, cls }) => (
                  <th key={col} className={`px-4 py-3 font-medium ${cls}`}>
                    <button
                      onClick={() => toggleSort(col)}
                      className={`flex items-center gap-1 focus:outline-none rounded ${
                        align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''
                      } ${
                        sortCol === col
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      } transition-colors`}
                    >
                      {label}
                      <span className="transition-transform duration-200">
                        {sortCol === col
                          ? sortDir === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                          : <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />}
                      </span>
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody key={sortKey} className="divide-y divide-stone-100 dark:divide-stone-800 animate-fadeIn">
              {paginados.map((p) => {
                const img = p.imagenes_productos?.[0]?.url
                const cat = Array.isArray(p.categorias) ? p.categorias[0]?.nombre : p.categorias?.nombre
                const prio = prioridadLabel(p.prioridad ?? 0)
                const isNombre  = inline?.id === p.id_producto && inline?.field === 'nombre'
                const isPrecio  = inline?.id === p.id_producto && inline?.field === 'precio_venta'
                const isStock   = inline?.id === p.id_producto && inline?.field === 'stock_total'
                const isPrio    = inline?.id === p.id_producto && inline?.field === 'prioridad'
                const isImgs    = inline?.id === p.id_producto && inline?.field === 'imagenes'
                const isCat     = inline?.id === p.id_producto && inline?.field === 'id_categoria'
                const isEstado  = inline?.id === p.id_producto && inline?.field === 'estado'

                return (
                  <tr key={p.id_producto} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors group">

                    {/* Nombre — dblclick para editar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* Imagen — dblclick abre gestor */}
                        <div
                          onDoubleClick={() => setInline({ id: p.id_producto, field: 'imagenes' })}
                          className="w-9 h-9 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0 cursor-pointer ring-0 hover:ring-2 hover:ring-emerald-400 transition-all"
                          title="Doble clic para editar imágenes"
                        >
                          {img
                            ? <Image src={img} alt={p.nombre} width={36} height={36} className="object-cover w-full h-full" />
                            : <Package className="h-4 w-4 text-stone-400 m-auto mt-2.5" />
                          }
                        </div>
                        {isNombre ? (
                          <input
                            autoFocus
                            className={inlineTxtCls}
                            value={(inline as any).value}
                            onChange={e => setInline({ id: p.id_producto, field: 'nombre', value: e.target.value })}
                            onBlur={() => guardarInline(p.id_producto, 'nombre', (inline as any).value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') guardarInline(p.id_producto, 'nombre', (inline as any).value)
                              if (e.key === 'Escape') setInline(null)
                            }}
                          />
                        ) : (
                          <span
                            onDoubleClick={() => setInline({ id: p.id_producto, field: 'nombre', value: p.nombre })}
                            className="text-stone-900 dark:text-white font-medium line-clamp-1 cursor-text select-none"
                            title="Doble clic para editar"
                          >
                            {p.nombre}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Categoría — dblclick despliega dropdown con buscador */}
                    <td className="px-4 py-3 capitalize hidden sm:table-cell">
                      <div className="relative">
                        <span
                          onDoubleClick={() => setInline({ id: p.id_producto, field: 'id_categoria', value: p.id_categoria ? String(p.id_categoria) : null })}
                          className="text-stone-500 dark:text-stone-400 cursor-pointer select-none hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                          title="Doble clic para cambiar categoría"
                        >
                          {cat || '—'}
                        </span>
                        {isCat && (
                          <CategoriaDropdown
                            categorias={categorias}
                            valor={(inline as any).value}
                            onSelect={(id, nombre) => {
                              guardarInline(p.id_producto, 'id_categoria', id ? Number(id) : null)
                              setProductos(prev => prev.map(x =>
                                x.id_producto === p.id_producto
                                  ? { ...x, categorias: id ? [{ id_categoria: Number(id), nombre }] : [] }
                                  : x
                              ))
                            }}
                            onClose={() => setInline(null)}
                          />
                        )}
                      </div>
                    </td>

                    {/* Precio — dblclick */}
                    <td className="px-4 py-3 text-right whitespace-nowrap w-[140px]">
                      {isPrecio ? (
                        <input
                          autoFocus
                          type="number"
                          inputMode="decimal"
                          className={inlineTxtCls + ' text-right w-28 ml-auto no-spin'}
                          value={(inline as any).value}
                          onChange={e => setInline({ id: p.id_producto, field: 'precio_venta', value: e.target.value })}
                          onBlur={() => guardarInline(p.id_producto, 'precio_venta', Number((inline as any).value))}
                          onKeyDown={e => {
                            if (e.key === 'Enter') guardarInline(p.id_producto, 'precio_venta', Number((inline as any).value))
                            if (e.key === 'Escape') setInline(null)
                          }}
                        />
                      ) : (
                        <span
                          onDoubleClick={() => setInline({ id: p.id_producto, field: 'precio_venta', value: String(p.precio_venta) })}
                          className="text-stone-900 dark:text-white cursor-text select-none"
                          title="Doble clic para editar"
                        >
                          {formatCLP(p.precio_venta)}
                        </span>
                      )}
                    </td>

                    {/* Stock — dblclick */}
                    <td className="px-4 py-3 text-right whitespace-nowrap hidden md:table-cell w-[110px]">
                      {isStock ? (
                        <input
                          autoFocus
                          type="number"
                          inputMode="numeric"
                          className={inlineTxtCls + ' text-right w-20 ml-auto no-spin'}
                          value={(inline as any).value}
                          onChange={e => setInline({ id: p.id_producto, field: 'stock_total', value: e.target.value })}
                          onBlur={() => guardarInline(p.id_producto, 'stock_total', Number((inline as any).value))}
                          onKeyDown={e => {
                            if (e.key === 'Enter') guardarInline(p.id_producto, 'stock_total', Number((inline as any).value))
                            if (e.key === 'Escape') setInline(null)
                          }}
                        />
                      ) : (
                        <span
                          onDoubleClick={() => setInline({ id: p.id_producto, field: 'stock_total', value: String(p.stock_total) })}
                          className={`cursor-text select-none ${p.stock_total > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}
                          title="Doble clic para editar"
                        >
                          {p.stock_total}
                        </span>
                      )}
                    </td>

                    {/* Prioridad — dblclick despliega slider inline */}
                    <td className="px-4 py-3 hidden lg:table-cell min-w-[140px]">
                      {isPrio ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px] text-stone-400">
                            <span>0</span>
                            <span className={`font-semibold ${prioridadLabel((inline as any).value).color}`}>
                              {(inline as any).value} · {prioridadLabel((inline as any).value).label}
                            </span>
                            <span>10</span>
                          </div>
                          <div className="relative h-5 flex items-center">
                            <div className="absolute w-full h-2 rounded-full" style={{ background: 'linear-gradient(to right,#ef4444,#f59e0b,#22c55e)' }} />
                            <input
                              autoFocus
                              type="range" min={0} max={10} step={1}
                              value={(inline as any).value}
                              onChange={e => setInline({ id: p.id_producto, field: 'prioridad', value: Number(e.target.value) })}
                              onBlur={() => guardarInline(p.id_producto, 'prioridad', (inline as any).value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') guardarInline(p.id_producto, 'prioridad', (inline as any).value)
                                if (e.key === 'Escape') setInline(null)
                              }}
                              className="relative w-full h-2 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-stone-400 [&::-webkit-slider-thumb]:shadow"
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          onDoubleClick={() => setInline({ id: p.id_producto, field: 'prioridad', value: p.prioridad ?? 0 })}
                          className="flex items-center gap-2 cursor-pointer"
                          title="Doble clic para editar prioridad"
                        >
                          <div className="flex-1 h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${(p.prioridad ?? 0) * 10}%`, background: prioridadBg(p.prioridad ?? 0) }} />
                          </div>
                          <span className={`text-[11px] font-semibold w-10 ${prio.color}`}>{prio.label}</span>
                        </div>
                      )}
                    </td>

                    {/* Estado — dblclick despliega picker */}
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <div className="relative inline-block">
                        <span
                          onDoubleClick={() => setInline({ id: p.id_producto, field: 'estado', value: p.estado })}
                          title="Doble clic para cambiar estado"
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full cursor-pointer select-none ${
                            p.estado === 'activo'
                              ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                              : 'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
                          }`}
                        >
                          {p.estado}
                        </span>
                        {isEstado && (
                          <EstadoPicker
                            valor={p.estado}
                            onSelect={v => guardarInline(p.id_producto, 'estado', v)}
                            onClose={() => setInline(null)}
                          />
                        )}
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setEditando(p)}
                          className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
                          title="Editar todo"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
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
        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-stone-200 dark:border-stone-800">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {(pagina - 1) * POR_PAGINA + 1}–{Math.min(pagina * POR_PAGINA, filtrados.length)} de {filtrados.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPagina(1)}
                disabled={pagina === 1}
                className="px-2 py-1 text-xs rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >«</button>
              <button
                onClick={() => setPagina(p => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="px-2.5 py-1 text-xs rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >‹</button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPaginas || Math.abs(n - pagina) <= 1)
                .reduce<(number | '...')[]>((acc, n, i, arr) => {
                  if (i > 0 && (n as number) - (arr[i - 1] as number) > 1) acc.push('...')
                  acc.push(n)
                  return acc
                }, [])
                .map((n, i) =>
                  n === '...' ? (
                    <span key={`e${i}`} className="px-1 text-stone-400 text-xs">…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPagina(n as number)}
                      className={`min-w-[28px] px-2 py-1 text-xs rounded-lg font-medium transition-colors ${
                        pagina === n
                          ? 'bg-emerald-600 text-white'
                          : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >{n}</button>
                  )
                )}
              <button
                onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className="px-2.5 py-1 text-xs rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >›</button>
              <button
                onClick={() => setPagina(totalPaginas)}
                disabled={pagina === totalPaginas}
                className="px-2 py-1 text-xs rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >»</button>
            </div>
          </div>
        )}
        </div>
      )}

      {editando && (
        <EditarModal
          producto={editando}
          categorias={categorias}
          onClose={() => setEditando(null)}
          onGuardado={cargar}
        />
      )}

      {creando && (
        <EditarModal
          producto={null}
          categorias={categorias}
          onClose={() => setCreando(false)}
          onGuardado={cargar}
        />
      )}

      {inline?.field === 'imagenes' && (
        <ImagenesModal
          productoId={inline.id}
          onClose={() => { setInline(null); cargar() }}
        />
      )}
    </div>
  )
}
