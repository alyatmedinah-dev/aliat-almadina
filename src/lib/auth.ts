import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import type { AuthUser } from '@/types'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'aliat-almadina-super-secret-key-2024'
)

const TOKEN_EXPIRY = '7d'
const COOKIE_NAME = 'aliat_token'

export async function signToken(payload: AuthUser): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(SECRET_KEY)
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload as unknown as AuthUser
  } catch {
    return null
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    return await verifyToken(token)
  } catch {
    return null
  }
}

export async function getAuthUserFromRequest(req: NextRequest): Promise<AuthUser | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  return await verifyToken(token)
}

export function setAuthCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  }
}

export function clearAuthCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  }
}

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  MANAGER: [
    'properties:read', 'properties:write', 'properties:delete',
    'owners:read', 'owners:write',
    'clients:read', 'clients:write',
    'contracts:read', 'contracts:write',
    'rentals:read', 'rentals:write',
    'reports:read',
    'blog:read', 'blog:write',
    'users:read',
  ],
  EMPLOYEE: [
    'properties:read', 'properties:write',
    'owners:read', 'owners:write',
    'clients:read', 'clients:write',
    'contracts:read',
    'rentals:read',
  ],
  MARKETING: [
    'properties:read', 'properties:write',
    'blog:read', 'blog:write',
    'clients:read',
  ],
  RECEPTION: [
    'properties:read',
    'clients:read', 'clients:write',
  ],
}

export function hasPermission(role: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || []
  return permissions.includes('*') || permissions.includes(permission)
}
