'use client'

import { ShoppingCart, AlertCircle } from 'lucide-react'

export default function AdminPedidos() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Pedidos</h1>
        <p className="text-stone-400 text-sm">Gestión de órdenes de compra</p>
      </div>
      <div className="bg-stone-900 border border-stone-800 rounded-xl flex flex-col items-center justify-center py-20 text-center">
        <ShoppingCart className="h-10 w-10 text-stone-700 mb-3" />
        <p className="text-stone-400 text-sm">No hay pedidos aún</p>
        <p className="text-stone-600 text-xs mt-1">Los pedidos aparecerán aquí cuando el checkout esté implementado</p>
      </div>
    </div>
  )
}
