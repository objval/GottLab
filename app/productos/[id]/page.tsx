'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left'
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart'
import Heart from 'lucide-react/dist/esm/icons/heart'
import Star from 'lucide-react/dist/esm/icons/star'
import Clock from 'lucide-react/dist/esm/icons/clock'
import Leaf from 'lucide-react/dist/esm/icons/leaf'
import Check from 'lucide-react/dist/esm/icons/check'
import Truck from 'lucide-react/dist/esm/icons/truck'
import Shield from 'lucide-react/dist/esm/icons/shield'
import Award from 'lucide-react/dist/esm/icons/award'

// Datos de ejemplo - en producción vendrían de API/DB
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
    descripcionCorta: 'Variedad alba con flores blancas puras',
    descripcionCompleta: 'Una de las orquídeas más elegantes y apreciadas para colecciones. Sus flores blancas puras y perfectamente simétricas la convierten en una joya botánica. Cultivada in vitro para garantizar salud y vigor.',
    caracteristicas: ['Flores blancas puras', 'Altura: 30-40cm', 'Fácil cuidado', 'Floración prolongada'],
    cuidados: ['Luz indirecta brillante', 'Riego moderado', 'Humedad 60-70%', 'Temperatura 18-25°C'],
    tiempoEntrega: '2-3 días hábiles'
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
    descripcionCorta: 'Atrapamoscas de interior roja intensa',
    descripcionCompleta: 'Fascinante planta carnívora con trampas de color rojo intenso. Perfecta para coleccionistas que buscan algo único y llamativo. Cada trampa se cierra en segundos cuando presa un insecto.',
    caracteristicas: ['Trampas rojas', 'Tamaño: 10-15cm', 'Dormancia invernal', 'Alta eficiencia'],
    cuidados: ['Luz directa 4-6 horas', 'Agua destilada', 'Sustrato sphagnum', 'Sin fertilizantes'],
    tiempoEntrega: '2-3 días hábiles'
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
    descripcionCorta: 'Bonsái clásico con 5 años de cultivo',
    descripcionCompleta: 'Bonsái tradicional con 5 años de cuidados especializados. Tronco bien desarrollado y follaje denso que crea una silueta clásica perfecta. Incluye maceta cerámica premium.',
    caracteristicas: ['Edad: 5 años', 'Altura: 25cm', 'Maceta incluida', 'Estilo informal upright'],
    cuidados: ['Luz brillante indirecta', 'Riego cuando se seque el sustrato', 'Poda regular', 'Fertilizar mensualmente'],
    tiempoEntrega: '3-4 días hábiles'
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
    descripcionCorta: 'Suculenta de color lila perla',
    descripcionCompleta: 'Híbrido espectacular con hojas en forma de perla de color lila rosado. Perfecta para principiantes debido a su fácil cuidado y resistencia. Forma rosetas perfectas de hasta 20cm.',
    caracteristicas: ['Color lila perla', 'Roseta: 20cm', 'Bajo mantenimiento', 'Multiplica fácilmente'],
    cuidados: ['Luz directa 6 horas', 'Riego escaso', 'Drenaje excelente', 'Proteger de heladas'],
    tiempoEntrega: '2-3 días hábiles'
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
    descripcionCorta: 'Híbrido exclusivo de laboratorio',
    descripcionCompleta: 'Creación exclusiva de GottLab desarrollada durante 3 años de investigación. Flores con patrones únicos y colores vibrantes que no existen en la naturaleza. Limitada a 50 unidades numeradas.',
    caracteristicas: ['Híbrido único', 'Número certificado', 'Edición limitada', 'Patrones exclusivos'],
    cuidados: ['Cuidado especializado', 'Kit de mantenimiento incluido', 'Soporte técnico', 'Garantía extendida'],
    tiempoEntrega: '10-15 días hábiles'
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
    descripcionCorta: 'Planta jarra híbrida resistente',
    descripcionCompleta: 'Híbrido robusto y fácil de cuidar que produce jarras de hasta 15cm. Perfecta para principiantes en plantas carnívoras. Muy resistente y adaptable a diferentes condiciones.',
    caracteristicas: ['Jarras: 15cm', 'Híbrido resistente', 'Alta producción', 'Adaptable'],
    cuidados: ['Luz brillante', 'Alta humedad', 'Agua pura', 'Temperatura cálida'],
    tiempoEntrega: '2-3 días hábiles'
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
    descripcionCorta: 'Helecho nido de ave elegante',
    descripcionCompleta: 'Helecho tropical con frondas que forman una copa perfecta en forma de nido. Ideal para interiores con luz indirecta. Agrega un toque tropical elegante a cualquier espacio.',
    caracteristicas: ['Frondas: 60cm', 'Interior', 'Purificador de aire', 'Bajo mantenimiento'],
    cuidados: ['Luz indirecta', 'Humedad alta', 'Sustrato orgánico', 'Evitar corrientes'],
    tiempoEntrega: '2-3 días hábiles'
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
    descripcionCorta: 'Planta acuática de hojas anchas',
    descripcionCompleta: 'Planta acuática versátil perfecta para acuarios y terrarios. Hojas anchas y brillantes de color verde oscuro. Crecimiento lento pero muy resistente.',
    caracteristicas: ['Hoja: 15cm', 'Acuática', 'Rústica', 'Múltiple uso'],
    cuidados: ['Luz baja-media', 'CO2 opcional', 'Temperatura 22-28°C', 'pH neutro'],
    tiempoEntrega: '2-3 días hábiles'
  },
]

export default function ProductoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const [cantidad, setCantidad] = useState(1)
  const [favorito, setFavorito] = useState(false)
  
  const id = parseInt(params.id as string)
  const producto = productos.find(p => p.id === id)
  
  if (!producto) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800 mb-4">Producto no encontrado</h1>
          <Link 
            href="/productos"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Volver a productos
          </Link>
        </div>
      </div>
    )
  }
  
  const isPreventa = producto.disponibilidad === 'preventa'
  const descuento = producto.precioOriginal ? Math.round((1 - producto.precio / producto.precioOriginal) * 100) : 0
  
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm text-stone-600">
            <Link href="/" className="hover:text-emerald-600">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href="/productos" className="hover:text-emerald-600">Productos</Link>
            <span className="mx-2">/</span>
            <span className="text-stone-800 font-medium">{producto.nombre}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-stone-100 rounded-2xl overflow-hidden">
              <Image
                src={producto.imagen}
                alt={producto.nombre}
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

              {/* Botón favorito */}
              <button
                onClick={() => setFavorito(!favorito)}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <Heart className={`h-5 w-5 ${favorito ? 'fill-red-500 text-red-500' : 'text-stone-600'}`} />
              </button>

              {/* Badge de stock bajo */}
              {producto.stock > 0 && producto.stock <= 5 && (
                <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                  ¡Solo {producto.stock} unidades!
                </div>
              )}
            </div>

            {/* Miniaturas */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-stone-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-colors cursor-pointer">
                  <Image
                    src={producto.imagen}
                    alt={`${producto.nombre} - Vista ${i}`}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Información */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-2">
                {producto.nombre}
              </h1>
              <p className="text-lg text-stone-500 italic mb-4">
                {producto.nombreCientifico}
              </p>
              
              {/* Etiquetas */}
              <div className="flex flex-wrap gap-2 mb-4">
                {producto.etiquetas.map((etiqueta, i) => (
                  <span 
                    key={i}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      etiqueta === 'Preventa'
                        ? 'bg-stone-800 text-white'
                        : etiqueta === 'Exclusivo'
                        ? 'bg-stone-600 text-white'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {etiqueta}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(producto.rating) ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-stone-600">{producto.rating} ({producto.reseñas} reseñas)</span>
              </div>
            </div>

            {/* Precio */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-emerald-600">
                ${producto.precio.toFixed(2)}
              </span>
              {producto.precioOriginal && (
                <>
                  <span className="text-xl text-stone-400 line-through">
                    ${producto.precioOriginal.toFixed(2)}
                  </span>
                  <span className="text-sm text-emerald-600 font-medium bg-emerald-100 px-2 py-1 rounded">
                    {descuento}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">Descripción</h3>
              <p className="text-stone-600 leading-relaxed">
                {producto.descripcionCompleta}
              </p>
            </div>

            {/* Características */}
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-3">Características</h3>
              <ul className="space-y-2">
                {producto.caracteristicas.map((caracteristica, i) => (
                  <li key={i} className="flex items-center gap-2 text-stone-600">
                    <Check className="h-4 w-4 text-emerald-600" />
                    {caracteristica}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cuidados */}
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-3">Cuidados</h3>
              <ul className="space-y-2">
                {producto.cuidados.map((cuidado, i) => (
                  <li key={i} className="flex items-center gap-2 text-stone-600">
                    <Leaf className="h-4 w-4 text-emerald-600" />
                    {cuidado}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tiempo de entrega */}
            <div className="bg-stone-100 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-stone-800">
                    {isPreventa ? 'Tiempo de entrega estimado' : 'Envío rápido'}
                  </p>
                  <p className="text-sm text-stone-600">
                    {producto.tiempoEntrega} {isPreventa ? 'después del lanzamiento' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-stone-700">Cantidad:</label>
                <div className="flex items-center border border-stone-300 rounded-lg">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="p-2 hover:bg-stone-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {cantidad}
                  </span>
                  <button
                    onClick={() => setCantidad(cantidad + 1)}
                    className="p-2 hover:bg-stone-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    isPreventa
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/25'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25'
                  }`}
                  disabled={producto.stock === 0 && !isPreventa}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {isPreventa ? 'Reservar Ahora' : 'Agregar al Carrito'}
                </button>
                
                <button className="py-3 px-6 border-2 border-stone-300 text-stone-700 rounded-xl font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              {/* Garantías */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200">
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <span>Garantía de calidad</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Award className="h-4 w-4 text-emerald-600" />
                  <span>Certificado de origen</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Truck className="h-4 w-4 text-emerald-600" />
                  <span>Envío seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos Relacionados */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-stone-800 mb-8">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos
              .filter(p => p.id !== producto.id && p.categoria === producto.categoria)
              .slice(0, 4)
              .map((relacionado) => (
                <Link
                  key={relacionado.id}
                  href={`/productos/${relacionado.id}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="aspect-square bg-stone-100 relative">
                    <Image
                      src={relacionado.imagen}
                      alt={relacionado.nombre}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="300px"
                    />
                    {relacionado.disponibilidad === 'preventa' && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                        Preventa
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-stone-800 text-sm mb-1 group-hover:text-emerald-600 transition-colors">
                      {relacionado.nombre}
                    </h3>
                    <p className="text-emerald-600 font-bold">
                      ${relacionado.precio.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
