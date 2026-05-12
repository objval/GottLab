import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

interface RouteRule {
  prefix: string
  roles: ('admin' | 'empleado' | 'cliente')[]
  redirect?: string
}

const rules: RouteRule[] = [
  { prefix: '/admin', roles: ['admin'], redirect: '/login' },
  { prefix: '/panel-empleado', roles: ['admin', 'empleado'], redirect: '/login' },
  { prefix: '/mi-cuenta', roles: ['cliente'], redirect: '/login' },
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const rule = rules.find(r => pathname.startsWith(r.prefix))

  if (!rule) return NextResponse.next()

  const token = request.cookies.get('auth_token')?.value
  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = rule.redirect ?? '/'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  const payload = await verifyToken(token)
  if (!payload || !rule.roles.includes(payload.role)) {
    const url = request.nextUrl.clone()
    url.pathname = rule.redirect ?? '/'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/panel-empleado/:path*', '/mi-cuenta/:path*'],
}
