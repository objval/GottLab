'use client'

import { useState } from 'react'
import { Leaf, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setEnviando(true)

    // Simulación de envío — reemplazar con acción real (email, Supabase, etc.)
    await new Promise(res => setTimeout(res, 1200))

    setEnviando(false)
    setEnviado(true)
    setForm({ nombre: '', email: '', asunto: '', mensaje: '' })
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pt-16">

      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 border-b border-emerald-100 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
              <Leaf className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Contáctanos</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">¿Tienes alguna pregunta?</h1>
          <p className="text-gray-600 dark:text-stone-400 max-w-xl">
            Estamos aquí para ayudarte. Escríbenos sobre pedidos, plantas, o cualquier duda que tengas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Info de contacto */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-black dark:text-white mb-6">Información de contacto</h2>

            <div className="flex items-start gap-4 p-4 bg-white dark:bg-stone-900 rounded-xl border border-gray-100 dark:border-stone-800">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-0.5">Email</p>
                <p className="text-sm font-medium text-black dark:text-white">contacto@gottlab.cl</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white dark:bg-stone-900 rounded-xl border border-gray-100 dark:border-stone-800">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-0.5">Teléfono</p>
                <p className="text-sm font-medium text-black dark:text-white">+56 9 1234 5678</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white dark:bg-stone-900 rounded-xl border border-gray-100 dark:border-stone-800">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-0.5">Ubicación</p>
                <p className="text-sm font-medium text-black dark:text-white">Santiago, Chile</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/40 mt-6">
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Horario de atención</p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400">Lunes a Viernes</p>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">9:00 — 18:00 hrs</p>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-gray-100 dark:border-stone-800 p-6 sm:p-8">

              {enviado ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2">¡Mensaje enviado!</h3>
                  <p className="text-gray-500 dark:text-stone-400 max-w-sm">
                    Gracias por escribirnos. Te responderemos a la brevedad posible.
                  </p>
                  <button
                    onClick={() => setEnviado(false)}
                    className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors text-sm"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-lg font-bold text-black dark:text-white mb-6">Envíanos un mensaje</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                        Nombre <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Tu nombre"
                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl text-sm text-black dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="tu@email.com"
                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl text-sm text-black dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                      Asunto <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="asunto"
                      value={form.asunto}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="pedido">Consulta sobre pedido</option>
                      <option value="producto">Información de producto</option>
                      <option value="envio">Envío y despacho</option>
                      <option value="preventa">Preventas</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                      Mensaje <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="mensaje"
                      value={form.mensaje}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Escribe tu mensaje aquí..."
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl text-sm text-black dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-stone-400 disabled:to-stone-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
                  >
                    {enviando ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar mensaje
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
