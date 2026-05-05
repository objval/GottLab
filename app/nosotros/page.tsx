'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Leaf from 'lucide-react/dist/esm/icons/leaf'
import Microscope from 'lucide-react/dist/esm/icons/microscope'
import Sun from 'lucide-react/dist/esm/icons/sun'
import MapPin from 'lucide-react/dist/esm/icons/map-pin'
import Target from 'lucide-react/dist/esm/icons/target'
import Eye from 'lucide-react/dist/esm/icons/eye'
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right'

// Icono de Instagram como SVG
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

export default function NosotrosPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
              filter: 'blur(60px)'
            }}
          />
          <div 
            className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
              filter: 'blur(50px)'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header with Logo */}
          <div className="text-center mb-16">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-900/20">
                <Leaf className="h-14 w-14 text-white" />
              </div>
              <div className="text-center">
                <span className="text-4xl md:text-5xl font-bold text-stone-800">SO</span>
                <span className="text-4xl md:text-5xl font-bold text-emerald-600">MOS</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Microscope className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">Laboratorio In Vitro</h3>
              <p className="text-stone-600">Técnicas avanzadas de micropropagación</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sun className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">Plantas Tropicales</h3>
              <p className="text-stone-600">Variedades cuidadosamente seleccionadas</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">Aclimatación Local</h3>
              <p className="text-stone-600">Adaptadas al territorio chileno</p>
            </div>
          </div>

          {/* Instagram CTA */}
          <div className="text-center mb-20">
            <a 
              href="https://instagram.com/gottlab" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all group"
            >
              <InstagramIcon className="h-6 w-6" />
              <span>Ver más en Instagram</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Quiénes Somos Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">Quiénes Somos</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto rounded-full" />
          </div>

          <div className="prose prose-lg prose-stone mx-auto">
            <p className="text-lg text-stone-700 leading-relaxed mb-6">
              <span className="font-bold text-emerald-600">Gott Lab</span> es un laboratorio chileno especializado en la producción in vitro de plantas ornamentales y tropicales, fundado en 2023 por dos jóvenes diseñadores y paisajistas apasionados por la botánica, el diseño del paisaje y la innovación vegetal. Nacimos con el propósito de ofrecer una alternativa nacional, sustentable y de alta calidad para el mercado hortícola y paisajístico.
            </p>

            <p className="text-lg text-stone-700 leading-relaxed mb-6">
              A través de técnicas avanzadas de micropropagación, cultivamos especies cuidadosamente seleccionadas, asegurando su sanidad, vigor y adaptabilidad al entorno local. Hoy, contamos con un amplio stock de variedades tropicales y ornamentales listas para ser incorporadas a proyectos paisajísticos, viveros y colecciones botánicas.
            </p>

            <p className="text-lg text-stone-700 leading-relaxed text-center italic border-l-4 border-emerald-500 pl-6 py-2 bg-emerald-50 rounded-r-lg">
              Nos mueve la idea de que las plantas también son cultura, diseño y biodiversidad. Por eso, nuestro trabajo busca conectar ciencia, arte y sustentabilidad en cada ejemplar que producimos.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-green-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Misión */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">Nuestra Misión</h3>
              </div>
              <p className="text-lg text-white/90 leading-relaxed">
                Producir y distribuir plantas ornamentales y tropicales de alta calidad mediante técnicas in vitro, promoviendo una alternativa local y sustentable, con especies aclimatadas al territorio chileno. Reducimos los riesgos asociados a la importación, como la pérdida de material vegetal o la introducción de plagas, ofreciendo un producto confiable, sano y adaptado.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <Eye className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">Nuestra Visión</h3>
              </div>
              <p className="text-lg text-white/90 leading-relaxed">
                Queremos ser un referente en la producción nacional de plantas in vitro en Chile, aportando al desarrollo de una industria hortícola más sustentable, innovadora y consciente. Queremos democratizar el acceso a especies tropicales y ornamentales de calidad, cultivadas con estándares técnicos y responsabilidad ecológica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-6">
            ¿Quieres conocer más sobre nosotros?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/productos"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Ver Productos
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a 
              href="https://instagram.com/gottlab" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-stone-800 border-2 border-stone-300 px-8 py-3 rounded-lg font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-colors"
            >
              <InstagramIcon className="h-5 w-5" />
              Síguenos en Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
