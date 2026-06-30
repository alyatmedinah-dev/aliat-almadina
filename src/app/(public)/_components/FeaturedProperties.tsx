'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import PropertyCard from '@/components/properties/PropertyCard'
import type { Property } from '@/types'

interface FeaturedPropertiesProps {
  properties: (Property & { images?: { url: string; isMain: boolean }[] })[]
}

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  return (
    <section className="py-20 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-[#C9A84C] text-sm font-semibold mb-2 tracking-wider uppercase">
              العقارات المميزة
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              أبرز العقارات المتاحة
            </h2>
            <div className="section-divider right mt-4" />
          </div>
          <Link
            href="/properties"
            className="hidden md:flex items-center gap-2 text-[#C9A84C] hover:text-[#A8893C] font-semibold text-sm transition-colors"
          >
            <span>عرض جميع العقارات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🏠</span>
            </div>
            <p className="text-gray-400 text-lg">لا توجد عقارات مميزة حالياً</p>
            <Link href="/properties" className="btn-gold mt-4 inline-block">
              تصفح جميع العقارات
            </Link>
          </div>
        )}

        {/* Mobile CTA */}
        <div className="md:hidden mt-8 text-center">
          <Link href="/properties" className="btn-gold inline-flex items-center gap-2">
            عرض جميع العقارات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
