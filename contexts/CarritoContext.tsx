'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getCarrito, agregarAlCarrito as agregarAlCarritoAction, actualizarCantidad as actualizarCantidadAction, eliminarDelCarrito as eliminarDelCarritoAction, vaciarCarrito as vaciarCarritoAction, getContadorCarrito } from '@/lib/actions/carrito'

interface CarritoItem { id_reserva: number; id_producto: number; cantidad: number; fecha_expiracion: string; productos: { nombre: string; nombre_cientifico: string; precio_venta: number; stock_total: number; imagenes_productos: { url: string }[] } | null }
interface CarritoContextType { items: CarritoItem[]; contador: number; loading: boolean; agregarProducto: (idProducto: number, cantidad?: number) => Promise<{ success: boolean; error?: string; message?: string }>; actualizarCantidad: (idReserva: number, cantidad: number) => Promise<void>; eliminarProducto: (idReserva: number) => Promise<void>; vaciar: () => Promise<void>; refrescar: () => Promise<void> }

const CarritoContext = createContext<CarritoContextType>({ items: [], contador: 0, loading: false, agregarProducto: async () => ({ success: false }), actualizarCantidad: async () => {}, eliminarProducto: async () => {}, vaciar: async () => {}, refrescar: async () => {} })
export function useCarrito() { return useContext(CarritoContext) }

export default function CarritoProvider({ children }: { children: React.ReactNode }) {
  const { perfilId, isCliente, loading: authLoading } = useAuth()
  const [items, setItems] = useState<CarritoItem[]>([])
  const [contador, setContador] = useState(0)
  const [loading, setLoading] = useState(true)
  const idCliente = isCliente && perfilId ? perfilId : null

  const cargarCarrito = useCallback(async () => {
    if (authLoading) return
    if (!idCliente) { setItems([]); setContador(0); setLoading(false); return }
    setLoading(true)
    try {
      const [d, c] = await Promise.all([getCarrito(idCliente), getContadorCarrito(idCliente)])
      setItems(d as unknown as CarritoItem[]); setContador(c)
    } catch (e) { console.error('Error cargando carrito:', e) }
    finally { setLoading(false) }
  }, [idCliente, authLoading])

  useEffect(() => { cargarCarrito(); const i = setInterval(cargarCarrito, 60000); return () => clearInterval(i) }, [cargarCarrito])

  const agregarProducto = async (idProducto: number, cantidad = 1) => {
    if (!idCliente) return { success: false, error: 'Debes iniciar sesion para agregar al carrito' }
    const r = await agregarAlCarritoAction(idCliente, idProducto, cantidad)
    if (r.success) cargarCarrito()
    return r
  }
  const actualizarCantidad = async (idReserva: number, cantidad: number) => {
    setItems(p => p.map(i => i.id_reserva === idReserva ? { ...i, cantidad } : i))
    setContador(p => { const it = items.find(i => i.id_reserva === idReserva); return it ? p - it.cantidad + cantidad : p })
    actualizarCantidadAction(idReserva, cantidad).then(r => { if (!r.success) cargarCarrito() })
  }
  const eliminarProducto = async (idReserva: number) => {
    const el = items.find(i => i.id_reserva === idReserva)
    setItems(p => p.filter(i => i.id_reserva !== idReserva))
    if (el) setContador(p => p - el.cantidad)
    eliminarDelCarritoAction(idReserva).then(r => { if (!r.success) cargarCarrito() })
  }
  const vaciar = async () => { if (!idCliente) return; setItems([]); setContador(0); vaciarCarritoAction(idCliente).then(r => { if (!r.success) cargarCarrito() }) }

  return <CarritoContext.Provider value={{ items, contador, loading, agregarProducto, actualizarCantidad, eliminarProducto, vaciar, refrescar: cargarCarrito }}>{children}</CarritoContext.Provider>
}
