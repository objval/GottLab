'use client'

import { useState, useEffect } from 'react'
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right'
import Leaf from 'lucide-react/dist/esm/icons/leaf'
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart'
import Sparkles from 'lucide-react/dist/esm/icons/sparkles'
import Link from 'next/link'
import Image from 'next/image'

const gradients = [
  "from-green-50 via-emerald-100 to-green-200",
  "from-emerald-100 via-teal-200 to-green-300",
  "from-lime-50 via-green-100 to-emerald-200",
  "from-teal-50 via-emerald-100 to-green-200",
]

export default function HeroCarousel({ productos }: { productos: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const slides = productos.slice(0, 4)
  const total = slides.length
  const minSwipeDistance = 50

  useEffect(() => {
    if (total === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % total)
    }, 5000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) nextSlide()
    if (isRightSwipe) prevSlide()
  }

  if (slides.length === 0) return null

  const current = slides[currentSlide]
  const cats = current.categorias as any
  const categoria = Array.isArray(cats) ? (cats[0]?.nombre || '') : (cats?.nombre || '')

  return (
    <div 
      className={`relative min-h-screen overflow-hidden touch-pan-y bg-gradient-to-br ${gradients[currentSlide % gradients.length]}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Overlay Pattern */}
      <div className="absolute inset-0 bg-white/10" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30">
        <div style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          position: "absolute",
          inset: 0
        }} />
      </div>
      </div>

      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide: any, index: number) => (
          <div
            key={slide.id_producto}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Content Container */}
            <div className="relative z-10 min-h-screen flex items-center px-4 sm:px-6 lg:px-12">
              <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
                {/* Text Content */}
                <div className="lg:w-[55%] text-green-900 mt-2 lg:mt-0 space-y-2 lg:space-y-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 lg:w-6 lg:h-5 text-green-600" />
                    <span className="text-sm lg:text-base font-semibold uppercase tracking-widest text-green-700">
                      {categoria || 'Nueva llegada'}
                    </span>
                  </div>
                  
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.05] bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
                    {slide.nombre}
                  </h1>

                  {slide.nombre_cientifico && (
                    <p className="text-sm lg:text-base text-green-700/70 italic">{slide.nombre_cientifico}</p>
                  )}
                  
                  {slide.descripcion && (
                    <p className="text-sm lg:text-lg text-green-800/90 max-w-lg leading-relaxed line-clamp-2">
                      {slide.descripcion}
                    </p>
                  )}
                  
                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2 mb-6 lg:mb-8">
                    {slide.stock_total > 0 && (
                      <span className="bg-white/90 backdrop-blur-sm border border-green-200 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium text-green-700 shadow-sm">
                        En Stock
                      </span>
                    )}
                    <span className="bg-white/90 backdrop-blur-sm border border-green-200 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium text-green-700 shadow-sm">
                      Envío seguro
                    </span>
                    <span className="bg-white/90 backdrop-blur-sm border border-green-200 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium text-green-700 shadow-sm">
                      Cultivo in vitro
                    </span>
                  </div>

                  {/* Desktop Buttons */}
                  <div className="hidden lg:flex gap-4">
                    <Link 
                      href={`/productos/${slide.id_producto}`}
                      className="inline-flex items-center justify-center px-8 py-4 bg-stone-800 text-white font-semibold rounded-xl hover:bg-stone-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Ver Producto
                    </Link>
                    <Link 
                      href="/productos"
                      className="inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm text-stone-800 font-semibold rounded-xl border-2 border-stone-200 hover:bg-white hover:border-stone-300 transition-all"
                    >
                      Ver Catálogo
                    </Link>
                  </div>
                </div>

                {/* Product Card */}
                <div className="lg:w-[45%] flex justify-center">
                  <div className="relative w-full max-w-[280px] sm:max-w-xs lg:max-w-md">
                    <div className="absolute inset-0 -m-4 lg:-m-8">
                      <div className="absolute inset-0 bg-gradient-radial from-white/60 via-white/30 to-transparent rounded-3xl blur-2xl" />
                      <div className="absolute top-1/4 left-0 w-32 h-16 bg-white/40 rounded-full blur-xl" />
                      <div className="absolute top-1/3 right-0 w-24 h-12 bg-white/30 rounded-full blur-xl" />
                      <div className="absolute bottom-1/4 left-1/4 w-40 h-20 bg-white/50 rounded-full blur-2xl" />
                    </div>
                    
                    <div className="relative bg-white/50 backdrop-blur-md rounded-2xl lg:rounded-3xl p-4 lg:p-6 border-2 border-white/70 shadow-2xl ring-4 ring-white/20">
                      {/* Badge */}
                      <div className="absolute -top-3 -right-3 lg:-top-4 lg:-right-4 bg-green-500 text-white px-3 py-1 lg:px-4 lg:py-1.5 rounded-full font-semibold text-xs lg:text-sm shadow-lg flex items-center gap-1 z-20">
                        <Sparkles className="w-3 h-3 lg:w-4 lg:h-4" />
                        Nuevo
                      </div>
                      
                      <div className="relative aspect-square rounded-xl lg:rounded-2xl overflow-hidden bg-gradient-to-b from-stone-100/60 to-stone-200/60 border-4 border-white/80 shadow-inner">
                        <Image
                          src={"/placeholder.avif"}
                          alt={slide.nombre}
                          fill
                          className="object-cover"
                          priority={index === 0}
                          sizes="(max-width: 768px) 280px, 400px"
                        />
                      </div>
                    </div>

                    {/* Slide Indicators - mobile */}
                    <div className="flex justify-center gap-2 mt-4 lg:hidden">
                      {slides.map((_: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => goToSlide(idx)}
                          className={`transition-all duration-300 rounded-full ${
                            idx === currentSlide 
                              ? 'w-6 h-2 bg-stone-700' 
                              : 'w-2 h-2 bg-stone-400/60 hover:bg-stone-500'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="lg:hidden absolute bottom-4 left-4 right-4 flex gap-2">
                <Link 
                  href={`/productos/${slide.id_producto}`}
                  className="flex items-center justify-center flex-1 px-4 py-3 bg-stone-800 text-white font-semibold rounded-xl shadow-lg active:scale-[0.98] transition-transform text-sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Ver Producto
                </Link>
                <Link 
                  href="/productos"
                  className="flex items-center justify-center flex-1 px-4 py-3 bg-white/90 backdrop-blur-sm text-stone-800 font-semibold rounded-xl border-2 border-stone-200 active:scale-[0.98] transition-transform text-sm"
                >
                  Catálogo
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 backdrop-blur-sm text-stone-700 rounded-full items-center justify-center hover:bg-white hover:shadow-lg transition-all border border-stone-200"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 backdrop-blur-sm text-stone-700 rounded-full items-center justify-center hover:bg-white hover:shadow-lg transition-all border border-stone-200"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Desktop Slide Indicators */}
      <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 gap-2">
        {slides.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? 'w-8 h-2 bg-stone-700' 
                : 'w-2 h-2 bg-stone-400/60 hover:bg-stone-500'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
