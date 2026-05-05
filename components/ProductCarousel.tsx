'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right'
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart'
import Clock from 'lucide-react/dist/esm/icons/clock'
import Leaf from 'lucide-react/dist/esm/icons/leaf'

// Datos de ejemplo - en producción vendrían de API/DB
const items = [
  {
    id: 1,
    tipo: 'preventa' as const,
    nombre: 'Orquídea GottLab Hybrid #1',
    nombreCientifico: 'Ophrys × gottlab',
    precio: 149.99,
    precioOriginal: 249.99,
    imagen: '/placeholder.avif',
    etiquetas: ['Preventa', 'Exclusivo'],
    descripcionCorta: 'Híbrido exclusivo de laboratorio',
    fechaLanzamiento: '2024-02-15',
    stock: 0,
    rating: 5.0,
  },
  {
    id: 2,
    tipo: 'producto' as const,
    nombre: 'Orquídea Phalaenopsis Alba',
    nombreCientifico: 'Phalaenopsis amabilis',
    precio: 49.99,
    precioOriginal: 69.99,
    imagen: '/placeholder.avif',
    etiquetas: ['Exclusivo', 'Raro'],
    descripcionCorta: 'Variedad alba con flores blancas puras',
    stock: 8,
    rating: 4.8,
  },
  {
    id: 3,
    tipo: 'preventa' as const,
    nombre: 'Nepenthes Rajah Elite',
    nombreCientifico: 'Nepenthes rajah',
    precio: 299.99,
    precioOriginal: 399.99,
    imagen: '/placeholder.avif',
    etiquetas: ['Preventa', 'Ultra Exclusivo'],
    descripcionCorta: 'La planta jarra más grande del mundo',
    fechaLanzamiento: '2024-03-01',
    stock: 0,
    rating: 5.0,
  },
  {
    id: 4,
    tipo: 'producto' as const,
    nombre: 'Dionaea Muscipa Red',
    nombreCientifico: 'Dionaea muscipula',
    precio: 35.00,
    imagen: '/placeholder.avif',
    etiquetas: ['Popular'],
    descripcionCorta: 'Atrapamoscas de interior roja intensa',
    stock: 15,
    rating: 4.9,
  },
  {
    id: 5,
    tipo: 'producto' as const,
    nombre: 'Bonsái Ficus Retusa',
    nombreCientifico: 'Ficus retusa',
    precio: 89.99,
    precioOriginal: 120.00,
    imagen: '/placeholder.avif',
    etiquetas: ['Edad: 5 años'],
    descripcionCorta: 'Bonsái clásico con 5 años de cultivo',
    stock: 3,
    rating: 4.7,
  },
  {
    id: 6,
    tipo: 'preventa' as const,
    nombre: 'Heliamphora Chimantensis',
    nombreCientifico: 'Heliamphora chimantensis',
    precio: 189.99,
    precioOriginal: 259.99,
    imagen: '/placeholder.avif',
    etiquetas: ['Preventa', 'Raro'],
    descripcionCorta: 'Planta jarra de tepuy venezolano',
    fechaLanzamiento: '2024-02-28',
    stock: 0,
    rating: 4.9,
  },
]

// Ordenar: preventas primero (más recientes), luego productos
const sortedItems = [...items].sort((a, b) => {
  if (a.tipo === 'preventa' && b.tipo !== 'preventa') return -1
  if (a.tipo !== 'preventa' && b.tipo === 'preventa') return 1
  if (a.tipo === 'preventa' && b.tipo === 'preventa') {
    // Ordenar preventas por fecha (más reciente primero)
    return new Date(b.fechaLanzamiento || '').getTime() - new Date(a.fechaLanzamiento || '').getTime()
  }
  return 0
})

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % sortedItems.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + sortedItems.length) % sortedItems.length)
  }, [])

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const currentItem = sortedItems[currentIndex]
  const isPreventa = currentItem.tipo === 'preventa'

  return (
    <section className="relative py-16 bg-gradient-to-br from-stone-50 via-emerald-50/30 to-stone-100 overflow-hidden">
      {/* Decoraciones de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            <Leaf className="h-4 w-4" />
            Descubre lo Nuevo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
            Productos y Preventas
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Explora nuestras últimas preventas exclusivas y los productos más populares de nuestro catálogo
          </p>
        </div>

        {/* Carrusel Principal */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Imagen */}
              <div className="relative aspect-square lg:aspect-auto lg:h-[500px] bg-stone-100">
                <Image
                  src={currentItem.imagen}
                  alt={currentItem.nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                
                {/* Badge de tipo */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${
                    isPreventa 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                      : 'bg-emerald-600 text-white shadow-lg'
                  }`}>
                    {isPreventa ? (
                      <>
                        <Clock className="h-4 w-4" />
                        PREVENTA
                      </>
                    ) : (
                      <>
                        <Leaf className="h-4 w-4" />
                        DISPONIBLE
                      </>
                    )}
                  </span>
                </div>

                {/* Etiquetas adicionales */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {currentItem.etiquetas
                    .filter(tag => tag !== 'Preventa')
                    .map((tag, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </div>

              {/* Contenido */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-2">
                  <span className="text-sm text-emerald-600 font-medium uppercase tracking-wide">
                    {isPreventa ? 'Próximo Lanzamiento' : 'En Stock'}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-stone-800 mb-2">
                  {currentItem.nombre}
                </h3>
                
                <p className="text-stone-500 italic mb-4">
                  {currentItem.nombreCientifico}
                </p>

                <p className="text-stone-600 text-lg mb-6">
                  {currentItem.descripcionCorta}
                </p>

                {/* Precio */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl md:text-4xl font-bold text-emerald-600">
                    ${currentItem.precio.toFixed(2)}
                  </span>
                  {currentItem.precioOriginal && (
                    <span className="text-xl text-stone-400 line-through">
                      ${currentItem.precioOriginal.toFixed(2)}
                    </span>
                  )}
                  {currentItem.precioOriginal && (
                    <span className="text-sm text-emerald-600 font-medium bg-emerald-100 px-2 py-1 rounded">
                      {Math.round((1 - currentItem.precio / currentItem.precioOriginal) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(currentItem.rating) ? 'text-amber-400' : 'text-stone-300'
                        }`}
                        fill={i < Math.floor(currentItem.rating) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-stone-500">({currentItem.rating})</span>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/productos"
                    className={`flex-1 py-4 px-6 rounded-xl font-semibold text-center transition-all flex items-center justify-center gap-2 ${
                      isPreventa
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/25'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25'
                    }`}
                  >
                    {isPreventa ? 'Ver Preventa' : 'Ver Producto'}
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                  
                  {!isPreventa && (
                    <button className="py-4 px-6 border-2 border-stone-300 text-stone-700 rounded-xl font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Agregar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controles de navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-stone-700 hover:text-emerald-600 hover:shadow-xl transition-all z-20"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-stone-700 hover:text-emerald-600 hover:shadow-xl transition-all z-20"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mt-6">
          {sortedItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-emerald-600' 
                  : 'w-2 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Miniaturas */}
        <div className="hidden lg:grid grid-cols-6 gap-4 mt-8">
          {sortedItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                index === currentIndex 
                  ? 'ring-2 ring-emerald-500 ring-offset-2' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={item.imagen}
                alt={item.nombre}
                fill
                className="object-cover"
                sizes="150px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  item.tipo === 'preventa' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-emerald-600 text-white'
                }`}>
                  {item.tipo === 'preventa' ? 'PREVENTA' : 'STOCK'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
