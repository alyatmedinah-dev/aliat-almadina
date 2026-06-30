import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const query = searchParams.get('query')

    const where: Record<string, unknown> = {}
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query } },
        { nationalId: { contains: query } },
      ]
    }

    const [owners, total] = await Promise.all([
      prisma.owner.findMany({
        where,
        include: {
          _count: { select: { properties: true, contracts: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.owner.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: owners,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })

    const body = await request.json()
    const { name, phone, whatsapp, email, nationalId, address, notes, dealType } = body

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'الاسم والجوال مطلوبان' },
        { status: 400 }
      )
    }

    const owner = await prisma.owner.create({
      data: { name, phone, whatsapp, email, nationalId, address, notes, dealType: dealType || 'BOTH' },
    })

    return NextResponse.json({ success: true, data: owner }, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'رقم الهوية مسجل مسبقاً' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
