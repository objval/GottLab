'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Mail from 'lucide-react/dist/esm/icons/mail'
import Lock from 'lucide-react/dist/esm/icons/lock'
import Eye from 'lucide-react/dist/esm/icons/eye'
import EyeOff from 'lucide-react/dist/esm/icons/eye-off'
import User from 'lucide-react/dist/esm/icons/user'
import Check from 'lucide-react/dist/esm/icons/check'
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right'

const passwordRules = [
  { label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: 'Al menos una letra mayúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Al menos un número', test: (p: string) => /[0-9]/.test(p) },
]

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      setError('Debes ingresar tu nombre y apellido')
      return
    }
    if (!passwordRules.every(r => r.test(formData.password))) {
      setError('La contraseña no cumple los requisitos')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
        }),
      })

      const payload = await res.json()

      if (!res.ok) {
        setError(payload.error || 'No se pudo crear la cuenta. Intenta nuevamente')
        setLoading(false)
        return
      }

      // Auto-login después del registro
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      if (loginRes.ok) {
        // Redirigir a Mi Cuenta para completar datos
        router.push('/mi-cuenta?completar=true')
      } else {
        // Si falla el auto-login, mostrar mensaje de éxito y pedir login manual
        setSuccess(true)
      }
    } catch (err) {
      setError('Ocurrió un error inesperado. Intenta nuevamente')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="h-[calc(100vh-4rem)] mt-16 overflow-hidden">
      <div className="relative z-10 w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Imagen - ocupa toda la altura disponible */}
          <div className="relative hidden lg:block h-full">
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
          <div className="flex items-center justify-center bg-gradient-to-br from-emerald-600 to-green-700 h-full overflow-y-auto p-4 sm:p-8">
            <div className="w-full max-w-md py-8">
              {success ? (
                <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">¡Cuenta creada!</h2>
                  <p className="text-white/80 max-w-xs">
                    Tu cuenta ya está lista. Ahora inicia sesión para completar tus datos.
                  </p>
                  <Link
                    href="/login"
                    className="mt-4 px-8 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-colors flex items-center gap-2"
                  >
                    Ir a Iniciar Sesión
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="nombre" className="block text-base font-bold text-white mb-2 uppercase tracking-wide">
                          Nombre
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                          <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ej. María"
                            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="apellido" className="block text-base font-bold text-white mb-2 uppercase tracking-wide">
                          Apellido
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                          <input
                            id="apellido"
                            name="apellido"
                            type="text"
                            value={formData.apellido}
                            onChange={handleChange}
                            placeholder="Ej. González"
                            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-base font-bold text-white mb-2 uppercase tracking-wide">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="tu@email.com"
                          className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-base font-bold text-white mb-2 uppercase tracking-wide">
                        Contraseña
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-2">
                      <p className="text-sm text-white font-bold uppercase tracking-wide mb-2">La contraseña debe contener:</p>
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

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="mt-1 w-4 h-4 rounded border-white/30 bg-white/10 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                      />
                      <label htmlFor="terms" className="text-base text-white font-medium">
                        Acepto los{' '}
                        <Link href="/terminos" className="text-white hover:text-white/90 underline">
                          términos y condiciones
                        </Link>{' '}
                        y la{' '}
                        <Link href="/privacidad" className="text-white hover:text-white/90 underline">
                          política de privacidad
                        </Link>
                      </label>
                    </div>

                    {error && (
                      <p className="text-sm text-white bg-red-500/30 border border-red-400/40 rounded-lg px-3 py-2">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-white text-emerald-700 hover:bg-emerald-50 disabled:bg-white/50 disabled:cursor-not-allowed font-bold text-lg rounded-xl transition-all hover:shadow-xl hover:shadow-white/20 flex items-center justify-center gap-2 uppercase tracking-wide"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-emerald-700/40 border-t-emerald-700 rounded-full animate-spin" />
                      ) : (
                        <>
                          Crear Cuenta
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="text-center mt-6 text-white/80">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" className="text-white hover:text-white/90 font-medium transition-colors underline">
                      Inicia sesión aquí
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
