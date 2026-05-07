'use client'

import { usePathname } from 'next/navigation'
import { Truck } from 'lucide-react'

export default function AnnouncementBar() {
  const pathname = usePathname()

  if (pathname !== '/') return null

  return (
    <div className="absolute top-[72px] left-4 right-4 z-40 py-2 text-center text-xs font-medium flex lg:hidden [@media(orientation:landscape)]:hidden items-center justify-center gap-2 bg-white/30 backdrop-blur-md border border-white/40 text-black shadow-lg shadow-black/5 rounded-full">
      <Truck className="h-3.5 w-3.5 flex-shrink-0" />
      <span>Envíos a todo Chile por Correos de Chile</span>
    </div>
  )
}
