import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
)

const cargosPermitidos = ['admin', 'administrador', 'vendedor', 'vendedora']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    try {
      const { payload } = await jwtVerify(token, secret)
      const cargo = (payload.cargo as string)?.toLowerCase() ?? ''
      if (!cargosPermitidos.includes(cargo)) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
