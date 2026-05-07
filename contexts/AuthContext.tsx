'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

type Rol = 'admin' | 'vendedor' | 'cliente' | null

interface AuthContextType {
  user: User | null
  session: Session | null
  rol: Rol
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  isAdmin: boolean
  isVendedor: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [rol, setRol] = useState<Rol>(null)
  const [loading, setLoading] = useState(true)

  const fetchRol = async (userId: string): Promise<Rol> => {
    const { data } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id_usuario', userId)
      .single()
    return (data?.rol as Rol) || 'cliente'
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        const r = await fetchRol(session.user.id)
        setRol(r)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        const r = await fetchRol(session.user.id)
        setRol(r)
      } else {
        setRol(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      rol,
      loading,
      signIn,
      signOut,
      isAdmin: rol === 'admin',
      isVendedor: rol === 'vendedor' || rol === 'admin',
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
