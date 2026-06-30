import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PropertyDetailClient from './_components/PropertyDetailClient'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const property = await prisma.property.findUnique({ where: { id }, select: { title: true, description: true } })
  if (!property) return { title: 'عقار غير موجود' }
  return {
    title: property.title,
    description: property.description || undefined,
  }
}

export default async function PropertyPage({ params }: Props) {
  const { id } = await params

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: [{ isMain: 'desc' }, { order: 'asc' }] },
      videos: true,
      pdfs: true,
      owner: { select: { id: true, name: true, phone: true, whatsapp: true, email: true } },
      amenities: true,
    },
  })

  if (!property) notFound()

  const similar = await prisma.property.findMany({
    where: { id: { not: id }, type: property.type, purpose: property.purpose },
    include: { images: { where: { isMain: true }, take: 1 } },
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  // Increment views
  await prisma.property.update({ where: { id }, data: { views: { increment: 1 } } })

  return <PropertyDetailClient property={property as any} similar={similar as any} />
}
