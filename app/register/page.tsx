'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Leaf from 'lucide-react/dist/esm/icons/leaf'
import Mail from 'lucide-react/dist/esm/icons/mail'
import Lock from 'lucide-react/dist/esm/icons/lock'
import Eye from 'lucide-react/dist/esm/icons/eye'
import EyeOff from 'lucide-react/dist/esm/icons/eye-off'
import User from 'lucide-react/dist/esm/icons/user'
import Check from 'lucide-react/dist/esm/icons/check'
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right'
import { supabase } from '@/lib/supabaseClient'

const passwordRules = [
  { label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: 'Al menos una letra mayúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Al menos un número', test: (p: string) => /[0-9]/.test(p) },
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (!passwordRules.every(r => r.test(formData.password))) {
      setError('La contraseña no cumple los requisitos')
      return
    }

    setLoading(true)

    // Supabase Auth hashea la contraseña con bcrypt internamente
    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Insertar perfil en tabla usuarios con rol 'cliente'
    if (data.user) {
      await supabase.from('usuarios').insert({
        id_usuario: data.user.id,
        nombre: formData.nombre,
        email: formData.email,
        rol: 'cliente',
      })
    }

    setLoading(false)
    setSuccess(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen pt-16 overflow-x-hidden">
      <div className="relative z-10 w-full min-h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
          {/* Imagen - ocupa toda la altura disponible */}
          <div className="relative hidden lg:block min-h-[calc(100vh-4rem)]">
            <Image
              src="/placeholder.avif"
              alt="Plantas exclusivas"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-12">
              <h3 className="text-3xl font-bold text-white mb-2">Colección Exclusiva</h3>
              <p className="text-white/80 text-lg">Descubre plantas in vitro únicas</p>
            </div>
          </div>

          {/* Formulario - scroll independiente si es necesario */}
          <div className="flex items-center justify-center bg-gradient-to-br from-emerald-600 to-green-700 min-h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-6">
            <div className="w-full max-w-sm py-4 sm:py-6">
              {success ? (
                <div className="flex flex-col items-center justify-center text-center py-8 space-y-3">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">¡Cuenta creada!</h2>
                  <p className="text-sm text-white/80 max-w-xs">
                    Revisa tu email para confirmar tu cuenta antes de iniciar sesión.
                  </p>
                  <Link
                    href="/login"
                    className="mt-2 px-6 py-2.5 bg-white text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-50 transition-colors flex items-center gap-2"
                  >
                    Ir a Iniciar Sesión
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
              <>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-semibold text-white mb-1.5">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-white mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-1.5">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 space-y-1.5">
                  <p className="text-xs text-white font-semibold mb-1">La contraseña debe contener:</p>
                  {passwordRules.map((rule) => {
                    const ok = rule.test(formData.password)
                    return (
                      <div key={rule.label} className="flex items-center gap-2 text-xs">
                        <Check className={`h-3 w-3 transition-colors ${ok ? 'text-white' : 'text-white/30'}`} />
                        <span className={`transition-colors ${ok ? 'text-white' : 'text-white/50'}`}>{rule.label}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-0.5 w-4 h-4 rounded border-white/30 bg-white/10 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                  />
                  <label htmlFor="terms" className="text-xs text-white/90">
                    Acepto los{' '}
                    <Link href="/terminos" className="text-white hover:text-white/90 underline">
                      términos
                    </Link>{' '}
                    y la{' '}
                    <Link href="/privacidad" className="text-white hover:text-white/90 underline">
                      política de privacidad
                    </Link>
                  </label>
                </div>

                {error && (
                  <p className="text-xs text-white bg-red-500/30 border border-red-400/40 rounded-lg px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-white text-emerald-700 hover:bg-emerald-50 disabled:bg-white/50 disabled:cursor-not-allowed font-bold text-sm rounded-xl transition-all hover:shadow-xl hover:shadow-white/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-emerald-700/40 border-t-emerald-700 rounded-full animate-spin" />
                  ) : (
                    <>
                      Crear Cuenta
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center mt-4 text-sm text-white/80">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="text-white hover:text-white/90 font-medium transition-colors underline">
                  Inicia sesión
                </Link>
              </p>
              </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
