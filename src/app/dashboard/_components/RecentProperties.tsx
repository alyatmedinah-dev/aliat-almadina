'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ArrowLeft } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { PROPERTY_TYPE_LABELS, PROPERTY_PURPOSE_LABELS } from '@/types'
import type { Property } from '@/types'

interface RecentPropertiesProps {
  properties: (Property & { images: { url: string; isMain: boolean }[] })[]
}

export default function RecentProperties({ properties }: RecentPropertiesProps) {
  return (
    <div className="dash-card">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900 text-base">أحدث العقارات</h3>
        <Link href="/dashboard/properties" className="text-xs text-[#C9A84C] hover:underline flex items-center gap-1">
          عرض الكل <ArrowLeft className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {properties.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">لا توجد عقارات</p>
        ) : (
          properties.map((property) => {
            const mainImage = property.images?.[0]?.url
            return (
              <Link
                key={property.id}
                href={`/dashboard/properties/${property.id}/edit`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {mainImage ? (
                    <Image src={mainImage} alt={property.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🏠</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-[#C9A84C] transition-colors">
                    {property.title}
                  </p>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{property.district || property.city}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[#C9A84C] font-bold text-sm">{formatPrice(property.price)}</p>
                  <p className="text-gray-400 text-xs">{PROPERTY_PURPOSE_LABELS[property.purpose]}</p>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
