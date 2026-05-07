'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import AnnouncementBar from '@/components/AnnouncementBar'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
    </>
  )
}
