'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right'
import Leaf from 'lucide-react/dist/esm/icons/leaf'
import Sparkles from 'lucide-react/dist/esm/icons/sparkles'
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right'

const formatCLP = (n: number) => `$${Number(n).toLocaleString('es-CL')}`

const backgroundGradients = [
  'from-emerald-50 via-lime-50 to-white',
  'from-emerald-50 via-teal-50 to-white',
  'from-lime-50 via-emerald-50 to-white',
  'from-teal-50 via-emerald-50 to-white',
]

const accentGradients = [
  'from-emerald-500/35 via-teal-400/20 to-transparent',
  'from-lime-500/35 via-emerald-300/20 to-transparent',
  'from-teal-500/35 via-emerald-400/20 to-transparent',
  'from-emerald-400/35 via-lime-300/20 to-transparent',
]

export default function HeroCarouselV2({ productos }: { productos: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const slides = productos.slice(0, 4)
  const total = slides.length

  useEffect(() => {
    if (isPaused || total <= 1) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % total)
    }, 6000)
    return () => clearInterval(interval)
  }, [isPaused, total])

  if (total === 0) return null

  const current = slides[currentSlide]
  const next = slides[(currentSlide + 1) % total]
  const currentImage = current.imagenes_productos?.[0]?.url || '/placeholder.avif'
  const nextImage = next?.imagenes_productos?.[0]?.url || '/placeholder.avif'
  const cats = current.categorias as any
  const categoria = Array.isArray(cats) ? (cats[0]?.nombre || '') : (cats?.nombre || '')
  const enStock = current.stock_total > 0
  const badgeLabel = current.nuevo ? 'Nuevo' : current.destacado ? 'Destacado' : 'Selección'
  const badgeTone = current.nuevo
    ? 'bg-emerald-600 text-white'
    : current.destacado
      ? 'bg-lime-400 text-stone-900'
      : 'bg-stone-900 text-white'

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.targetTouches[0].clientX
    touchEndX.current = null
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    touchEndX.current = event.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const distance = touchStartX.current - touchEndX.current
    if (Math.abs(distance) < 50) return
    if (distance > 0) {
      setCurrentSlide((prev) => (prev + 1) % total)
      return
    }
    setCurrentSlide((prev) => (prev - 1 + total) % total)
  }

  return (
    <section
      className={`relative overflow-hidden font-[var(--font-geist-sans)] bg-gradient-to-br ${backgroundGradients[currentSlide % backgroundGradients.length]} dark:from-stone-950 dark:via-stone-900 dark:to-stone-950`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 right-0 h-[360px] w-[360px] rounded-full bg-emerald-400/20 blur-[120px]" />
        <div className="absolute -bottom-40 left-[-120px] h-[420px] w-[420px] rounded-full bg-lime-300/30 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.35) 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-stone-950/95 dark:via-stone-950/50" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[72vh] items-center gap-10 py-10 lg:min-h-[78vh] lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-700 shadow-sm backdrop-blur dark:bg-white/10 dark:text-emerald-200">
                <Sparkles className="h-4 w-4" />
                Edición de laboratorio
              </span>
              {categoria && (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <Leaf className="h-4 w-4" />
                  {categoria}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-black leading-tight text-stone-900 sm:text-5xl lg:text-6xl dark:text-white">
                {current.nombre}
              </h1>
              {current.nombre_cientifico && (
                <p className="text-base font-semibold italic text-emerald-700 dark:text-emerald-300">
                  {current.nombre_cientifico}
                </p>
              )}
              <p className="max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg dark:text-stone-300">
                {current.descripcion ||
                  'Colecciones vivas cultivadas in vitro para un crecimiento impecable y una estética irrepetible.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest ${badgeTone}`}>
                {badgeLabel}
              </span>
              <span
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest ${
                  enStock
                    ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-200'
                    : 'border-rose-500/40 text-rose-600 dark:text-rose-300'
                }`}
              >
                {enStock ? `${current.stock_total} disponibles` : 'Agotado'}
              </span>
              <span className="rounded-full border border-stone-200/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-stone-500 dark:border-stone-700/70 dark:text-stone-300">
                Envíos rápidos
              </span>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <span className="text-3xl font-black text-stone-900 sm:text-4xl dark:text-white">
                {formatCLP(current.precio_venta)}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">IVA incluido</span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/productos/${current.id_producto}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-stone-900/20 transition hover:-translate-y-0.5 hover:bg-stone-800"
              >
                Ver producto
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/productos"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/70 bg-white/70 px-6 py-4 text-sm font-bold uppercase tracking-widest text-emerald-700 shadow-lg shadow-emerald-500/10 transition hover:-translate-y-0.5 hover:border-emerald-400"
              >
                Explorar catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {total > 1 && (
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + total) % total)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-700 shadow-sm transition hover:text-emerald-600 dark:border-stone-700/80 dark:bg-stone-900/70 dark:text-stone-200"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % total)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-700 shadow-sm transition hover:text-emerald-600 dark:border-stone-700/80 dark:bg-stone-900/70 dark:text-stone-200"
                    aria-label="Siguiente"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? 'w-10 bg-emerald-600'
                          : 'w-4 bg-stone-300/80 hover:bg-stone-400 dark:bg-stone-600'
                      }`}
                      aria-label={`Ir al slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-2xl shadow-emerald-900/20 dark:border-stone-800 dark:bg-stone-900/60">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${accentGradients[currentSlide % accentGradients.length]}`}
              />
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={currentImage}
                  alt={current.nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>

              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-emerald-700 shadow-lg">
                <Leaf className="h-4 w-4" />
                Exclusivo
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center justify-between gap-3">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${badgeTone}`}>
                    {badgeLabel}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">GottLab</span>
                </div>
                <p className="mt-3 text-lg font-semibold">
                  {current.nombre_cientifico || 'Cultivo in vitro certificado'}
                </p>
              </div>
            </div>

            {total > 1 && (
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % total)}
                className="absolute right-4 top-6 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-left shadow-xl backdrop-blur transition hover:-translate-y-0.5 dark:border-stone-700/70 dark:bg-stone-900/80"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                  <Image
                    src={nextImage}
                    alt={next?.nombre || 'Siguiente producto'}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
                    Siguiente
                  </p>
                  <p className="text-sm font-bold text-stone-900 dark:text-white">
                    {next?.nombre || 'Nuevo lanzamiento'}
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center">
        <div className="flex items-center gap-2 rounded-full border border-emerald-200/60 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-500/30 dark:bg-stone-900/70 dark:text-emerald-200">
          Desliza para ver más
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </section>
  )
}
