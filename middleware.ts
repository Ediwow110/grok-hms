import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/patients',
  '/lab',
  '/billing',
  '/inventory',
  '/reports',
  '/admin',
  '/queue',
  '/appointments',
]

// Public routes
const publicRoutes = ['/login', '/register', '/api/auth/login', '/api/auth/register', '/api/auth/verify', '/api/auth/logout']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check if route needs protection
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  if (!isProtected) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  const payload = await verifyToken(token)
  if (!payload) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Inject user context into headers for downstream use (tenant isolation)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.userId)
  requestHeaders.set('x-tenant-id', payload.tenantId)
  requestHeaders.set('x-branch-id', payload.branchId || '')
  requestHeaders.set('x-user-role', payload.role)
  requestHeaders.set('x-permissions', JSON.stringify(payload.permissions || []))

  // Future: Add rate limiting, CSRF checks here

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}