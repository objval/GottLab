'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Clock from 'lucide-react/dist/esm/icons/clock'
import Sparkles from 'lucide-react/dist/esm/icons/sparkles'
import Flame from 'lucide-react/dist/esm/icons/flame'
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right'
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle'
import Loader2 from 'lucide-react/dist/esm/icons/loader-2'

// Tiempo objetivo: 3 días desde ahora
const getTargetDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 3)
  date.setHours(12, 0, 0, 0)
  return date
}

const preventas = [
  {
    id: 1,
    nombre: 'Orchidacea Mystica',
    nombreCientifico: 'Ophrys × mysterium',
    descripcion: 'Un híbrido legendario creado mediante técnicas avanzadas de cultivo in vitro. Sus flores emiten un brillo iridiscente bajo la luz lunar, con patrones que recuerdan a las nebulosas del espacio profundo.',
    precioPreventa: 299.99,
    precioRegular: 499.99,
    unidadesDisponibles: 7,
    unidadesTotales: 15,
    fechaLanzamiento: getTargetDate(),
    rareza: 'Legendaria',
    imagen: '/placeholder.avif',
    caracteristicas: [
      'Edición limitada numerada',
      'Certificado de autenticidad con holograma',
      'Kit de cuidado místico incluido',
      'Acceso exclusivo a eventos de coleccionistas'
    ]
  },
  {
    id: 2,
    nombre: 'Nepenthes Nocturna',
    nombreCientifico: 'Nepenthes × umbra',
    descripcion: 'Evolucionada en condiciones de oscuridad controlada, esta planta carnívora desarrolló trampas de color negro azabache con venas fosforescentes.',
    precioPreventa: 189.99,
    precioRegular: 299.99,
    unidadesDisponibles: 12,
    unidadesTotales: 25,
    fechaLanzamiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    rareza: 'Épica',
    imagen: '/placeholder.avif',
    caracteristicas: [
      'Coloración única en su especie',
      'Trampas activas las 24 horas',
      'Resistente a condiciones de poca luz',
      'Incluye sustrato especial oscuro'
    ]
  }
]

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        }
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex gap-2 sm:gap-4">
      {[
        { value: timeLeft.days, label: 'Días' },
        { value: timeLeft.hours, label: 'Horas' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Seg' }
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-bold text-white">
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onLoadingComplete, 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Círculo de carga místico */}
        <div className="w-32 h-32 rounded-full border-2 border-white/10 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
          <Loader2 className="h-12 w-12 text-white/60 animate-pulse" />
        </div>
        
        {/* Niebla alrededor */}
        <div className="absolute -inset-10 bg-gradient-radial from-purple-500/20 via-transparent to-transparent blur-2xl animate-pulse" />
      </div>
      
      <p className="mt-8 text-gray-400 text-sm tracking-widest uppercase">Preparando las mejores preventas</p>
      
      {/* Barra de progreso */}
      <div className="mt-4 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-purple-500 transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      
      <p className="mt-2 text-white/40 text-xs">{Math.min(Math.round(progress), 100)}%</p>
    </div>
  )
}

export default function PreventasPage() {
  const preventaPrincipal = preventas[0]
  const otrasPreventas = preventas.slice(1)
  const [isLoading, setIsLoading] = useState(true)
  const [mostrarPlanta, setMostrarPlanta] = useState(false)

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Revelar la planta después de un momento
    setTimeout(() => setMostrarPlanta(true), 1000)
  }

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Preventa Principal */}
      <section className="relative min-h-screen overflow-hidden flex flex-col">
        {/* Fondo negro con gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
        
        {/* Efecto de neblina */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-800/20 via-transparent to-gray-800/20" />
          
          {/* Niebla animada */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(100,100,100,0.3) 0%, transparent 70%)',
              filter: 'blur(60px)',
              animation: 'pulse 8s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute top-1/3 left-1/3 w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(150,150,150,0.2) 0%, transparent 70%)',
              filter: 'blur(80px)',
              animation: 'pulse 6s ease-in-out infinite reverse'
            }}
          />
        </div>

        {/* Partículas flotantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        {/* Timer Arriba */}
        <div className="relative z-10 pt-28 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-400 text-sm mb-4 flex items-center justify-center gap-2 tracking-widest uppercase">
              <Clock className="h-4 w-4" />
              Próximo misterio se revela en
            </p>
            <div className="flex justify-center">
              <CountdownTimer targetDate={preventaPrincipal.fechaLanzamiento} />
            </div>
          </div>
        </div>

        {/* Planta Misteriosa en el Centro */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-8">
          <div className="relative w-full max-w-2xl mx-auto px-4">
            {/* Círculo místico alrededor */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="w-[90%] aspect-square rounded-full border border-white/5 animate-spin"
                style={{ animationDuration: '20s' }}
              />
              <div 
                className="absolute w-[80%] aspect-square rounded-full border border-white/10 animate-spin"
                style={{ animationDuration: '15s', animationDirection: 'reverse' }}
              />
              <div 
                className="absolute w-[70%] aspect-square rounded-full border border-amber-500/20 animate-spin"
                style={{ animationDuration: '25s' }}
              />
            </div>

            {/* Contenedor de la planta */}
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Glow dorado detrás */}
              <div className="absolute inset-0 bg-gradient-radial from-amber-500/30 via-purple-500/20 to-transparent blur-3xl scale-110" />
              
              {/* Marco de la imagen */}
              <div 
                className={`relative w-full h-full rounded-full overflow-hidden border-2 transition-all duration-2000 ${
                  mostrarPlanta 
                    ? 'border-amber-500/50 shadow-[0_0_100px_rgba(245,158,11,0.3)]' 
                    : 'border-white/20'
                }`}
              >
                {/* Imagen con rotación */}
                <div 
                  className={`absolute inset-0 transition-all duration-1500 ${
                    mostrarPlanta ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    animation: mostrarPlanta ? 'slowRotate 30s linear infinite' : 'none'
                  }}
                >
                  <Image
                    src={preventaPrincipal.imagen}
                    alt="Planta Misteriosa"
                    fill
                    className="object-cover scale-110"
                    priority
                  />
                </div>

                {/* Capa de niebla densa */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-black via-gray-900/90 to-black transition-opacity duration-2000 ${
                    mostrarPlanta ? 'opacity-30' : 'opacity-90'
                  }`} 
                />
                
                {/* Niebla animada en movimiento */}
                <div 
                  className={`absolute inset-0 transition-opacity duration-1500 ${
                    mostrarPlanta ? 'opacity-40' : 'opacity-100'
                  }`}
                  style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.8) 70%)',
                    animation: 'mistMove 8s ease-in-out infinite'
                  }}
                />

                {/* Silueta misteriosa cuando está oculta */}
                {!mostrarPlanta && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 animate-pulse flex items-center justify-center">
                        <Sparkles className="h-12 w-12 text-amber-400/50" />
                      </div>
                      <p className="text-gray-500 text-sm tracking-widest uppercase">Próximamente</p>
                    </div>
                  </div>
                )}

                {/* Efecto de brillo en los bordes */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(255,255,255,0.1)]" />
              </div>

              {/* Badge de rareza */}
              <div 
                className={`absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-3 rounded-full shadow-lg shadow-amber-900/50 transition-all duration-1000 ${
                  mostrarPlanta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span className="font-semibold tracking-wide">{preventaPrincipal.rareza}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="animate-bounce">
            <ChevronRight className="h-6 w-6 text-gray-500 rotate-90" />
          </div>
        </div>
      </section>

      {/* Preventas Activas */}
      <section className="relative py-20 bg-gradient-to-b from-black via-gray-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Preventas Disponibles Ahora
            </h2>
            <p className="text-gray-400">Reserva estas ediciones exclusivas antes de que se agoten</p>
          </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otrasPreventas.map((preventa) => (
                <div 
                  key={preventa.id}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all hover:shadow-lg hover:shadow-amber-900/20"
                >
                  {/* Imagen */}
                  <div className="relative aspect-square">
                    <Image
                      src={preventa.imagen}
                      alt={preventa.nombre}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="bg-amber-500/80 text-black px-3 py-1 rounded-full text-xs font-semibold">
                        {preventa.rareza}
                      </span>
                      {preventa.unidadesDisponibles <= 5 && (
                        <span className="bg-red-500/80 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          ¡{preventa.unidadesDisponibles} restantes!
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                      {preventa.nombre}
                    </h3>
                    <p className="text-gray-500 italic text-sm mb-3">
                      {preventa.nombreCientifico}
                    </p>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {preventa.descripcion}
                    </p>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-white">
                        ${preventa.precioPreventa}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${preventa.precioRegular}
                      </span>
                    </div>
                    
                    <button className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-lg font-medium transition-all">
                      Reservar Ahora
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* Estilos CSS para animaciones */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.5;
          }
        }

        @keyframes slowRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes mistMove {
          0%, 100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.8;
          }
          33% {
            transform: scale(1.1) translate(-5%, -3%);
            opacity: 0.6;
          }
          66% {
            transform: scale(0.95) translate(3%, 5%);
            opacity: 0.9;
          }
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}
