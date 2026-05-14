'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff, Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const passwordRules = [
  { label: 'Minimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: 'Al menos una mayuscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Al menos un numero', test: (p: string) => /\d/.test(p) },
]

export default function CambiarPasswordPage() {
  const supabase = createClient()
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(''); setError('')
    if (formData.newPassword !== formData.confirmPassword) { setError('Las contrasenas nuevas no coinciden'); return }
    if (formData.newPassword.length < 8) { setError('La contrasena debe tener al menos 8 caracteres'); return }
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password: formData.newPassword })
    if (err) { setError(err.message) }
    else { setMessage('Contrasena actualizada correctamente'); setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' }) }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-stone-900 mb-6">Cambiar Contrasena</h2>
      {message && <div className="mb-4 p-3 bg-emerald-100 text-emerald-700 rounded-lg text-sm">{message}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div><label className="block text-sm font-medium text-stone-700 mb-1">Contrasena Actual</label><div className="relative"><input type={showPasswords.current ? 'text' : 'password'} value={formData.currentPassword} onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })} className="w-full px-3 py-2 pr-10 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required /><button type="button" onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">{showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
        <div><label className="block text-sm font-medium text-stone-700 mb-1">Nueva Contrasena</label><div className="relative"><input type={showPasswords.new ? 'text' : 'password'} value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} className="w-full px-3 py-2 pr-10 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required minLength={8} /><button type="button" onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">{showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
        <div><label className="block text-sm font-medium text-stone-700 mb-1">Confirmar Nueva Contrasena</label><div className="relative"><input type={showPasswords.confirm ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full px-3 py-2 pr-10 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required /><button type="button" onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">{showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
        <div className="bg-stone-50 rounded-lg p-4 space-y-2"><p className="text-sm font-medium text-stone-700 mb-2">La nueva contrasena debe tener:</p>{passwordRules.map((rule) => { const ok = rule.test(formData.newPassword); return <div key={rule.label} className="flex items-center gap-2 text-sm"><span className={`w-2 h-2 rounded-full ${ok ? 'bg-emerald-500' : 'bg-stone-300'}`} /><span className={ok ? 'text-stone-900' : 'text-stone-500'}>{rule.label}</span></div> })}</div>
        <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Cambiar Contrasena</button>
      </form>
    </div>
  )
}
