'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart'
import Menu from 'lucide-react/dist/esm/icons/menu'
import X from 'lucide-react/dist/esm/icons/x'
import Leaf from 'lucide-react/dist/esm/icons/leaf'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isWhite 
          ? 'bg-white shadow-md' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">

            {/* Logo - Izquierda */}
            <Link href="/" className="flex items-center space-x-2 justify-self-start">
              <Leaf className={`h-8 w-8 ${isWhite ? 'text-green-600' : useWhiteText ? 'text-green-400' : 'text-green-700'}`} />
              <span className={`text-xl font-bold ${isWhite ? 'text-stone-800' : useWhiteText ? 'text-white' : 'text-stone-900'}`}>GottLab</span>
            </Link>

            {/* Desktop Links - Centro */}
            <div className="hidden md:flex items-center justify-center space-x-8">
              <Link href="/" className={`${isWhite ? 'text-stone-700 hover:text-green-600' : useWhiteText ? 'text-white/90 hover:text-green-400' : 'text-stone-800 hover:text-green-700'} transition-colors`}>Inicio</Link>
              <Link href="/productos" className={`${isWhite ? 'text-stone-700 hover:text-green-600' : useWhiteText ? 'text-white/90 hover:text-green-400' : 'text-stone-800 hover:text-green-700'} transition-colors`}>Productos</Link>
              <Link href="/preventas" className={`${isWhite ? 'text-stone-700 hover:text-green-600' : useWhiteText ? 'text-white/90 hover:text-green-400' : 'text-stone-800 hover:text-green-700'} transition-colors`}>Preventas</Link>
              <Link href="/nosotros" className={`${isWhite ? 'text-stone-700 hover:text-green-600' : useWhiteText ? 'text-white/90 hover:text-green-400' : 'text-stone-800 hover:text-green-700'} transition-colors`}>Nosotros</Link>
              <Link href="/contacto" className={`${isWhite ? 'text-stone-700 hover:text-green-600' : useWhiteText ? 'text-white/90 hover:text-green-400' : 'text-stone-800 hover:text-green-700'} transition-colors`}>Contacto</Link>
            </div>

            {/* Desktop Actions - Derecha */}
            <div className="hidden md:flex items-center justify-end space-x-4">
              <div className="relative">
                <ShoppingCart className={`h-5 w-5 cursor-pointer ${isWhite ? 'text-stone-700 hover:text-green-600' : useWhiteText ? 'text-white/90 hover:text-green-400' : 'text-stone-800 hover:text-green-700'} transition-colors`} />
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </div>

              <Link href="/login" className={`px-3 py-1.5 transition-colors ${isWhite ? 'text-stone-700 hover:text-green-600' : useWhiteText ? 'text-white/90 hover:text-green-400' : 'text-stone-800 hover:text-green-700'}`}>
                Iniciar Sesión
              </Link>

              <Link href="/register" className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg">
                Registrarse
              </Link>
            </div>

            {/* Mobile button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`md:hidden col-start-3 justify-self-end p-2 transition-colors ${isWhite ? 'text-stone-700 hover:text-green-600' : useWhiteText ? 'text-white/90 hover:text-green-400' : 'text-stone-800 hover:text-green-700'}`}
            >
              <Menu className="h-6 w-6" />
            </button>
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
          className={`absolute inset-0 bg-white flex flex-col transition-transform duration-500 ease-out ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b h-16">
            <span className="font-bold text-lg text-stone-800">GottLab</span>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-stone-700 hover:text-green-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* CONTENT - CENTRADO */}
          <div className="flex-1 overflow-y-auto px-8 py-8 flex flex-col justify-center items-center space-y-6">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-medium text-stone-700 hover:text-green-600 transition-colors"
            >
              Inicio
            </Link>
            <Link 
              href="/productos" 
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-medium text-stone-700 hover:text-green-600 transition-colors"
            >
              Productos
            </Link>
            <Link 
              href="/preventas" 
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-medium text-stone-700 hover:text-green-600 transition-colors"
            >
              Preventas
            </Link>
            <Link 
              href="/nosotros" 
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-medium text-stone-700 hover:text-green-600 transition-colors"
            >
              Nosotros
            </Link>
            <Link 
              href="/contacto" 
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-medium text-stone-700 hover:text-green-600 transition-colors"
            >
              Contacto
            </Link>
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t space-y-3">
            <Link 
              href="/login" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-center py-3 text-stone-700 hover:text-green-600 font-medium"
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