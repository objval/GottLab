'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { User, MapPin, ShoppingBag, Lock, LogOut } from 'lucide-react'

const menuItems = [
  { href: '/mi-cuenta', label: 'Mis Datos', icon: User },
  { href: '/mi-cuenta/direcciones', label: 'Direcciones', icon: MapPin },
  { href: '/mi-cuenta/pedidos', label: 'Mis Pedidos', icon: ShoppingBag },
  { href: '/mi-cuenta/cambiar-password', label: 'Cambiar Contrasena', icon: Lock },
]

export default function MiCuentaLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => { if (!loading && !user) router.push('/login?redirect=/mi-cuenta') }, [user, loading, router])

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8"><h1 className="text-2xl font-bold text-stone-900">Mi Cuenta</h1><p className="text-stone-500">{user?.email}</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              {menuItems.map((item, i) => { const Icon = item.icon; return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${i !== menuItems.length - 1 ? 'border-b border-stone-100' : ''} hover:bg-stone-50 text-stone-700`}>
                  <Icon className="h-4 w-4 text-emerald-600" />{item.label}
                </Link>
              )})}
              <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"><LogOut className="h-4 w-4" />Cerrar Sesion</button>
            </nav>
          </aside>
          <main className="lg:col-span-3"><div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">{children}</div></main>
        </div>
      </div>
    </div>
  )
}
