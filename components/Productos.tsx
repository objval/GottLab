'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Search from 'lucide-react/dist/esm/icons/search'
import Filter from 'lucide-react/dist/esm/icons/filter'
import X from 'lucide-react/dist/esm/icons/x'
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down'
import { Grid2x2, LayoutList, Rows3 } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

const POR_PAGINA = 12

type VistaMode = 'grid' | 'list' | 'single'

interface ProductosProps {
  productos: any[]
  total: number
  pagina: number
  categorias: string[]
  filtros: {
    categoria: string
    busqueda: string
    precio: string
    disponibilidad: string
  }
}

function parseCategorias(val: string): string[] {
  if (!val || val === 'todas') return []
  return val.split(',').filter(Boolean)
}

export default function ProductosClient({ productos, total, pagina, categorias, filtros }: ProductosProps) {
  const router = useRouter()
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [inputBusqueda, setInputBusqueda] = useState(filtros.busqueda || '')
  const [filtroAbierto, setFiltroAbierto] = useState<string | null>(null)
  const [vista, setVista] = useState<VistaMode>('grid')
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>(
    () => parseCategorias(filtros.categoria)
  )

  const totalPaginas = Math.ceil(total / POR_PAGINA)

  const navegar = useCallback((params: Record<string, string>) => {
    const sp = new URLSearchParams()
    const nuevo: Record<string, string> = { ...filtros, pagina: String(pagina), ...params }

    if (!params.pagina) nuevo.pagina = '1'

    Object.entries(nuevo).forEach(([k, v]) => {
      if (v && v !== 'todas' && v !== 'todos' && v !== '') {
        sp.set(k, v)
      }
    })

    const query = sp.toString()
    router.push(`/productos${query ? `?${query}` : ''}`)
  }, [filtros, pagina, router])

  const aplicarCategoria = useCallback((cat: string) => {
    const next = categoriasSeleccionadas.includes(cat)
      ? categoriasSeleccionadas.filter(c => c !== cat)
      : [...categoriasSeleccionadas, cat]
    setCategoriasSeleccionadas(next)
    navegar({ categoria: next.length > 0 ? next.join(',') : 'todas' })
  }, [categoriasSeleccionadas, navegar])

  const limpiarCategorias = useCallback(() => {
    setCategoriasSeleccionadas([])
    navegar({ categoria: 'todas' })
  }, [navegar])

  const handleBusqueda = (e: React.FormEvent) => {
    e.preventDefault()
    navegar({ busqueda: inputBusqueda })
  }

  const toggleFiltro = (nombre: string) => {
    setFiltroAbierto(filtroAbierto === nombre ? null : nombre)
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 border-b border-emerald-100 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
          <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-1">Catálogo de Plantas</h1>
          <p className="text-gray-600 dark:text-stone-400 text-sm sm:text-base">Descubre nuestra colección de plantas in vitro exclusivas</p>
        </div>
      </div>

      {/* Mobile Category Carousel - NOT sticky, scrolls away */}
      <div className="lg:hidden bg-white dark:bg-stone-900 border-b border-gray-100 dark:border-stone-800 px-4 py-3">
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => navegar({ categoria: 'todas' })}
            className={`flex flex-col items-center gap-1.5 flex-shrink-0 transition-all ${
              filtros.categoria === 'todas' || !filtros.categoria ? 'opacity-100' : 'opacity-60'
            }`}
          >
            <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
              filtros.categoria === 'todas' || !filtros.categoria ? 'border-emerald-500' : 'border-gray-200'
            }`}>
              <Image src="/placeholder.avif" alt="Todas" width={56} height={56} className="object-cover w-full h-full" />
            </div>
            <span className="text-[10px] font-medium text-center">Todas</span>
          </button>
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => navegar({ categoria: cat })}
              className={`flex flex-col items-center gap-1.5 flex-shrink-0 transition-all ${
                filtros.categoria === cat ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
                filtros.categoria === cat ? 'border-emerald-500' : 'border-gray-200'
              }`}>
                <Image src="/placeholder.avif" alt={cat} width={56} height={56} className="object-cover w-full h-full" />
              </div>
              <span className="text-[10px] font-medium text-center capitalize">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Filter Bar - sticky */}
      <div className="lg:hidden sticky top-[64px] z-30 bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-200"
          >
            {mostrarFiltros ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            Filtrar
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setVista('grid')}
              className={`p-1.5 rounded ${vista === 'grid' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-stone-400'}`}
            >
              <Grid2x2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setVista('single')}
              className={`p-1.5 rounded ${vista === 'single' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-stone-400'}`}
            >
              <Rows3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setVista('list')}
              className={`p-1.5 rounded ${vista === 'list' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-stone-400'}`}
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile accordion filters */}
        {mostrarFiltros && (
          <div className="border-t border-gray-100 dark:border-stone-700 divide-y divide-gray-100 dark:divide-stone-700">
            {/* Buscar */}
            <div>
              <button onClick={() => toggleFiltro('buscar')} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-200">
                Buscar
                <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform ${filtroAbierto === 'buscar' ? 'rotate-180' : ''}`} />
              </button>
              {filtroAbierto === 'buscar' && (
                <div className="px-4 pb-3">
                  <form onSubmit={handleBusqueda} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Nombre o especie..."
                      value={inputBusqueda}
                      onChange={(e) => setInputBusqueda(e.target.value)}
                      onBlur={() => navegar({ busqueda: inputBusqueda })}
                      className="w-full pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </form>
                </div>
              )}
            </div>

            {/* Categoría */}
            <div>
              <button onClick={() => toggleFiltro('categoria')} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-200">
                <span className="flex items-center gap-2">
                  Categoría
                  {categoriasSeleccionadas.length > 0 && (
                    <span className="bg-emerald-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                      {categoriasSeleccionadas.length}
                    </span>
                  )}
                </span>
                <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform ${filtroAbierto === 'categoria' ? 'rotate-180' : ''}`} />
              </button>
              {filtroAbierto === 'categoria' && (
                <div className="px-4 pb-3">
                  {categoriasSeleccionadas.length > 0 && (
                    <button onClick={limpiarCategorias} className="text-xs text-emerald-600 dark:text-emerald-400 mb-2 hover:underline">
                      Limpiar selección
                    </button>
                  )}
                  <div className="max-h-44 overflow-y-auto space-y-0.5 pr-1">
                    {categorias.map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800">
                        <input
                          type="checkbox"
                          checked={categoriasSeleccionadas.includes(cat)}
                          onChange={() => aplicarCategoria(cat)}
                          className="w-3.5 h-3.5 accent-emerald-600 flex-shrink-0"
                        />
                        <span className={`text-sm capitalize ${
                          categoriasSeleccionadas.includes(cat)
                            ? 'text-emerald-800 dark:text-emerald-300 font-medium'
                            : 'text-stone-600 dark:text-stone-400'
                        }`}>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Precio */}
            <div>
              <button onClick={() => toggleFiltro('precio')} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-200">
                Precio
                <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform ${filtroAbierto === 'precio' ? 'rotate-180' : ''}`} />
              </button>
              {filtroAbierto === 'precio' && (
                <div className="px-4 pb-3 space-y-1">
                  {[
                    { value: 'todos', label: 'Todos' },
                    { value: '0-5000', label: '$0 - $5.000' },
                    { value: '5000-15000', label: '$5.000 - $15.000' },
                    { value: '15000-30000', label: '$15.000 - $30.000' },
                    { value: '30000+', label: '$30.000+' },
                  ].map((rango) => (
                    <button
                      key={rango.value}
                      onClick={() => { navegar({ precio: rango.value }); setMostrarFiltros(false) }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filtros.precio === rango.value ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-medium' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      {rango.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Disponibilidad */}
            <div>
              <button onClick={() => toggleFiltro('disponibilidad')} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-200">
                Disponibilidad
                <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform ${filtroAbierto === 'disponibilidad' ? 'rotate-180' : ''}`} />
              </button>
              {filtroAbierto === 'disponibilidad' && (
                <div className="px-4 pb-3 space-y-1">
                  {[
                    { value: 'todos', label: 'Todos' },
                    { value: 'stock', label: 'En stock' },
                    { value: 'agotado', label: 'Agotado' },
                  ].map((disp) => (
                    <button
                      key={disp.value}
                      onClick={() => { navegar({ disponibilidad: disp.value }); setMostrarFiltros(false) }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filtros.disponibilidad === disp.value ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-medium' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      {disp.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR - Desktop only */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="sticky top-20">

              {/* Buscador */}
              <form onSubmit={handleBusqueda} className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-200 dark:border-stone-700 p-4 mb-3">
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Nombre o especie..."
                    value={inputBusqueda}
                    onChange={(e) => setInputBusqueda(e.target.value)}
                    onBlur={() => navegar({ busqueda: inputBusqueda })}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-gray-200 dark:border-stone-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </form>

              {/* Categorías */}
              <div className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-200 dark:border-stone-700 p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                    Categoría
                    {categoriasSeleccionadas.length > 0 && (
                      <span className="ml-2 bg-emerald-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                        {categoriasSeleccionadas.length}
                      </span>
                    )}
                  </label>
                  {categoriasSeleccionadas.length > 0 && (
                    <button onClick={limpiarCategorias} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                      Limpiar
                    </button>
                  )}
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
                  {categorias.map((cat) => (
                    <label key={cat} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800">
                      <input
                        type="checkbox"
                        checked={categoriasSeleccionadas.includes(cat)}
                        onChange={() => aplicarCategoria(cat)}
                        className="w-3.5 h-3.5 accent-emerald-600 flex-shrink-0"
                      />
                      <span className={`text-sm capitalize ${
                        categoriasSeleccionadas.includes(cat)
                          ? 'text-emerald-800 dark:text-emerald-300 font-medium'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-200 dark:border-stone-700 p-4 mb-3">
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">Precio</label>
                <div className="space-y-1.5">
                  {[
                    { value: 'todos', label: 'Todos' },
                    { value: '0-5000', label: '$0 - $5.000' },
                    { value: '5000-15000', label: '$5.000 - $15.000' },
                    { value: '15000-30000', label: '$15.000 - $30.000' },
                    { value: '30000+', label: '$30.000+' },
                  ].map((rango) => (
                    <button
                      key={rango.value}
                      onClick={() => navegar({ precio: rango.value })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filtros.precio === rango.value
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-medium'
                          : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      {rango.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Disponibilidad */}
              <div className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-200 dark:border-stone-700 p-4">
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">Disponibilidad</label>
                <div className="space-y-1.5">
                  {[
                    { value: 'todos', label: 'Todos' },
                    { value: 'stock', label: 'En stock' },
                    { value: 'agotado', label: 'Agotado' },
                  ].map((disp) => (
                    <button
                      key={disp.value}
                      onClick={() => navegar({ disponibilidad: disp.value })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filtros.disponibilidad === disp.value
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-medium'
                          : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      {disp.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* GRID */}
          <main className="flex-1">

            {/* Carrusel de Categorías - Desktop */}
            <div className="hidden lg:block mb-6">
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => navegar({ categoria: 'todas' })}
                  className={`flex flex-col items-center gap-1.5 flex-shrink-0 transition-all ${
                    filtros.categoria === 'todas' ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`w-14 h-14 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 ${
                    filtros.categoria === 'todas' ? 'border-emerald-500' : 'border-gray-200'
                  }`}>
                    <Image src="/placeholder.avif" alt="Todas" width={72} height={72} className="object-cover w-full h-full" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-center">Todas</span>
                </button>
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => navegar({ categoria: cat })}
                    className={`flex flex-col items-center gap-1.5 flex-shrink-0 transition-all ${
                      filtros.categoria === cat ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className={`w-14 h-14 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 ${
                      filtros.categoria === cat ? 'border-emerald-500' : 'border-gray-200'
                    }`}>
                      <Image src="/placeholder.avif" alt={cat} width={72} height={72} className="object-cover w-full h-full" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-center capitalize">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-200 dark:border-stone-700 p-4 mb-6 flex items-center justify-between">
              <span className="text-sm dark:text-stone-300">Mostrando <b>{productos.length}</b> de <b>{total}</b> productos</span>
              {totalPaginas > 1 && (
                <span className="text-sm text-gray-500">Pág. {pagina} de {totalPaginas}</span>
              )}
            </div>

            {/* Vista Grid (2 cols mobile, 3 desktop) */}
            {vista === 'grid' && (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
                {productos.map((producto) => (
                  <ProductCard key={producto.id_producto} producto={producto} />
                ))}
              </div>
            )}

            {/* Vista Single (1 col, imagen grande) */}
            {vista === 'single' && (
              <div className="grid grid-cols-1 gap-4">
                {productos.map((producto) => (
                  <ProductCard key={producto.id_producto} producto={producto} size="md" />
                ))}
              </div>
            )}

            {/* Vista List (horizontal con detalles) */}
            {vista === 'list' && (
              <div className="space-y-3">
                {productos.map((producto) => (
                  <Link
                    key={producto.id_producto}
                    href={`/productos/${producto.id_producto}`}
                    className="group flex bg-white dark:bg-stone-800 rounded-2xl border border-gray-100 dark:border-stone-700 hover:border-emerald-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 bg-stone-50 overflow-hidden">
                      <Image
                        src={"/placeholder.avif"}
                        alt={producto.nombre}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {producto.nuevo && (
                        <span className="absolute top-1.5 left-1.5 bg-violet-100 text-violet-700 text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
                          Nuevo
                        </span>
                      )}
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col justify-center flex-1 min-w-0">
                      <h3 className="font-bold text-stone-800 dark:text-stone-100 text-sm leading-tight line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{producto.nombre}</h3>
                      <p className="text-[10px] sm:text-xs text-stone-400 italic mt-0.5 line-clamp-1">{producto.nombre_cientifico}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {producto.stock_total > 0 ? (
                          <span className="text-[9px] sm:text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">En stock</span>
                        ) : (
                          <span className="text-[9px] sm:text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">Agotado</span>
                        )}
                      </div>
                      <div className="mt-2">
                        <span className="text-base sm:text-lg font-black text-stone-900 dark:text-white">${Number(producto.precio_venta).toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => navegar({ pagina: String(Math.max(1, pagina - 1)) })}
                  disabled={pagina === 1}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-stone-600 dark:text-stone-300 hover:bg-gray-50 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Anterior
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => navegar({ pagina: String(n) })}
                    className={`w-9 h-9 text-sm rounded-lg transition-colors ${
                      n === pagina
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'border border-gray-200 dark:border-stone-600 dark:text-stone-300 hover:bg-gray-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => navegar({ pagina: String(Math.min(totalPaginas, pagina + 1)) })}
                  disabled={pagina === totalPaginas}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-stone-600 dark:text-stone-300 hover:bg-gray-50 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}