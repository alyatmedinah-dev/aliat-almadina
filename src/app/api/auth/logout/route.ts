import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'تم تسجيل الخروج' })
  response.cookies.set(clearAuthCookie())
  return response
}
