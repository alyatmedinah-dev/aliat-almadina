'use client'

import { Suspense } from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Filter, Search, SlidersHorizontal, Grid, List, ChevronLeft, ChevronRight, X } from 'lucide-react'
import PropertyCard from '@/components/properties/PropertyCard'
import { PROPERTY_TYPE_LABELS, PROPERTY_PURPOSE_LABELS, DISTRICTS } from '@/types'

function PropertiesContent() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    type: searchParams.get('type') || '',
    purpose: searchParams.get('purpose') || '',
    district: searchParams.get('district') || '',
    minPrice: '',
    maxPrice: '',
    rooms: '',
  })

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '12' })
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    const res = await fetch(`/api/properties?${params}`)
    const data = await res.json()
    if (data.success) {
      setProperties(data.data)
      setTotal(data.pagination.total)
      setTotalPages(data.pagination.totalPages)
    }
    setLoading(false)
  }, [page, filters])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  const clearFilters = () => {
    setFilters({ query: '', type: '', purpose: '', district: '', minPrice: '', maxPrice: '', rooms: '' })
    setPage(1)
  }

  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div>
      {/* Page Header */}
      <div className="bg-[#0A0A0A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">جميع العقارات</h1>
          <p className="text-gray-400">اكتشف أفضل العقارات في المدينة المنورة</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search + Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="ابحث عن عقار..."
              value={filters.query}
              onChange={(e) => setFilters(p => ({ ...p, query: e.target.value }))}
              className="input-luxury pr-10"
            />
          </div>
          <select value={filters.type} onChange={(e) => setFilters(p => ({ ...p, type: e.target.value }))}
            className="input-luxury w-36">
            <option value="">كل الأنواع</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={filters.purpose} onChange={(e) => setFilters(p => ({ ...p, purpose: e.target.value }))}
            className="input-luxury w-32">
            <option value="">بيع وإيجار</option>
            <option value="SALE">للبيع</option>
            <option value="RENT">للإيجار</option>
          </select>
          <select value={filters.district} onChange={(e) => setFilters(p => ({ ...p, district: e.target.value }))}
            className="input-luxury w-36">
            <option value="">كل الأحياء</option>
            {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)}
            className="btn-outline-gold flex items-center gap-2 text-sm">
            <SlidersHorizontal className="w-4 h-4" />
            فلاتر متقدمة
          </button>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 px-3 py-2">
              <X className="w-4 h-4" />
              مسح
            </button>
          )}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <button onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#C9A84C] text-white' : 'text-gray-400 hover:text-gray-700'}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#C9A84C] text-white' : 'text-gray-400 hover:text-gray-700'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">السعر من (ر.س)</label>
              <input type="number" value={filters.minPrice} onChange={(e) => setFilters(p => ({ ...p, minPrice: e.target.value }))}
                className="input-luxury py-2" placeholder="100,000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">السعر إلى (ر.س)</label>
              <input type="number" value={filters.maxPrice} onChange={(e) => setFilters(p => ({ ...p, maxPrice: e.target.value }))}
                className="input-luxury py-2" placeholder="5,000,000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">عدد الغرف</label>
              <select value={filters.rooms} onChange={(e) => setFilters(p => ({ ...p, rooms: e.target.value }))}
                className="input-luxury py-2">
                <option value="">أي عدد</option>
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 text-sm">
            {total > 0 ? `${total} عقار متاح` : 'لا توجد نتائج'}
          </p>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="luxury-card overflow-hidden">
                <div className="skeleton h-56" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-gray-500 text-lg mb-2">لا توجد عقارات مطابقة</p>
            <p className="text-gray-400 text-sm">جرب تغيير معايير البحث</p>
            <button onClick={clearFilters} className="btn-gold mt-4 text-sm">مسح الفلاتر</button>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {properties.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} variant={viewMode === 'list' ? 'horizontal' : 'default'} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronRight className="w-5 h-5" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                  page === i + 1 ? 'gold-gradient text-white shadow-md' : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  )
}
