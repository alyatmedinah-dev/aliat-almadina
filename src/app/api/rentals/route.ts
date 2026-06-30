import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    const rentals = await prisma.rental.findMany({
      include: {
        property: { select: { title: true } },
        client: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ success: true, data: rentals })
  } catch {
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })

    const body = await request.json()
    const { propertyId, clientId, amount, paymentDay, startDate, endDate, notes } = body

    if (!propertyId || !clientId || !amount || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: 'جميع الحقول المطلوبة يجب تعبئتها' }, { status: 400 })
    }

    const rental = await prisma.rental.create({
      data: {
        propertyId,
        clientId,
        amount: parseFloat(amount),
        paymentDay: parseInt(paymentDay) || 1,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        notes,
        status: 'ACTIVE',
      },
      include: {
        property: { select: { title: true } },
        client: { select: { name: true } },
      },
    })

    // تحديث حالة العقار إلى مؤجر
    await prisma.property.update({
      where: { id: propertyId },
      data: { status: 'RENTED' },
    })

    return NextResponse.json({ success: true, data: rental }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
