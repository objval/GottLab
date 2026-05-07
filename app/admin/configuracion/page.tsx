'use client'

import { useAuth } from '@/contexts/AuthContext'
import { ShieldOff, Settings } from 'lucide-react'

export default function AdminConfiguracion() {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <ShieldOff className="h-10 w-10 text-stone-600 mb-3" />
        <p className="text-stone-400">Solo los administradores pueden acceder a esta sección</p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Configuración</h1>
        <p className="text-stone-400 text-sm">Ajustes generales del sistema</p>
      </div>
      <div className="bg-stone-900 border border-stone-800 rounded-xl flex flex-col items-center justify-center py-20 text-center">
        <Settings className="h-10 w-10 text-stone-700 mb-3" />
        <p className="text-stone-400 text-sm">Configuraciones próximamente</p>
      </div>
    </div>
  )
}
