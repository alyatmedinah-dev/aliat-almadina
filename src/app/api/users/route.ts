import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })
    if (authUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'لا تملك صلاحية الوصول' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true,
        phone: true, isActive: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: users })
  } catch {
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })
    if (authUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'لا تملك صلاحية الإضافة' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, password, role, phone } = body

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'الاسم والبريد وكلمة المرور مطلوبة' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role || 'EMPLOYEE',
        phone,
      },
      select: { id: true, name: true, email: true, role: true, phone: true, isActive: true, createdAt: true },
    })

    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'البريد الإلكتروني مستخدم مسبقاً' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
