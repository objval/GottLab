'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export interface Empleado {
  id: number
  email: string
  nombre: string
  cargo: string
}

interface AuthContextType {
  empleado: Empleado | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  isAdmin: boolean
  isVendedor: boolean
  user: Empleado | null
  rol: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [empleado, setEmpleado] = useState<Empleado | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(({ empleado }) => {
        setEmpleado(empleado ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const signIn = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) return { error: data.error || 'Error al iniciar sesión' }
    setEmpleado(data.empleado)
    return { error: null }
  }

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setEmpleado(null)
  }

  const cargo = empleado?.cargo ?? null
  const cargosAdmin = ['admin', 'administrador']
  const cargosVendedor = ['vendedor', 'vendedora', ...cargosAdmin]

  return (
    <AuthContext.Provider value={{
      empleado,
      loading,
      signIn,
      signOut,
      isAdmin: cargosAdmin.includes(cargo?.toLowerCase() ?? ''),
      isVendedor: cargosVendedor.includes(cargo?.toLowerCase() ?? ''),
      user: empleado,
      rol: cargo,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
