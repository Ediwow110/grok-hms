import bcrypt from 'bcryptjs'
import * as jose from 'jose'
import { cookies } from 'next/headers'
import prisma from './prisma'

// Types for better type safety
export interface JWTPayload {
  userId: string
  tenantId: string
  branchId?: string
  role: string
  permissions: string[]
  iat?: number
  exp?: number
}

// Hash password with bcrypt (cost factor 12 for security)
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate JWT token (httpOnly cookie recommended)
export async function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
  const token = await new jose.SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '7d')
    .sign(secret)
  return token
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jose.jwtVerify(token, secret)
    return payload as unknown as JWTPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

// Get current user from cookie (server-side)
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  // Optionally re-fetch fresh user data from DB to ensure active status
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      tenantId: true,
      branchId: true,
      status: true,
    }
  })

  if (!user || user.status !== 'active') return null

  return { ...user, permissions: payload.permissions }
}

// Set auth cookie (httpOnly, secure, sameSite for security)
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

// MFA placeholder (extend in Phase 4+)
export async function generateMFASecret(): Promise<string> {
  // Use speakeasy or otplib in production
  return 'MFA_SECRET_PLACEHOLDER'
}