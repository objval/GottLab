import Image from 'next/image'
import Link from 'next/link'

const TAGS_META: Record<string, { label: string; color: string }[]> = {
  default: [
    { label: 'In Vitro', color: 'bg-emerald-100 text-emerald-700' },
  ],
}

function getProductTags(producto: any) {
  const tags: { label: string; color: string }[] = []

  if (producto.nuevo) {
    tags.push({ label: 'Nuevo', color: 'bg-violet-100 text-violet-700' })
  }
  if (producto.destacado) {
    tags.push({ label: 'Destacado', color: 'bg-amber-100 text-amber-700' })
  }
  if (producto.stock_total > 0 && producto.stock_total <= 5) {
    tags.push({ label: 'Últimas unidades', color: 'bg-red-100 text-red-700' })
  }

  const categoria = Array.isArray(producto.categorias)
    ? producto.categorias[0]?.nombre
    : producto.categorias?.nombre
  if (categoria) {
    tags.push({ label: categoria, color: 'bg-sky-100 text-sky-700' })
  }

  if (tags.length === 0) {
    tags.push(...TAGS_META.default)
  }

  return tags.slice(0, 3)
}

interface ProductCardProps {
  producto: any
  size?: 'sm' | 'md'
}

export default function ProductCard({ producto, size = 'md' }: ProductCardProps) {
  const tags = getProductTags(producto)
  const enStock = producto.stock_total > 0
  const precio = `$${Number(producto.precio_venta).toLocaleString('es-CL')}`

  return (
    <Link
      href={`/productos/${producto.id_producto}`}
      className="group relative bg-white dark:bg-stone-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-stone-700 shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-lg"
    >
      {/* Image */}
      <div className={`relative ${size === 'sm' ? 'aspect-[3/4]' : 'aspect-square'} bg-stone-50 overflow-hidden`}>
        <Image
          src="/placeholder.avif"
          alt={producto.nombre}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes={size === 'sm' ? '180px' : '(max-width: 640px) 50vw, 25vw'}
        />

        {/* Stock overlay */}
        {!enStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full">
              Agotado
            </span>
          </div>
        )}

        {/* Tags floating */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold ${tag.color} backdrop-blur-sm`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={`${size === 'sm' ? 'p-2.5' : 'p-3 sm:p-4'}`}>
        <h3 className={`font-bold text-stone-800 dark:text-stone-100 leading-tight line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors ${
          size === 'sm' ? 'text-xs' : 'text-xs sm:text-sm'
        }`}>
          {producto.nombre}
        </h3>

        {producto.nombre_cientifico && (
          <p className="text-[10px] sm:text-xs text-stone-400 italic mt-0.5 line-clamp-1">
            {producto.nombre_cientifico}
          </p>
        )}

        <div className={`${size === 'sm' ? 'mt-1.5' : 'mt-2 sm:mt-3'} flex items-center justify-between`}>
          <span className={`font-black text-stone-900 dark:text-white ${size === 'sm' ? 'text-sm' : 'text-base sm:text-lg'}`}>
            {precio}
          </span>
          {enStock && (
            <span className="text-[9px] sm:text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
              Stock
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
