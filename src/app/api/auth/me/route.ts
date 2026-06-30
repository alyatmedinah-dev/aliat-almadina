import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const authUser = await getAuthUserFromRequest(request)

  if (!authUser) {
    return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      isActive: true,
      createdAt: true,
    },
  })

  if (!user || !user.isActive) {
    return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })
  }

  return NextResponse.json({ success: true, data: user })
}
