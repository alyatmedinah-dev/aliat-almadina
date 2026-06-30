import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DashboardStats from './_components/DashboardStats'
import RevenueChart from './_components/RevenueChart'
import PropertyTypeChart from './_components/PropertyTypeChart'
import RecentProperties from './_components/RecentProperties'
import RecentClients from './_components/RecentClients'
import QuickActions from './_components/QuickActions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'لوحة التحكم | عالية المدينة',
}

export default async function DashboardPage() {
  const user = await getAuthUser()
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
    expiringContracts,
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
    prisma.contract.findMany({
      where: { createdAt: { gte: startOfYear } },
      select: { amount: true, createdAt: true, type: true },
    }),
    prisma.property.groupBy({
      by: ['type'],
      _count: { type: true },
    }),
    prisma.contract.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // next 30 days
          gte: now,
        },
      },
      include: {
        property: { select: { title: true } },
        client: { select: { name: true } },
      },
      take: 5,
    }),
  ])

  // Process monthly revenue (Arabic months)
  const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
  const monthlyMap: Record<string, number> = {}
  monthNames.forEach((m) => (monthlyMap[m] = 0))

  contractsByMonth.forEach((c) => {
    const monthIndex = new Date(c.createdAt).getMonth()
    const monthName = monthNames[monthIndex]
    monthlyMap[monthName] = (monthlyMap[monthName] || 0) + c.amount
  })

  const monthlyRevenue = monthNames.map((month) => ({
    month,
    amount: monthlyMap[month] || 0,
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

  const totalRevenue = contractsByMonth.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            مرحباً، {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('ar-SA', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Stats Cards */}
      <DashboardStats
        totalProperties={totalProperties}
        totalClients={totalClients}
        totalOwners={totalOwners}
        totalContracts={totalContracts}
        totalRevenue={totalRevenue}
        activeRentals={activeRentals}
        propertiesForSale={propertiesForSale}
        propertiesForRent={propertiesForRent}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={monthlyRevenue} />
        </div>
        <div>
          <PropertyTypeChart
            data={propertyTypeDistribution.map((item) => ({
              type: TYPE_LABELS[item.type] || item.type,
              count: item._count.type,
            }))}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProperties properties={recentProperties as any} />
        <RecentClients clients={recentClients as any} />
      </div>

      {/* Expiring Contracts Alert */}
      {expiringContracts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-600 font-semibold text-sm">
              ⚠️ عقود تنتهي خلال 30 يوماً ({expiringContracts.length})
            </span>
          </div>
          <div className="space-y-2">
            {expiringContracts.map((contract) => (
              <div key={contract.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  {contract.property?.title} - {contract.client?.name}
                </span>
                <span className="text-amber-600 font-medium">
                  {new Date(contract.endDate).toLocaleDateString('ar-SA')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
