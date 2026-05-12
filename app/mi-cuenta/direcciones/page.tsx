'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, MapPin, X } from 'lucide-react'

interface Direccion {
  id_direccion: number
  alias: string | null
  tipo: string | null
  direccion: string | null
  comuna: string | null
  ciudad: string | null
  region: string | null
  codigo_postal: string | null
}

export default function DireccionesPage() {
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    alias: '',
    tipo: 'casa',
    direccion: '',
    comuna: '',
    ciudad: '',
    region: '',
    codigo_postal: '',
  })

  useEffect(() => {
    fetchDirecciones()
  }, [])

  const fetchDirecciones = async () => {
    try {
      const res = await fetch('/api/cliente/direcciones')
      const data = await res.json()
      if (res.ok) {
        setDirecciones(data.direcciones || [])
      }
    } catch {
      console.error('Error al cargar direcciones')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editingId 
      ? `/api/cliente/direcciones?id=${editingId}` 
      : '/api/cliente/direcciones'
    const method = editingId ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowForm(false)
        setEditingId(null)
        setFormData({
          alias: '',
          tipo: 'casa',
          direccion: '',
          comuna: '',
          ciudad: '',
          region: '',
          codigo_postal: '',
        })
        fetchDirecciones()
      }
    } catch {
      console.error('Error al guardar dirección')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta dirección?')) return

    try {
      const res = await fetch(`/api/cliente/direcciones?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchDirecciones()
      }
    } catch {
      console.error('Error al eliminar dirección')
    }
  }

  const handleEdit = (dir: Direccion) => {
    setEditingId(dir.id_direccion)
    setFormData({
      alias: dir.alias || '',
      tipo: dir.tipo || 'casa',
      direccion: dir.direccion || '',
      comuna: dir.comuna || '',
      ciudad: dir.ciudad || '',
      region: dir.region || '',
      codigo_postal: dir.codigo_postal || '',
    })
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-stone-900">Mis Direcciones</h2>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({
              alias: '',
              tipo: 'casa',
              direccion: '',
              comuna: '',
              ciudad: '',
              region: '',
              codigo_postal: '',
            })
          }}
          className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Dirección
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-stone-900">
              {editingId ? 'Editar Dirección' : 'Nueva Dirección'}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Alias (ej: Casa, Trabajo)</label>
              <input
                type="text"
                value={formData.alias}
                onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Casa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="casa">Casa</option>
                <option value="trabajo">Trabajo</option>
                <option value="departamento">Departamento</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1">Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Av. Siempre Viva 742"
              required
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Comuna</label>
              <input
                type="text"
                value={formData.comuna}
                onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Ciudad</label>
              <input
                type="text"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Región</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Código Postal</label>
              <input
                type="text"
                value={formData.codigo_postal}
                onChange={(e) => setFormData({ ...formData, codigo_postal: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700"
            >
              {editingId ? 'Guardar Cambios' : 'Agregar Dirección'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-stone-200 text-stone-700 font-medium rounded-lg hover:bg-stone-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {direcciones.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-stone-300" />
          <p>No tienes direcciones guardadas</p>
          <p className="text-sm">Agrega una dirección para tus envíos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {direcciones.map((dir) => (
            <div
              key={dir.id_direccion}
              className="p-4 border border-stone-200 rounded-lg flex items-start justify-between hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-stone-900">
                    {dir.alias || 'Dirección'} 
                    <span className="text-sm text-stone-500 font-normal ml-2">({dir.tipo || 'casa'})</span>
                  </h3>
                  <p className="text-stone-600">{dir.direccion}</p>
                  <p className="text-sm text-stone-500">
                    {dir.comuna && `${dir.comuna}, `}
                    {dir.ciudad && `${dir.ciudad}, `}
                    {dir.region}
                    {dir.codigo_postal && ` - ${dir.codigo_postal}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(dir)}
                  className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(dir.id_direccion)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
