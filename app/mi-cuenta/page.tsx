'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Save, Loader2 } from 'lucide-react'

export default function MiCuentaPage() {
  const { usuario, refresh } = useAuth()
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    rut: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (usuario?.perfil) {
      setFormData({
        nombre: usuario.perfil.nombre || '',
        apellido: usuario.perfil.apellido || '',
        telefono: usuario.perfil.telefono || '',
        rut: usuario.perfil.rut || '',
      })
    }
  }, [usuario])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

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
            Nombre
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
            Apellido
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
            Teléfono (opcional)
          </label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="+56 9 1234 5678"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            RUT (opcional)
          </label>
          <input
            type="text"
            value={formData.rut}
            onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="12.345.678-9"
          />
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
