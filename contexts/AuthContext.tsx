'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { UsuarioRol } from '@/lib/jwt'

export interface ClientePerfil {
  id: number
  nombre: string | null
  apellido: string | null
  telefono: string | null
  rut: string | null
}

export interface EmpleadoPerfil {
  id: number
  nombre: string | null
  apellido: string | null
  telefono: string | null
  rut: string | null
  cargo: string | null
  estado: string | null
}

export interface UsuarioAuth {
  id: number
  email: string
  rol: UsuarioRol
  nombre: string | null
  perfil: ClientePerfil | EmpleadoPerfil | null
}

interface AuthContextType {
  usuario: UsuarioAuth | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
  isAdmin: boolean
  isEmpleado: boolean
  isCliente: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioAuth | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session', { credentials: 'include' })
      const data = await res.json()
      setUsuario(data.usuario ?? null)
    } catch {
      setUsuario(null)
    }
  }

  useEffect(() => {
    let active = true
    const run = async () => {
      await fetchSession()
      if (active) setLoading(false)
    }
    void run()
    return () => { active = false }
  }, [])

  const signIn = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) return { error: data.error || 'Error al iniciar sesión' }
    setUsuario(data.usuario)
    return { error: null }
  }

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setUsuario(null)
  }

  const refresh = async () => {
    await fetchSession()
  }

  const rol = usuario?.rol ?? null
  const isAdmin = rol === 'admin'
  const isEmpleado = rol === 'empleado'
  const isCliente = rol === 'cliente'

  return (
    <AuthContext.Provider value={{
      usuario,
      loading,
      signIn,
      signOut,
      refresh,
      isAdmin,
      isEmpleado,
      isCliente,
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
