'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const accesosRapidos = [
  { label: 'Agregar producto', href: '/admin/productos', icon: Package },
  { label: 'Ver pedidos', href: '/admin/pedidos', icon: ShoppingCart },
  { label: 'Gestionar usuarios', href: '/admin/usuarios', icon: Users },
]

export default function AdminDashboard() {
  const { usuario, isAdmin } = useAuth()
  const [prodStats, setProdStats] = useState<{ total: number; activos: number; stock: number } | null>(null)

  useEffect(() => {
    supabase
      .from('productos')
      .select('estado, stock_total')
      .then(({ data }) => {
        if (!data) return
        setProdStats({
          total: data.length,
          activos: data.filter(p => p.estado === 'activo').length,
          stock: data.reduce((s, p) => s + (p.stock_total ?? 0), 0),
        })
      })
  }, [])

  const stats = [
    { label: 'Productos', value: prodStats ? String(prodStats.total) : '—', icon: Package, href: '/admin/productos', color: 'emerald' },
    { label: 'Pedidos hoy', value: '—', icon: ShoppingCart, href: '/admin/pedidos', color: 'blue' },
    { label: 'Usuarios', value: '—', icon: Users, href: '/admin/usuarios', color: 'violet' },
    { label: 'Ventas mes', value: '—', icon: TrendingUp, href: '/admin/pedidos', color: 'amber' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
          Bienvenido {usuario?.nombre}
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
          {usuario?.email} · <span className="text-emerald-600 dark:text-emerald-400 capitalize">{usuario?.rol}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 rounded-xl p-5 flex flex-col gap-3 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-${stat.color}-100 dark:bg-${stat.color}-900/40`}>
                <stat.icon className={`h-4 w-4 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-stone-400 dark:text-stone-600 group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-colors" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{stat.label}</p>
              {/* Sub-stats solo para Productos */}
              {stat.label === 'Productos' && prodStats && (
                <div className="mt-2 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-400 dark:text-stone-500">Activos</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{prodStats.activos}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-400 dark:text-stone-500">Inventario</span>
                    <span className="font-semibold text-stone-700 dark:text-stone-300">{prodStats.stock.toLocaleString('es-CL')} u.</span>
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Accesos rápidos */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-stone-900 dark:text-white mb-4">Accesos rápidos</h2>
          <div className="space-y-2">
            {accesosRapidos.map((item) => {
              if (item.href.includes('usuarios') && !isAdmin) return null
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  <item.icon className="h-4 w-4 text-stone-400 dark:text-stone-500" />
                  {item.label}
                  <ArrowUpRight className="h-3.5 w-3.5 ml-auto text-stone-400 dark:text-stone-600" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Actividad reciente placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-stone-400" />
            Actividad reciente
          </h2>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <AlertCircle className="h-8 w-8 text-stone-300 dark:text-stone-700 mb-3" />
            <p className="text-stone-400 dark:text-stone-500 text-sm">La actividad se mostrará aquí</p>
            <p className="text-stone-400 dark:text-stone-600 text-xs mt-1">Conecta tu backend para ver datos reales</p>
          </div>
        </div>
      </div>
    </div>
  )
}
