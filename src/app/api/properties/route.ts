import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    const type = searchParams.get('type')
    const purpose = searchParams.get('purpose')
    const status = searchParams.get('status')
    const city = searchParams.get('city')
    const district = searchParams.get('district')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minArea = searchParams.get('minArea')
    const maxArea = searchParams.get('maxArea')
    const rooms = searchParams.get('rooms')
    const bathrooms = searchParams.get('bathrooms')
    const facing = searchParams.get('facing')
    const featured = searchParams.get('featured')
    const query = searchParams.get('query')
    const ownerId = searchParams.get('ownerId')

    if (type) where.type = type
    if (purpose) where.purpose = purpose
    if (status) where.status = status
    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (district) where.district = { contains: district, mode: 'insensitive' }
    if (facing) where.facing = facing
    if (featured === 'true') where.featured = true
    if (ownerId) where.ownerId = ownerId
    if (rooms) where.rooms = { gte: parseInt(rooms) }
    if (bathrooms) where.bathrooms = { gte: parseInt(bathrooms) }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice)
      if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice)
    }

    if (minArea || maxArea) {
      where.area = {}
      if (minArea) (where.area as Record<string, number>).gte = parseFloat(minArea)
      if (maxArea) (where.area as Record<string, number>).lte = parseFloat(maxArea)
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { district: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
      ]
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: { where: { isMain: true }, take: 1 },
          owner: { select: { id: true, name: true, phone: true } },
          amenities: { select: { id: true, name: true } },
          _count: { select: { images: true } },
        },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Properties GET error:', error)
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title, description, type, purpose, status, price, area,
      rooms, bathrooms, floor, facing, district, city, address,
      lat, lng, featured, ownerId, amenities,
    } = body

    if (!title || !type || !purpose || !price || !area) {
      return NextResponse.json(
        { success: false, error: 'الحقول المطلوبة: العنوان، النوع، الغرض، السعر، المساحة' },
        { status: 400 }
      )
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        type,
        purpose,
        status: status || 'READY',
        price: parseFloat(price),
        area: parseFloat(area),
        rooms: rooms ? parseInt(rooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        floor: floor ? parseInt(floor) : null,
        facing,
        district,
        city: city || 'المدينة المنورة',
        address,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        featured: featured || false,
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

    return NextResponse.json({ success: true, data: property }, { status: 201 })
  } catch (error) {
    console.error('Property POST error:', error)
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
