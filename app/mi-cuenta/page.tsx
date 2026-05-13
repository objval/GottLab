'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Save, Loader2, AlertTriangle, Phone, IdCard, ShoppingBag } from 'lucide-react'

// Formatear RUT chileno: 12345678-9 -> 12.345.678-9
const formatRUT = (value: string): string => {
  // Limpiar: solo números y K/k
  const clean = value.replace(/[^0-9kK]/g, '').toUpperCase()
  if (clean.length === 0) return ''
  
  // Separar cuerpo y dígito verificador
  let body = clean.slice(0, -1)
  const dv = clean.slice(-1)
  
  // Formatear cuerpo con puntos
  let formatted = ''
  let count = 0
  for (let i = body.length - 1; i >= 0; i--) {
    if (count === 3) {
      formatted = '.' + formatted
      count = 0
    }
    formatted = body[i] + formatted
    count++
  }
  
  // Agregar dígito verificador con guión
  if (clean.length > 1) {
    return formatted + '-' + dv
  }
  return formatted + dv
}

export default function MiCuentaPage() {
  const { usuario, refresh } = useAuth()
  const searchParams = useSearchParams()
  const desdeRegistro = searchParams.get('completar') === 'true'

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    rut: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const datosIncompletos = !formData.telefono || !formData.rut

  useEffect(() => {
    if (usuario?.perfil) {
      setFormData({
        nombre: usuario.perfil.nombre || '',
        apellido: usuario.perfil.apellido || '',
        telefono: usuario.perfil.telefono || '',
        rut: formatRUT(usuario.perfil.rut || ''),
      })
    }
  }, [usuario])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    // Validar teléfono y RUT obligatorios
    if (!formData.telefono.trim()) {
      setError('El teléfono es obligatorio para realizar compras')
      setLoading(false)
      return
    }
    if (!formData.rut.trim()) {
      setError('El RUT es obligatorio para realizar compras')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/cliente/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al actualizar')
      } else {
        setMessage('Datos actualizados correctamente')
        refresh()
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-stone-900 mb-6">Mis Datos Personales</h2>

      {/* Alerta de bienvenida después del registro */}
      {desdeRegistro && datosIncompletos && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">¡Bienvenido! Completa tus datos</p>
              <p className="text-sm text-amber-700 mt-1">
                Para poder realizar compras, necesitamos tu teléfono y RUT. Por favor complétalos a continuación.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alerta si faltan datos obligatorios */}
      {!desdeRegistro && datosIncompletos && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-amber-900">Datos incompletos</p>
              <p className="text-sm text-amber-700 mt-1">
                Necesitas agregar tu {!formData.telefono && !formData.rut ? 'teléfono y RUT' : !formData.telefono ? 'teléfono' : 'RUT'} para poder realizar compras.
              </p>
              <Link
                href="/productos"
                className="inline-flex items-center gap-1 mt-2 text-sm text-amber-700 hover:text-amber-900 font-medium"
              >
                <ShoppingBag className="h-4 w-4" />
                Ir a productos igualmente
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de éxito cuando datos están completos */}
      {!datosIncompletos && (
        <div className="mb-4 p-3 bg-emerald-100 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          Tus datos están completos. ¡Ya puedes realizar compras!
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-emerald-100 text-emerald-700 rounded-lg text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Nombres
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Apellidos
          </label>
          <input
            type="text"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              Teléfono
              <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-stone-400">(obligatorio para comprar)</span>
            </span>
          </label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              !formData.telefono ? 'border-red-300 bg-red-50' : 'border-stone-300'
            }`}
            placeholder="+56 9 1234 5678"
            required
          />
          {!formData.telefono && (
            <p className="text-xs text-red-500 mt-1">Debes ingresar tu teléfono para poder comprar</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            <span className="flex items-center gap-1">
              <IdCard className="h-3.5 w-3.5" />
              RUT
              <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-stone-400">(obligatorio para comprar)</span>
            </span>
          </label>
          <input
            type="text"
            value={formData.rut}
            onChange={(e) => {
              const formatted = formatRUT(e.target.value)
              setFormData({ ...formData, rut: formatted })
            }}
            onBlur={(e) => {
              // Asegurar formato correcto al salir del input
              const formatted = formatRUT(e.target.value)
              setFormData({ ...formData, rut: formatted })
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              !formData.rut ? 'border-red-300 bg-red-50' : 'border-stone-300'
            }`}
            placeholder="12.345.678-9"
            maxLength={12}
            required
          />
          {!formData.rut && (
            <p className="text-xs text-red-500 mt-1">Debes ingresar tu RUT para poder comprar</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Guardar Cambios
        </button>
      </form>
    </div>
  )
}
