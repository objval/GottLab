'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  getCarrito, 
  agregarAlCarrito as agregarAlCarritoAction,
  actualizarCantidad as actualizarCantidadAction,
  eliminarDelCarrito as eliminarDelCarritoAction,
  vaciarCarrito as vaciarCarritoAction,
  getContadorCarrito
} from '@/lib/actions/carrito'

interface CarritoItem {
  id_reserva: number
  id_producto: number
  cantidad: number
  fecha_expiracion: string
  productos: {
    nombre: string
    nombre_cientifico: string
    precio_venta: number
    stock_total: number
    imagenes_productos: { url: string }[]
  } | null
}

interface CarritoContextType {
  items: CarritoItem[]
  contador: number
  loading: boolean
  agregarProducto: (idProducto: number, cantidad?: number) => Promise<{ success: boolean; error?: string; message?: string }>
  actualizarCantidad: (idReserva: number, cantidad: number) => Promise<void>
  eliminarProducto: (idReserva: number) => Promise<void>
  vaciar: () => Promise<void>
  refrescar: () => Promise<void>
}

const CarritoContext = createContext<CarritoContextType>({
  items: [],
  contador: 0,
  loading: false,
  agregarProducto: async () => ({ success: false }),
  actualizarCantidad: async () => {},
  eliminarProducto: async () => {},
  vaciar: async () => {},
  refrescar: async () => {},
})

export function useCarrito() {
  return useContext(CarritoContext)
}

export default function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CarritoItem[]>([])
  const [contador, setContador] = useState(0)
  const [loading, setLoading] = useState(true)
  
  // TODO: Reemplazar con ID de cliente real desde autenticación
  const ID_CLIENTE_TEMPORAL = 1

  const cargarCarrito = async () => {
    setLoading(true)
    try {
      const [carritoData, contadorData] = await Promise.all([
        getCarrito(ID_CLIENTE_TEMPORAL),
        getContadorCarrito(ID_CLIENTE_TEMPORAL)
      ])
      setItems(carritoData as unknown as CarritoItem[])
      setContador(contadorData)
    } catch (error) {
      console.error('Error cargando carrito:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarCarrito()
    
    // Refrescar cada minuto para limpiar expirados
    const interval = setInterval(cargarCarrito, 60000)
    return () => clearInterval(interval)
  }, [])

  const agregarProducto = async (idProducto: number, cantidad = 1) => {
    const result = await agregarAlCarritoAction(ID_CLIENTE_TEMPORAL, idProducto, cantidad)
    if (result.success) {
      // Actualizar en background sin bloquear
      cargarCarrito()
    }
    return result
  }

  const actualizarCantidad = async (idReserva: number, cantidad: number) => {
    // Optimistic update - actualizar UI inmediatamente
    setItems(prev => prev.map(item => 
      item.id_reserva === idReserva ? { ...item, cantidad } : item
    ))
    setContador(prev => {
      const item = items.find(i => i.id_reserva === idReserva)
      if (item) {
        return prev - item.cantidad + cantidad
      }
      return prev
    })

    // Sincronizar con servidor en background
    actualizarCantidadAction(idReserva, cantidad).then(result => {
      if (!result.success) {
        // Si falla, revertir y recargar desde servidor
        cargarCarrito()
      }
    })
  }

  const eliminarProducto = async (idReserva: number) => {
    // Optimistic update - remover de UI inmediatamente
    const itemEliminado = items.find(i => i.id_reserva === idReserva)
    setItems(prev => prev.filter(item => item.id_reserva !== idReserva))
    if (itemEliminado) {
      setContador(prev => prev - itemEliminado.cantidad)
    }

    // Eliminar en servidor en background
    eliminarDelCarritoAction(idReserva).then(result => {
      if (!result.success) {
        // Si falla, recargar desde servidor
        cargarCarrito()
      }
    })
  }

  const vaciar = async () => {
    // Optimistic update - vaciar UI inmediatamente
    setItems([])
    setContador(0)

    // Vaciar en servidor en background
    vaciarCarritoAction(ID_CLIENTE_TEMPORAL).then(result => {
      if (!result.success) {
        // Si falla, recargar desde servidor
        cargarCarrito()
      }
    })
  }

  return (
    <CarritoContext.Provider value={{
      items,
      contador,
      loading,
      agregarProducto,
      actualizarCantidad,
      eliminarProducto,
      vaciar,
      refrescar: cargarCarrito
    }}>
      {children}
    </CarritoContext.Provider>
  )
}
