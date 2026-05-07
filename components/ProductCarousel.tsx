'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right'
import Leaf from 'lucide-react/dist/esm/icons/leaf'

const formatCLP = (n: number) => `$${Number(n).toLocaleString('es-CL')}`

export default function ProductCarousel({ productos }: { productos: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const items = productos.length > 0 ? productos : []

  const nextSlide = useCallback(() => {
    if (items.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const prevSlide = useCallback(() => {
    if (items.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    if (!isAutoPlaying || items.length === 0) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide, items.length])

  if (items.length === 0) return null

  const currentItem = items[currentIndex]
  const enStock = currentItem.stock_total > 0
  const cats = currentItem.categorias as any
  const categoria = Array.isArray(cats) ? (cats[0]?.nombre || '') : (cats?.nombre || '')

  return (
    <section className="relative py-16 bg-gradient-to-br from-stone-50 via-emerald-50/30 to-stone-100 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            <Leaf className="h-4 w-4" />
            Descubre lo Nuevo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Nuestro Catálogo
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explora las últimas plantas de nuestro laboratorio
          </p>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Imagen */}
              <div className="relative aspect-square lg:aspect-auto lg:h-[500px] bg-stone-50">
                <Image
                  src={"/placeholder.avif"}
                  alt={currentItem.nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${
                    enStock 
                      ? 'bg-emerald-600 text-white shadow-lg' 
                      : 'bg-gray-800 text-white shadow-lg'
                  }`}>
                    <Leaf className="h-4 w-4" />
                    {enStock ? 'DISPONIBLE' : 'AGOTADO'}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                {categoria && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full w-fit mb-3">
                    <Leaf className="h-3 w-3" />
                    {categoria}
                  </span>
                )}

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
                  {currentItem.nombre}
                </h3>
                
                {currentItem.nombre_cientifico && (
                  <p className="text-gray-400 italic mb-4">{currentItem.nombre_cientifico}</p>
                )}

                {currentItem.descripcion && (
                  <p className="text-gray-500 text-base mb-6 line-clamp-3">{currentItem.descripcion}</p>
                )}

                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl md:text-4xl font-black text-black">
                    {formatCLP(currentItem.precio_venta)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-8">
                  <div className={`w-2.5 h-2.5 rounded-full ${enStock ? 'bg-emerald-500' : 'bg-red-400'}`} />
                  <span className={`text-sm font-medium ${enStock ? 'text-emerald-700' : 'text-red-600'}`}>
                    {enStock ? `${currentItem.stock_total} disponibles` : 'Agotado'}
                  </span>
                </div>

                <Link
                  href={`/productos/${currentItem.id_producto}`}
                  className="w-full sm:w-auto py-4 px-8 bg-black text-white rounded-2xl font-bold text-center hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-2"
                >
                  Ver Producto
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:text-emerald-600 hover:shadow-xl transition-all z-20"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:text-emerald-600 hover:shadow-xl transition-all z-20"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_: any, index: number) => (
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

        {/* Miniaturas desktop */}
        {items.length > 1 && (
          <div className="hidden lg:grid grid-cols-6 gap-3 mt-8">
            {items.slice(0, 6).map((item: any, index: number) => (
              <button
                key={item.id_producto}
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-[4/3] rounded-lg overflow-hidden transition-all ${
                  index === currentIndex 
                    ? 'ring-2 ring-emerald-500 ring-offset-2' 
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={"/placeholder.avif"}
                  alt={item.nombre}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5">
                  <p className="text-white text-[10px] font-bold truncate">{item.nombre}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
