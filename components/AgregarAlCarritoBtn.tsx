'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCarrito } from '@/contexts/CarritoContext'

interface Props {
  idProducto: number
  enStock: boolean
}

export default function AgregarAlCarritoBtn({ idProducto, enStock }: Props) {
  const { agregarProducto } = useCarrito()
  const [agregado, setAgregado] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAgregar = async () => {
    if (!enStock || loading) return

    setLoading(true)
    const result = await agregarProducto(idProducto, 1)
    
    if (result.success) {
      setAgregado(true)
      setTimeout(() => setAgregado(false), 2000)
    } else {
      alert(result.error || 'Error al agregar al carrito')
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleAgregar}
      disabled={!enStock || loading}
      className={`w-full py-4 px-8 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition-all ${
        enStock
          ? agregado
            ? 'bg-green-600 text-white'
            : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/20'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
      }`}
    >
      {agregado ? (
        <>
          <Check className="h-5 w-5" />
          Agregado al carrito
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          {loading ? 'Agregando...' : enStock ? 'Agregar al carrito' : 'No disponible'}
        </>
      )}
    </button>
  )
}
