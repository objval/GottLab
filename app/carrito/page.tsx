'use client'

import { useState } from 'react'
import { useCarrito } from '@/contexts/CarritoContext'
import { validarCarritoParaCheckout } from '@/lib/actions/carrito'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ArrowLeft, AlertCircle } from 'lucide-react'

export default function CarritoPage() {
  const { items, loading, actualizarCantidad, eliminarProducto, vaciar } = useCarrito()
  const [validando, setValidando] = useState(false)
  const [erroresValidacion, setErroresValidacion] = useState<string[]>([])

  const handleProcederAlPago = async () => {
    setValidando(true)
    setErroresValidacion([])

    // TODO: Reemplazar con ID de cliente real
    const ID_CLIENTE_TEMPORAL = 1
    
    const resultado = await validarCarritoParaCheckout(ID_CLIENTE_TEMPORAL)

    if (!resultado.valido) {
      setErroresValidacion(resultado.errores)
      setValidando(false)
      return
    }

    // Si todo está válido, proceder al checkout
    // TODO: Redirigir a página de pago
    console.log('Carrito validado:', resultado)
    alert('Carrito validado correctamente. Redirigiendo al pago...')
    setValidando(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-stone-950 flex items-center justify-center">
        <p className="text-gray-500 dark:text-stone-400">Cargando carrito...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-stone-950 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-4">Tu carrito está vacío</h1>
            <p className="text-gray-600 dark:text-stone-400 mb-8">Agrega productos para comenzar tu compra</p>
            <Link 
              href="/productos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-medium transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
              Ver productos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.productos?.precio_venta || 0) * item.cantidad
  }, 0)

  const formatCLP = (n: number) => `$${Number(n).toLocaleString('es-CL')}`

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">Carrito de Compras</h1>
            <p className="text-gray-600 dark:text-stone-400 mt-1">{items.length} {items.length === 1 ? 'producto' : 'productos'}</p>
          </div>
          <button
            onClick={vaciar}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const producto = item.productos
              if (!producto) return null

              const imagen = producto.imagenes_productos?.[0]?.url || '/placeholder.avif'
              const tiempoRestante = new Date(item.fecha_expiracion).getTime() - Date.now()
              const minutosRestantes = Math.floor(tiempoRestante / 60000)

              return (
                <div key={item.id_reserva} className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-4 flex gap-4">
                  
                  {/* Imagen */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-white dark:bg-stone-800 rounded-xl overflow-hidden">
                    <Image
                      src={imagen}
                      alt={producto.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/productos/${item.id_producto}`}>
                      <h3 className="font-bold text-black dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1">
                        {producto.nombre}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-stone-400 italic line-clamp-1">{producto.nombre_cientifico}</p>
                    <p className="text-lg font-black text-black dark:text-white mt-1">{formatCLP(producto.precio_venta)}</p>
                    
                    {/* Tiempo restante */}
                    {minutosRestantes > 0 && minutosRestantes < 5 && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        ⏱️ Reserva expira en {minutosRestantes} min
                      </p>
                    )}
                  </div>

                  {/* Controles */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => eliminarProducto(item.id_reserva)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-2 bg-white dark:bg-stone-800 rounded-lg border border-gray-200 dark:border-stone-700">
                      <button
                        onClick={() => actualizarCantidad(item.id_reserva, item.cantidad - 1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-stone-700 rounded-l-lg transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium dark:text-white">{item.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(item.id_reserva, item.cantidad + 1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-stone-700 rounded-r-lg transition-colors"
                        disabled={item.cantidad >= producto.stock_total}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">Resumen</h2>
              
              {/* Errores de validación */}
              {erroresValidacion.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                        Problemas con tu carrito:
                      </p>
                      <ul className="text-xs text-red-700 dark:text-red-400 space-y-1">
                        {erroresValidacion.map((error, i) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-stone-400">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatCLP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-stone-400">
                  <span>Envío</span>
                  <span className="font-medium">A calcular</span>
                </div>
                <div className="border-t border-gray-200 dark:border-stone-700 pt-3 flex justify-between text-lg font-bold text-black dark:text-white">
                  <span>Total</span>
                  <span>{formatCLP(subtotal)}</span>
                </div>
              </div>

              <button 
                onClick={handleProcederAlPago}
                disabled={validando}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
              >
                {validando ? 'Validando...' : 'Proceder al pago'}
              </button>

              <Link 
                href="/productos"
                className="block text-center mt-4 text-sm text-gray-600 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                ← Continuar comprando
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
