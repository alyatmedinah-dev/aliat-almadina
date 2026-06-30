import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })

    const { id } = await params

    const owner = await prisma.owner.findUnique({
      where: { id },
      include: {
        properties: {
          include: { images: { where: { isMain: true }, take: 1 } },
          orderBy: { createdAt: 'desc' },
        },
        contracts: {
          include: { property: { select: { title: true } }, client: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { properties: true, contracts: true } },
      },
    })

    if (!owner) return NextResponse.json({ success: false, error: 'المالك غير موجود' }, { status: 404 })

    return NextResponse.json({ success: true, data: owner })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })

    const { id } = await params
    const body = await request.json()

    const owner = await prisma.owner.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({ success: true, data: owner })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })

    if (!['SUPER_ADMIN', 'MANAGER'].includes(authUser.role)) {
      return NextResponse.json({ success: false, error: 'لا تملك صلاحية الحذف' }, { status: 403 })
    }

    const { id } = await params
    await prisma.owner.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'تم حذف المالك' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
