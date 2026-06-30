'use client'

import { Suspense } from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import PropertyCard from '@/components/properties/PropertyCard'
import { PROPERTY_TYPE_LABELS, DISTRICTS } from '@/types'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    type: searchParams.get('type') || '',
    purpose: searchParams.get('purpose') || '',
    district: searchParams.get('district') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rooms: searchParams.get('rooms') || '',
    bathrooms: '',
    facing: '',
    status: '',
  })

  const search = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '24' })
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    const res = await fetch(`/api/properties?${params}`)
    const data = await res.json()
    if (data.success) { setProperties(data.data); setTotal(data.pagination.total) }
    setLoading(false)
  }, [filters])

  useEffect(() => { search() }, [search])

  const clearFilters = () => setFilters({ query: '', type: '', purpose: '', district: '', minPrice: '', maxPrice: '', rooms: '', bathrooms: '', facing: '', status: '' })

  const facingOptions = ['شمالية', 'جنوبية', 'شرقية', 'غربية', 'شمالية شرقية', 'شمالية غربية', 'جنوبية شرقية', 'جنوبية غربية']

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Search Hero */}
      <div className="bg-[#0A0A0A] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white text-center mb-8">البحث المتقدم</h1>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={filters.query} onChange={(e) => setFilters(p => ({ ...p, query: e.target.value }))}
                  placeholder="ابحث بالعنوان أو الحي..."
                  className="w-full bg-white text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                />
              </div>
              <select value={filters.purpose} onChange={(e) => setFilters(p => ({ ...p, purpose: e.target.value }))}
                className="bg-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] w-32">
                <option value="">الكل</option>
                <option value="SALE">للبيع</option>
                <option value="RENT">للإيجار</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <select value={filters.type} onChange={(e) => setFilters(p => ({ ...p, type: e.target.value }))}
                className="bg-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
                <option value="">نوع العقار</option>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <select value={filters.district} onChange={(e) => setFilters(p => ({ ...p, district: e.target.value }))}
                className="bg-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
                <option value="">الحي</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={filters.rooms} onChange={(e) => setFilters(p => ({ ...p, rooms: e.target.value }))}
                className="bg-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
                <option value="">عدد الغرف</option>
                {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n}+ غرف</option>)}
              </select>
              <select value={filters.facing} onChange={(e) => setFilters(p => ({ ...p, facing: e.target.value }))}
                className="bg-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
                <option value="">الواجهة</option>
                {facingOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <input type="number" value={filters.minPrice} onChange={(e) => setFilters(p => ({ ...p, minPrice: e.target.value }))}
                placeholder="السعر من" className="bg-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]" />
              <input type="number" value={filters.maxPrice} onChange={(e) => setFilters(p => ({ ...p, maxPrice: e.target.value }))}
                placeholder="السعر إلى" className="bg-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]" />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {loading ? 'جاري البحث...' : `${total} نتيجة`}
          </p>
          <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
            <X className="w-4 h-4" />
            مسح الفلاتر
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="luxury-card overflow-hidden">
                <div className="skeleton h-56" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">لا توجد نتائج مطابقة</p>
            <button onClick={clearFilters} className="btn-gold mt-4 text-sm">إعادة تعيين البحث</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" /></div>}>
      <SearchContent />
    </Suspense>
  )
}
