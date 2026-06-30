import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { generateContractNumber } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (type) where.type = type

    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        include: {
          property: { select: { title: true, type: true } },
          client: { select: { name: true, phone: true } },
          owner: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contract.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: contracts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })

    const body = await request.json()
    const { type, propertyId, clientId, ownerId, startDate, endDate, amount, notes } = body

    if (!type || !propertyId || !clientId || !startDate || !endDate || !amount) {
      return NextResponse.json({ success: false, error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    const contract = await prisma.contract.create({
      data: {
        contractNumber: generateContractNumber(),
        type,
        propertyId,
        clientId,
        ownerId: ownerId || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        amount: parseFloat(amount),
        notes,
        status: 'ACTIVE',
      },
      include: {
        property: { select: { title: true } },
        client: { select: { name: true } },
      },
    })

    return NextResponse.json({ success: true, data: contract }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
