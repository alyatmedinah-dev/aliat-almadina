import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })

    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    const [
      totalProperties,
      totalClients,
      totalOwners,
      totalContracts,
      activeRentals,
      propertiesForSale,
      propertiesForRent,
      recentProperties,
      recentClients,
      contractsByMonth,
      propertyTypeDistribution,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.client.count(),
      prisma.owner.count(),
      prisma.contract.count(),
      prisma.rental.count({ where: { status: 'ACTIVE' } }),
      prisma.property.count({ where: { purpose: 'SALE' } }),
      prisma.property.count({ where: { purpose: 'RENT' } }),
      prisma.property.findMany({
        include: { images: { where: { isMain: true }, take: 1 } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.contract.groupBy({
        by: ['createdAt'],
        where: { createdAt: { gte: startOfYear } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.property.groupBy({
        by: ['type'],
        _count: { type: true },
      }),
    ])

    // Process monthly revenue
    const monthlyMap: Record<string, number> = {}
    contractsByMonth.forEach((item) => {
      const month = new Date(item.createdAt).toLocaleDateString('ar-SA', { month: 'long' })
      monthlyMap[month] = (monthlyMap[month] || 0) + (item._sum.amount || 0)
    })

    const monthlyRevenue = Object.entries(monthlyMap).map(([month, amount]) => ({
      month,
      amount,
    }))

    const TYPE_LABELS: Record<string, string> = {
      VILLA: 'فيلا',
      APARTMENT: 'شقة',
      LAND: 'أرض',
      BUILDING: 'عمارة',
      SHOP: 'محل',
      OFFICE: 'مكتب',
      WAREHOUSE: 'مستودع',
    }

    const totalRevenue = contractsByMonth.reduce((sum, item) => sum + (item._sum.amount || 0), 0)

    return NextResponse.json({
      success: true,
      data: {
        totalProperties,
        totalClients,
        totalOwners,
        totalContracts,
        totalRevenue,
        activeRentals,
        propertiesForSale,
        propertiesForRent,
        recentProperties,
        recentClients,
        monthlyRevenue,
        propertyTypeDistribution: propertyTypeDistribution.map((item) => ({
          type: TYPE_LABELS[item.type] || item.type,
          count: item._count.type,
        })),
      },
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
