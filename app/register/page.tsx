'use client'

import { useState } from 'react'
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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    console.log('Register:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="nombre" className="block text-base font-bold text-white mb-2 uppercase tracking-wide">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
                      required
                    />
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-base font-bold text-white mb-2 uppercase tracking-wide">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-2">
                  <p className="text-sm text-white font-bold uppercase tracking-wide mb-2">La contraseña debe contener:</p>
                  <div className="flex items-center gap-2 text-xs">
                    <Check className="h-3 w-3 text-white" />
                    <span className="text-white/70">Mínimo 8 caracteres</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Check className="h-3 w-3 text-white" />
                    <span className="text-white/70">Al menos una letra mayúscula</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Check className="h-3 w-3 text-white" />
                    <span className="text-white/70">Al menos un número</span>
                  </div>
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

                <button
                  type="submit"
                  className="w-full py-3.5 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-lg rounded-xl transition-all hover:shadow-xl hover:shadow-white/20 flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  Crear Cuenta
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              <p className="text-center mt-6 text-white/80">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="text-white hover:text-white/90 font-medium transition-colors underline">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
