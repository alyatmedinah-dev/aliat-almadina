'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Search, Loader2, Home } from 'lucide-react'
import MapView from '@/components/map/MapView'
import { formatPrice } from '@/lib/utils'
import { PROPERTY_TYPE_LABELS } from '@/types'

export default function MapPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('')
  const [purpose, setPurpose] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '100' })
    if (type) params.set('type', type)
    if (purpose) params.set('purpose', purpose)
    try {
      const res = await fetch(`/api/properties?${params}`)
      const data = await res.json()
      if (data.success) setProperties(data.data)
    } finally {
      setLoading(false)
    }
  }, [type, purpose])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''
  const withLocation = properties.filter((p) => p.lat && p.lng)

  return (
    <div className="h-screen flex flex-col" dir="rtl">
      {/* Filters Bar */}
      <div className="bg-[#0A0A0A] border-b border-[#2A2A2A] px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <h1 className="text-white font-bold text-lg hidden md:block ml-4">خريطة العقارات</h1>
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="bg-white/10 text-white text-sm rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:border-[#C9A84C]">
          <option value="">كل الأنواع</option>
          {Object.entries(PROPERTY_TYPE_LABELS).map(([v, l]) => <option key={v} value={v} className="text-black">{l}</option>)}
        </select>
        <select value={purpose} onChange={(e) => setPurpose(e.target.value)}
          className="bg-white/10 text-white text-sm rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:border-[#C9A84C]">
          <option value="">بيع وإيجار</option>
          <option value="SALE" className="text-black">للبيع</option>
          <option value="RENT" className="text-black">للإيجار</option>
        </select>
        <span className="text-gray-400 text-sm mr-auto">{withLocation.length} عقار على الخريطة</span>
        <Link href="/properties" className="text-[#C9A84C] text-sm hover:underline hidden md:block">
          عرض كقائمة
        </Link>
      </div>

      {/* Map + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar List */}
        <div className="w-full md:w-96 bg-white border-l border-gray-100 overflow-y-auto flex-shrink-0 hidden md:block">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 text-[#C9A84C] animate-spin" />
            </div>
          ) : withLocation.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Home className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-gray-400 text-sm">لا توجد عقارات بموقع محدد مطابقة للفلاتر</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {withLocation.map((property) => {
                const img = property.images?.[0]?.url
                return (
                  <div
                    key={property.id}
                    onMouseEnter={() => setActiveId(property.id)}
                    className={`flex gap-3 p-4 cursor-pointer transition-colors ${activeId === property.id ? 'bg-[rgba(201,168,76,0.06)]' : 'hover:bg-gray-50'}`}
                  >
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {img ? (
                        <Image src={img} alt={property.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">🏠</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-1">{property.title}</p>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{property.district || property.city}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[#C9A84C] font-bold text-sm">{formatPrice(property.price)} ر.س</span>
                        <Link href={`/properties/${property.id}`} className="text-xs text-gray-400 hover:text-[#C9A84C]">
                          التفاصيل
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView properties={withLocation} apiKey={apiKey} />
        </div>
      </div>
    </div>
  )
}
