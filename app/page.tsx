import Image from "next/image";
import Link from "next/link";
import { Leaf, Droplets, ShoppingCart, Star, Clock, TrendingUp } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCarousel from "@/components/ProductCarousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir GottLab?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tecnología de vanguardia para cultivar las plantas más exóticas y saludables
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cultivo In Vitro
              </h3>
              <p className="text-gray-600">
                Tecnología avanzada que garantiza plantas libres de enfermedades y con crecimiento óptimo
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Variedades Exclusivas
              </h3>
              <p className="text-gray-600">
                Acceso a especies raras y híbridos únicos que no encontrarás en ningún otro lugar
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Calidad Garantizada
              </h3>
              <p className="text-gray-600">
                Cada planta es inspeccionada y certificada por nuestros expertos botánicos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Productos Destacados
              </h2>
              <p className="text-lg text-gray-600">
                Las plantas más populares de nuestra colección
              </p>
            </div>
            <Link 
              href="/productos"
              className="text-green-600 hover:text-green-700 font-semibold flex items-center"
            >
              Ver todos →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center p-4">
                  <Leaf className="h-12 w-12 sm:h-16 sm:w-16 text-green-600" />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    Planta Exótica #{item}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                    Especie rara cultivada en laboratorio
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg sm:text-2xl font-bold text-green-600">
                      ${29 + item * 10}
                    </span>
                    <button className="bg-green-600 text-white p-1.5 sm:p-2 rounded-lg hover:bg-green-700 transition-colors">
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos y Preventas Carousel */}
      <ProductCarousel />

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para empezar tu colección?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Únete a miles de coleccionistas que ya disfrutan de nuestras plantas exclusivas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/productos"
              className="inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Explorar Catálogo
            </Link>
            <Link 
              href="/contacto"
              className="inline-flex items-center justify-center px-8 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Contactar Expertos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
