import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: { orderBy: [{ isMain: 'desc' }, { order: 'asc' }] },
        videos: true,
        pdfs: true,
        owner: {
          select: { id: true, name: true, phone: true, whatsapp: true, email: true },
        },
        amenities: true,
      },
    })

    if (!property) {
      return NextResponse.json({ success: false, error: 'العقار غير موجود' }, { status: 404 })
    }

    // Increment views
    await prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    // Get similar properties
    const similar = await prisma.property.findMany({
      where: {
        id: { not: id },
        type: property.type,
        purpose: property.purpose,
      },
      include: { images: { where: { isMain: true }, take: 1 } },
      take: 4,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: { ...property, similar },
    })
  } catch (error) {
    console.error('Property GET error:', error)
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const {
      title, description, type, purpose, status, price, area,
      rooms, bathrooms, floor, facing, district, city, address,
      lat, lng, featured, ownerId, amenities,
    } = body

    // Delete old amenities and recreate
    await prisma.propertyAmenity.deleteMany({ where: { propertyId: id } })

    const property = await prisma.property.update({
      where: { id },
      data: {
        title,
        description,
        type,
        purpose,
        status,
        price: price ? parseFloat(price) : undefined,
        area: area ? parseFloat(area) : undefined,
        rooms: rooms ? parseInt(rooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        floor: floor ? parseInt(floor) : null,
        facing,
        district,
        city,
        address,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        featured,
        ownerId: ownerId || null,
        amenities: amenities?.length
          ? { create: amenities.map((name: string) => ({ name })) }
          : undefined,
      },
      include: {
        images: true,
        owner: { select: { id: true, name: true } },
        amenities: true,
      },
    })

    return NextResponse.json({ success: true, data: property })
  } catch (error) {
    console.error('Property PUT error:', error)
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'MANAGER'].includes(authUser.role)) {
      return NextResponse.json({ success: false, error: 'لا تملك صلاحية الحذف' }, { status: 403 })
    }

    const { id } = await params

    await prisma.property.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'تم حذف العقار بنجاح' })
  } catch (error) {
    console.error('Property DELETE error:', error)
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
