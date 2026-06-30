import type { Metadata } from 'next'
import HeroSection from './_components/HeroSection'
import StatsSection from './_components/StatsSection'
import FeaturedProperties from './_components/FeaturedProperties'
import ServicesSection from './_components/ServicesSection'
import WhyChooseUs from './_components/WhyChooseUs'
import ContactCTA from './_components/ContactCTA'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'عالية المدينة للخدمات العقارية | المدينة المنورة',
  description: 'أفضل منصة عقارية في المدينة المنورة. فلل، شقق، أراضي، عمائر للبيع والإيجار في حي الرانوناء وجميع أحياء المدينة المنورة.',
}

export default async function HomePage() {
  const [featuredProperties, stats] = await Promise.all([
    prisma.property.findMany({
      where: { featured: true },
      include: {
        images: { where: { isMain: true }, take: 1 },
        owner: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    Promise.all([
      prisma.property.count(),
      prisma.client.count(),
      prisma.owner.count(),
      prisma.contract.count(),
    ]),
  ])

  const [totalProperties, totalClients, totalOwners, totalContracts] = stats

  return (
    <>
      <HeroSection />
      <StatsSection
        totalProperties={totalProperties}
        totalClients={totalClients}
        totalOwners={totalOwners}
        totalContracts={totalContracts}
      />
      <FeaturedProperties properties={featuredProperties as any} />
      <ServicesSection />
      <WhyChooseUs />
      <ContactCTA />
    </>
  )
}
