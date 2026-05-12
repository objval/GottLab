'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Menu from 'lucide-react/dist/esm/icons/menu'
import X from 'lucide-react/dist/esm/icons/x'
import Leaf from 'lucide-react/dist/esm/icons/leaf'
import { Moon, Sun, LayoutDashboard, LogOut, Settings } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import CarritoDropdown from '@/components/CarritoDropdown'
import { useAuth, ClientePerfil, EmpleadoPerfil } from '@/contexts/AuthContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { usuario, isAdmin, isEmpleado, isCliente, signOut } = useAuth()

  const clientePerfil = (usuario?.rol === 'cliente' ? usuario?.perfil : null) as ClientePerfil | null
  const empleadoPerfil = (usuario && usuario.rol !== 'cliente' ? usuario.perfil : null) as EmpleadoPerfil | null
  const fullName =
  usuario?.nombre ??
  clientePerfil?.nombre ??
  empleadoPerfil?.nombre ??
  usuario?.email;

const accountName = fullName ? fullName.split(' ')[0] : null;

  // Obtener iniciales: primera letra del nombre + primera letra del apellido (última palabra)
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return 'U'
    const words = name.trim().split(/\s+/).filter(w => w.length > 0)
    if (words.length === 0) return 'U'
    if (words.length === 1) return words[0][0].toUpperCase()
    // Primera letra de la primera palabra (nombre) + primera letra de la última palabra (apellido)
    const first = words[0][0].toUpperCase()
    const last = words[words.length - 1][0].toUpperCase()
    return first + last
  }

  const userInitials = getInitials(fullName)

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false)
      }
    }
    if (accountOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [accountOpen])

  // Determinar si el navbar debe ser blanco (siempre en login/register, o al hacer scroll)
  const isAuthPage = pathname === '/login' || pathname === '/register'
  const isPreventasPage = pathname === '/preventas'
  const isWhite = isAuthPage || isScrolled
  
  // En preventas, usar texto blanco inicialmente (tema oscuro de la página)
  const isHome = pathname === '/'
  const useWhiteText = isPreventasPage && !isScrolled

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Bloquear scroll + cerrar con ESC
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', handleEsc)

    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', handleEsc)
    }
  }, [isMenuOpen])

  return (
    <>
      {/* NAVBAR */}
      <nav className={`fixed left-0 right-0 z-50 transition-all duration-300 top-0 ${
        isWhite 
          ? `${theme === 'dark' ? 'bg-stone-900' : 'bg-white'} ${pathname === '/productos' ? '' : 'shadow-md'}` 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">

            {/* Logo - Izquierda */}
            <Link href="/" className="flex items-center space-x-2 justify-self-start">
              <Leaf className={`h-8 w-8 ${isWhite ? 'text-green-600' : (useWhiteText || (!isHome && theme === 'dark')) ? 'text-green-400' : 'text-green-700'}`} />
              <span className={`text-xl font-bold ${isWhite ? (theme === 'dark' ? 'text-white' : 'text-stone-800') : (useWhiteText || (!isHome && theme === 'dark')) ? 'text-white' : 'text-stone-900'}`}>GottLab</span>
            </Link>

            {/* Desktop Links - Centro / Announcement Bar en landscape mobile */}
            <div className="flex items-center justify-center">
            {/* Announcement bar en landscape mobile */}
            {isHome && (
              <div className="lg:hidden [@media(orientation:portrait)]:hidden flex items-center gap-1.5 bg-white/30 backdrop-blur-md border border-white/40 text-black rounded-full px-3 py-1 text-[10px] font-medium whitespace-nowrap shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                <span>Envíos a todo Chile por Correos de Chile</span>
              </div>
            )}
            <div className="hidden lg:flex items-center justify-center space-x-8">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/productos', label: 'Productos' },
                { href: '/preventas', label: 'Preventas' },
                { href: '/nosotros', label: 'Nosotros' },
                { href: '/contacto', label: 'Contacto' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    isWhite
                      ? theme === 'dark'
                        ? 'text-white hover:text-green-400'
                        : 'text-stone-700 hover:text-green-600'
                      : useWhiteText || (!isHome && theme === 'dark')
                        ? 'text-white/90 hover:text-green-400'
                        : 'text-stone-800 hover:text-green-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            </div>

            {/* Desktop Actions - Derecha */}
            <div className="hidden lg:flex items-center justify-end space-x-4">
              <CarritoDropdown />

              {(isAdmin || isEmpleado) && (
                <Link href="/admin" className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Panel
                </Link>
              )}

              {usuario ? (
                <div className="relative" ref={accountRef}>
                  <button
                    onClick={() => setAccountOpen(o => !o)}
                    className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm hover:bg-emerald-200 transition-colors"
                    title={fullName || usuario.email}
                  >
                    {userInitials}
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl shadow-lg overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800">
                        <p className="text-sm font-semibold text-stone-800 dark:text-white truncate">{accountName}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{usuario.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href={isCliente ? '/mi-cuenta' : '/admin'}
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                        >
                          <Settings className="h-4 w-4" />
                          {isCliente ? 'Mi cuenta' : 'Ir al panel'}
                        </Link>
                        <button
                          onClick={async () => {
                            await signOut()
                            setAccountOpen(false)
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                        >
                          <LogOut className="h-4 w-4" />
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className={`px-3 py-1.5 transition-colors ${isWhite ? (theme === 'dark' ? 'text-white hover:text-green-400' : 'text-stone-700 hover:text-green-600') : (useWhiteText || (!isHome && theme === 'dark')) ? 'text-white/90 hover:text-green-400' : 'text-stone-800 hover:text-green-700'}`}>
                    Iniciar Sesión
                  </Link>
                  <Link href="/register" className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg">
                    Registrarse
                  </Link>
                </>
              )}

              <button
                onClick={toggleTheme}
                className="relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-0.5"
                style={{ backgroundColor: theme === 'dark' ? '#059669' : '#d1d5db' }}
                aria-label="Cambiar tema"
              >
                <span className={`w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}>
                  {theme === 'dark' ? <Moon className="h-3 w-3 text-emerald-600" /> : <Sun className="h-3 w-3 text-amber-500" />}
                </span>
              </button>
            </div>

            {/* Mobile buttons */}
            <div className="lg:hidden col-start-3 justify-self-end flex items-center gap-2">
              <CarritoDropdown isMobile />
              <button
                onClick={toggleTheme}
                className="relative w-10 h-5 rounded-full transition-colors duration-300 flex items-center px-0.5"
                style={{ backgroundColor: theme === 'dark' ? '#059669' : '#d1d5db' }}
                aria-label="Cambiar tema"
              >
                <span className={`w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}>
                  {theme === 'dark' ? <Moon className="h-2.5 w-2.5 text-emerald-600" /> : <Sun className="h-2.5 w-2.5 text-amber-500" />}
                </span>
              </button>
              <button
                onClick={() => setIsMenuOpen(true)}
                className={`p-2 transition-colors ${isWhite ? (theme === 'dark' ? 'text-white hover:text-green-400' : 'text-stone-700 hover:text-green-600') : (useWhiteText || (!isHome && theme === 'dark')) ? 'text-white/90 hover:text-green-400' : 'text-stone-800 hover:text-green-700'}`}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU FULL SCREEN CON ANIMACIÓN */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* BACKDROP */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* PANEL FULL SCREEN */}
        <div 
          className={`absolute inset-0 bg-white dark:bg-stone-900 flex flex-col transition-transform duration-500 ease-out ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b dark:border-stone-700 h-16">
            <span className="font-bold text-lg text-stone-800 dark:text-white">GottLab</span>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-stone-700 dark:text-stone-300 hover:text-green-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* CONTENT - CENTRADO */}
          <div className="flex-1 overflow-y-auto px-8 py-8 flex flex-col justify-center items-center space-y-6">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-medium text-stone-700 dark:text-stone-200 hover:text-green-600 transition-colors"
            >
              Inicio
            </Link>
            <Link 
              href="/productos" 
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-medium text-stone-700 dark:text-stone-200 hover:text-green-600 transition-colors"
            >
              Productos
            </Link>
            <Link 
              href="/preventas" 
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-medium text-stone-700 dark:text-stone-200 hover:text-green-600 transition-colors"
            >
              Preventas
            </Link>
            <Link 
              href="/nosotros" 
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-medium text-stone-700 dark:text-stone-200 hover:text-green-600 transition-colors"
            >
              Nosotros
            </Link>
            <Link 
              href="/contacto" 
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-medium text-stone-700 dark:text-stone-200 hover:text-green-600 transition-colors"
            >
              Contacto
            </Link>

            {(isAdmin || isEmpleado) && (
              <Link 
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-medium text-stone-700 dark:text-stone-200 hover:text-green-600 transition-colors"
              >
                Panel admin
              </Link>
            )}

            {!usuario ? (
              <>
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-medium text-stone-700 dark:text-stone-200 hover:text-green-600 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-medium text-stone-700 dark:text-stone-200 hover:text-green-600 transition-colors"
                >
                  Crear cuenta
                </Link>
              </>
            ) : (
              <Link
                href={isCliente ? '/mi-cuenta' : '/admin'}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-medium text-stone-700 dark:text-stone-200 hover:text-green-600 transition-colors"
              >
                {isCliente ? 'Mi cuenta' : 'Panel'}
              </Link>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t dark:border-stone-700 space-y-3">
            {usuario ? (
              <button
                onClick={async () => {
                  await signOut()
                  setIsMenuOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 rounded-lg font-medium hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            ) : (
              <>
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center py-3 text-stone-700 dark:text-stone-200 hover:text-green-600 font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg font-medium transition-all"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}