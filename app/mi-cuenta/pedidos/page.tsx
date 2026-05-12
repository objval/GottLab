'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, ChevronRight, Calendar, CreditCard } from 'lucide-react'

interface Pedido {
  id_pedido: number
  fecha: string
  estado: string
  total: number
  detalles?: { cantidad: number; producto: { nombre: string } }[]
}

const estadoStyles: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  pagado: 'bg-emerald-100 text-emerald-700',
  preparando: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
}

const estadoLabels: Record<string, string> = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  preparando: 'Preparando',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPedidos()
  }, [])

  const fetchPedidos = async () => {
    try {
      const res = await fetch('/api/cliente/pedidos')
      const data = await res.json()
      if (res.ok) {
        setPedidos(data.pedidos || [])
      }
    } catch {
      console.error('Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatCLP = (n: number) => `$${Number(n).toLocaleString('es-CL')}`

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-stone-900 mb-6">Mis Pedidos</h2>

      {pedidos.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          <Package className="h-12 w-12 mx-auto mb-4 text-stone-300" />
          <p>No tienes pedidos realizados</p>
          <p className="text-sm mb-4">Explora nuestros productos y haz tu primera compra</p>
          <Link
            href="/productos"
            className="inline-block px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700"
          >
            Ver Productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id_pedido}
              className="border border-stone-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-medium text-stone-900">
                      Pedido #{pedido.id_pedido.toString().padStart(6, '0')}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-stone-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(pedido.fecha)}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-3.5 w-3.5" />
                        {formatCLP(pedido.total)}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoStyles[pedido.estado] || 'bg-stone-100 text-stone-600'}`}>
                    {estadoLabels[pedido.estado] || pedido.estado}
                  </span>
                </div>

                {pedido.detalles && pedido.detalles.length > 0 && (
                  <div className="border-t border-stone-100 pt-4">
                    <p className="text-sm text-stone-600 mb-2">
                      {pedido.detalles.length} {pedido.detalles.length === 1 ? 'producto' : 'productos'}
                    </p>
                    <div className="space-y-1">
                      {pedido.detalles.slice(0, 3).map((detalle, idx) => (
                        <p key={idx} className="text-sm text-stone-700">
                          {detalle.cantidad}x {detalle.producto.nombre}
                        </p>
                      ))}
                      {pedido.detalles.length > 3 && (
                        <p className="text-sm text-stone-500">
                          +{pedido.detalles.length - 3} productos más
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-stone-100">
                  <Link
                    href={`/mi-cuenta/pedidos/${pedido.id_pedido}`}
                    className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    Ver detalles del pedido
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
