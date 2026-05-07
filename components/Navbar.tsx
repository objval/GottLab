'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart'
import Menu from 'lucide-react/dist/esm/icons/menu'
import X from 'lucide-react/dist/esm/icons/x'
import Leaf from 'lucide-react/dist/esm/icons/leaf'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

            {/* Desktop Links - Centro */}
            <div className="hidden md:flex items-center justify-center space-x-8">
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

            {/* Desktop Actions - Derecha */}
            <div className="hidden md:flex items-center justify-end space-x-4">
              <div className="relative">
                <ShoppingCart className={`h-5 w-5 cursor-pointer ${isWhite ? (theme === 'dark' ? 'text-white hover:text-green-400' : 'text-stone-700 hover:text-green-600') : (useWhiteText || (!isHome && theme === 'dark')) ? 'text-white/90 hover:text-green-400' : 'text-stone-800 hover:text-green-700'} transition-colors`} />
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </div>

              <Link href="/login" className={`px-3 py-1.5 transition-colors ${isWhite ? (theme === 'dark' ? 'text-white hover:text-green-400' : 'text-stone-700 hover:text-green-600') : (useWhiteText || (!isHome && theme === 'dark')) ? 'text-white/90 hover:text-green-400' : 'text-stone-800 hover:text-green-700'}`}>
                Iniciar Sesión
              </Link>

              <Link href="/register" className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg">
                Registrarse
              </Link>

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
            <div className="md:hidden col-start-3 justify-self-end flex items-center gap-2">
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
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t dark:border-stone-700 space-y-3">
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
          </div>
        </div>
      </div>
    </>
  )
}