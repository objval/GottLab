'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Search from 'lucide-react/dist/esm/icons/search'
import Filter from 'lucide-react/dist/esm/icons/filter'
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart'
import Heart from 'lucide-react/dist/esm/icons/heart'
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down'
import Leaf from 'lucide-react/dist/esm/icons/leaf'
import Star from 'lucide-react/dist/esm/icons/star'
import Grid3X3 from 'lucide-react/dist/esm/icons/grid-3x3'
import LayoutList from 'lucide-react/dist/esm/icons/layout-list'

const categorias = [
  { id: 'todas', nombre: 'Todas las Categorías', cantidad: 156 },
  { id: 'orquideas', nombre: 'Orquídeas', cantidad: 24 },
  { id: 'carnivoras', nombre: 'Plantas Carnívoras', cantidad: 18 },
  { id: 'helechos', nombre: 'Helechos', cantidad: 32 },
  { id: 'bonsai', nombre: 'Bonsái', cantidad: 12 },
  { id: 'cactus', nombre: 'Cactus y Suculentas', cantidad: 45 },
  { id: 'acuaticas', nombre: 'Plantas Acuáticas', cantidad: 15 },
  { id: 'tropicales', nombre: 'Tropicales', cantidad: 28 },
]

const precios = [
  { id: 'todos', rango: 'Todos los Precios' },
  { id: '0-30', rango: '$0 - $30' },
  { id: '30-60', rango: '$30 - $60' },
  { id: '60-100', rango: '$60 - $100' },
  { id: '100+', rango: '$100+' },
]

const disponibilidad = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'stock', nombre: 'En Stock' },
  { id: 'preventa', nombre: 'Preventa' },
]

const productos = [
  {
    id: 1,
    nombre: 'Orquídea Phalaenopsis Alba',
    nombreCientifico: 'Phalaenopsis amabilis',
    precio: 49.99,
    precioOriginal: 69.99,
    categoria: 'orquideas',
    stock: 8,
    disponibilidad: 'stock',
    rating: 4.8,
    reseñas: 12,
    imagen: '/placeholder.avif',
    etiquetas: ['Exclusivo', 'Raro'],
    descripcionCorta: 'Variedad alba con flores blancas puras'
  },
  {
    id: 2,
    nombre: 'Dionaea Muscipa Red',
    nombreCientifico: 'Dionaea muscipula',
    precio: 35.00,
    categoria: 'carnivoras',
    stock: 15,
    disponibilidad: 'stock',
    rating: 4.9,
    reseñas: 8,
    imagen: '/placeholder.avif',
    etiquetas: ['Popular'],
    descripcionCorta: 'Atrapamoscas de interior roja intensa'
  },
  {
    id: 3,
    nombre: 'Bonsái Ficus Retusa',
    nombreCientifico: 'Ficus retusa',
    precio: 89.99,
    precioOriginal: 120.00,
    categoria: 'bonsai',
    stock: 3,
    disponibilidad: 'stock',
    rating: 4.7,
    reseñas: 23,
    imagen: '/placeholder.avif',
    etiquetas: ['Edad: 5 años'],
    descripcionCorta: 'Bonsái clásico con 5 años de cultivo'
  },
  {
    id: 4,
    nombre: 'Echeveria Perle von Nürnberg',
    nombreCientifico: 'Echeveria perle',
    precio: 22.50,
    categoria: 'cactus',
    stock: 25,
    disponibilidad: 'stock',
    rating: 4.6,
    reseñas: 18,
    imagen: '/placeholder.avif',
    etiquetas: ['Fácil'],
    descripcionCorta: 'Suculenta de color lila perla'
  },
  {
    id: 5,
    nombre: 'Orquídea GottLab Hybrid #1',
    nombreCientifico: 'Ophrys × gottlab',
    precio: 149.99,
    precioOriginal: 249.99,
    categoria: 'orquideas',
    stock: 0,
    disponibilidad: 'preventa',
    rating: 5.0,
    reseñas: 3,
    imagen: '/placeholder.avif',
    etiquetas: ['Preventa', 'Exclusivo'],
    descripcionCorta: 'Híbrido exclusivo de laboratorio'
  },
  {
    id: 6,
    nombre: 'Nepenthes Ventrata',
    nombreCientifico: 'Nepenthes × ventrata',
    precio: 45.00,
    categoria: 'carnivoras',
    stock: 6,
    disponibilidad: 'stock',
    rating: 4.5,
    reseñas: 15,
    imagen: '/placeholder.avif',
    etiquetas: [],
    descripcionCorta: 'Planta jarra híbrida resistente'
  },
  {
    id: 7,
    nombre: 'Helecho Asplenium Nidus',
    nombreCientifico: 'Asplenium nidus',
    precio: 28.99,
    categoria: 'helechos',
    stock: 12,
    disponibilidad: 'stock',
    rating: 4.4,
    reseñas: 9,
    imagen: '/placeholder.avif',
    etiquetas: ['Interior'],
    descripcionCorta: 'Helecho nido de ave elegante'
  },
  {
    id: 8,
    nombre: 'Anubias Barteri',
    nombreCientifico: 'Anubias barteri',
    precio: 19.99,
    categoria: 'acuaticas',
    stock: 20,
    disponibilidad: 'stock',
    rating: 4.7,
    reseñas: 11,
    imagen: '/placeholder.avif',
    etiquetas: ['Acuática'],
    descripcionCorta: 'Planta acuática de hojas anchas'
  },
]

export default function ProductosPage() {
  const [categoriaActiva, setCategoriaActiva] = useState('todas')
  const [precioActivo, setPrecioActivo] = useState('todos')
  const [disponibilidadActiva, setDisponibilidadActiva] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [vista, setVista] = useState<'grid' | 'lista'>('grid')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const productosFiltrados = productos.filter(producto => {
    const matchCategoria = categoriaActiva === 'todas' || producto.categoria === categoriaActiva
    const matchDisponibilidad = disponibilidadActiva === 'todos' || producto.disponibilidad === disponibilidadActiva
    const matchBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                         producto.nombreCientifico.toLowerCase().includes(busqueda.toLowerCase())
    
    let matchPrecio = true
    if (precioActivo === '0-30') matchPrecio = producto.precio <= 30
    else if (precioActivo === '30-60') matchPrecio = producto.precio > 30 && producto.precio <= 60
    else if (precioActivo === '60-100') matchPrecio = producto.precio > 60 && producto.precio <= 100
    else if (precioActivo === '100+') matchPrecio = producto.precio > 100
    
    return matchCategoria && matchDisponibilidad && matchBusqueda && matchPrecio
  })

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header de la página */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
          <h1 className="text-4xl font-bold text-emerald-900 mb-3">Catálogo de Plantas</h1>
          <p className="text-emerald-700 text-lg">Descubre nuestra colección de plantas in vitro exclusivas</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filtros */}
          <aside className="lg:w-72 flex-shrink-0">
            {/* Filtros móvil */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="lg:hidden w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-stone-200 mb-4"
            >
              <span className="font-medium text-stone-700 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </span>
              <ChevronDown className={`h-5 w-5 text-stone-400 transition-transform ${mostrarFiltros ? 'rotate-180' : ''}`} />
            </button>

            {/* Contenedor de filtros */}
            <div className={`${mostrarFiltros ? 'block' : 'hidden'} lg:block space-y-6`}>
              {/* Buscador */}
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
                <label className="block text-sm font-semibold text-stone-700 mb-2">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Nombre o especie..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categorías */}
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
                <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-stone-600" />
                  Categorías
                </h3>
                <div className="space-y-2">
                  {categorias.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoriaActiva(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        categoriaActiva === cat.id
                          ? 'bg-stone-800 text-white'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <span>{cat.nombre}</span>
                      <span className={`text-xs ${categoriaActiva === cat.id ? 'text-stone-300' : 'text-stone-400'}`}>
                        {cat.cantidad}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
                <h3 className="font-semibold text-stone-800 mb-4">Rango de Precio</h3>
                <div className="space-y-2">
                  {precios.map((precio) => (
                    <button
                      key={precio.id}
                      onClick={() => setPrecioActivo(precio.id)}
                      className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                        precioActivo === precio.id
                          ? 'bg-stone-800 text-white'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {precio.rango}
                    </button>
                  ))}
                </div>
              </div>

              {/* Disponibilidad */}
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
                <h3 className="font-semibold text-stone-800 mb-4">Disponibilidad</h3>
                <div className="space-y-2">
                  {disponibilidad.map((disp) => (
                    <button
                      key={disp.id}
                      onClick={() => setDisponibilidadActiva(disp.id)}
                      className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                        disponibilidadActiva === disp.id
                          ? 'bg-stone-800 text-white'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {disp.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset filtros */}
              <button
                onClick={() => {
                  setCategoriaActiva('todas')
                  setPrecioActivo('todos')
                  setDisponibilidadActiva('todos')
                  setBusqueda('')
                }}
                className="w-full py-3 text-stone-600 hover:text-stone-800 text-sm font-medium border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </aside>

          {/* Contenido principal - Grid de productos */}
          <main className="flex-1">
            {/* Barra superior */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-stone-600">
                  Mostrando <span className="font-semibold text-stone-800">{productosFiltrados.length}</span> productos
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-stone-500">Vista:</span>
                  <div className="flex bg-stone-100 rounded-lg p-1">
                    <button
                      onClick={() => setVista('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        vista === 'grid' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500'
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setVista('lista')}
                      className={`p-2 rounded-md transition-colors ${
                        vista === 'lista' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500'
                      }`}
                    >
                      <LayoutList className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de productos */}
            <div className={`grid gap-6 ${
              vista === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {productosFiltrados.map((producto) => (
                <div
                  key={producto.id}
                  className={`group bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                    vista === 'lista' ? 'flex flex-col sm:flex-row' : ''
                  }`}
                >
                  {/* Imagen */}
                  <div className={`relative bg-stone-100 ${
                    vista === 'lista' ? 'sm:w-48 h-48 sm:h-auto flex-shrink-0' : 'aspect-square'
                  }`}>
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Etiquetas */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {producto.etiquetas.map((etiqueta) => (
                        <span
                          key={etiqueta}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            etiqueta === 'Preventa'
                              ? 'bg-stone-800 text-white'
                              : etiqueta === 'Exclusivo'
                              ? 'bg-stone-600 text-white'
                              : 'bg-white/90 text-stone-700'
                          }`}
                        >
                          {etiqueta}
                        </span>
                      ))}
                    </div>

                    {/* Botón favorito */}
                    <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-stone-100">
                      <Heart className="h-4 w-4 text-stone-600" />
                    </button>

                    {/* Badge de stock bajo */}
                    {producto.stock > 0 && producto.stock <= 5 && (
                      <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                        ¡Solo {producto.stock}!
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-3">
                      <h3 className="font-semibold text-stone-800 text-lg mb-1 group-hover:text-stone-600 transition-colors">
                        {producto.nombre}
                      </h3>
                      <p className="text-sm text-stone-500 italic">
                        {producto.nombreCientifico}
                      </p>
                    </div>

                    <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                      {producto.descripcionCorta}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(producto.rating) ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-stone-500">({producto.reseñas})</span>
                    </div>

                    {/* Precio y acciones */}
                    <div className="mt-auto pt-4 border-t border-stone-100">
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-stone-800">
                            ${producto.precio.toFixed(2)}
                          </span>
                          {producto.precioOriginal && (
                            <span className="text-sm text-stone-400 line-through ml-2">
                              ${producto.precioOriginal.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {producto.disponibilidad === 'preventa' && (
                          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
                            Preventa
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/productos/${producto.id}`}
                          className="flex-1 py-2.5 px-4 text-center border-2 border-stone-300 text-stone-700 font-medium rounded-lg hover:border-stone-400 hover:bg-stone-50 transition-colors"
                        >
                          Ver Detalles
                        </Link>
                        <button 
                          className={`p-2.5 rounded-lg transition-colors ${
                            producto.stock === 0 && producto.disponibilidad !== 'preventa'
                              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                              : 'bg-stone-800 text-white hover:bg-stone-700'
                          }`}
                          disabled={producto.stock === 0 && producto.disponibilidad !== 'preventa'}
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mensaje si no hay resultados */}
            {productosFiltrados.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-12 text-center">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-stone-400" />
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-stone-600 mb-6">
                  Intenta ajustar tus filtros o términos de búsqueda
                </p>
                <button
                  onClick={() => {
                    setCategoriaActiva('todas')
                    setPrecioActivo('todos')
                    setDisponibilidadActiva('todos')
                    setBusqueda('')
                  }}
                  className="px-6 py-3 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
