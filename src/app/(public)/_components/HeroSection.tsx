'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, MapPin, Building2, ChevronDown } from 'lucide-react'

const propertyTypes = [
  { value: '', label: 'كل الأنواع' },
  { value: 'VILLA', label: 'فيلا' },
  { value: 'APARTMENT', label: 'شقة' },
  { value: 'LAND', label: 'أرض' },
  { value: 'BUILDING', label: 'عمارة' },
  { value: 'SHOP', label: 'محل تجاري' },
  { value: 'OFFICE', label: 'مكتب' },
  { value: 'WAREHOUSE', label: 'مستودع' },
]

const purposes = [
  { value: '', label: 'بيع أو إيجار' },
  { value: 'SALE', label: 'للبيع' },
  { value: 'RENT', label: 'للإيجار' },
]

export default function HeroSection() {
  const router = useRouter()
  const [type, setType] = useState('')
  const [purpose, setPurpose] = useState('')
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (purpose) params.set('purpose', purpose)
    if (query) params.set('query', query)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen hero-section flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #C9A84C 0px,
              #C9A84C 1px,
              transparent 1px,
              transparent 60px
            )`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-[#E8C97A] text-sm font-medium px-5 py-2.5 rounded-full mb-8"
        >
          <MapPin className="w-4 h-4" />
          <span>المدينة المنورة - حي الرانوناء</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          ابحث عن
          <span className="block gold-text-gradient">عقارك المثالي</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          منصة عقارية احترافية تجمع أفضل العقارات في المدينة المنورة.
          فلل، شقق، أراضي، عمائر ومحلات تجارية.
        </motion.p>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث بالحي أو نوع العقار..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-white text-gray-900 text-sm rounded-xl px-4 py-3.5 pr-11 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              />
            </div>

            {/* Type Select */}
            <div className="relative">
              <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full appearance-none bg-white text-gray-900 text-sm rounded-xl px-4 py-3.5 pr-11 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                {propertyTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Purpose + Search Button */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full appearance-none bg-white text-gray-900 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  {purposes.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSearch}
                className="btn-gold px-5 rounded-xl flex-shrink-0"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
            <span className="text-gray-400 text-xs pt-1">بحث سريع:</span>
            {[
              { label: 'فلل للبيع', type: 'VILLA', purpose: 'SALE' },
              { label: 'شقق للإيجار', type: 'APARTMENT', purpose: 'RENT' },
              { label: 'أراضي', type: 'LAND', purpose: 'SALE' },
              { label: 'محلات تجارية', type: 'SHOP', purpose: 'RENT' },
            ].map((f) => (
              <button
                key={f.label}
                onClick={() => router.push(`/search?type=${f.type}&purpose=${f.purpose}`)}
                className="text-xs text-gray-300 bg-white/10 hover:bg-[rgba(201,168,76,0.2)] hover:text-[#E8C97A] border border-white/10 hover:border-[rgba(201,168,76,0.3)] px-3 py-1.5 rounded-lg transition-all"
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-gray-500 text-xs">تمرير للأسفل</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 border-2 border-gray-600 rounded-full flex items-start justify-center pt-1"
          >
            <div className="w-1 h-2 bg-[#C9A84C] rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
