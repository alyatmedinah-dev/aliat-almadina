'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, BedDouble, Bath, Square, Eye, Heart, Phone } from 'lucide-react'
import { formatPrice, formatArea, cn, PHONE_NUMBER, phoneLink } from '@/lib/utils'
import { PROPERTY_TYPE_LABELS, PROPERTY_PURPOSE_LABELS } from '@/types'
import type { Property } from '@/types'

interface PropertyCardProps {
  property: Property & {
    images?: { url: string; isMain: boolean }[]
  }
  index?: number
  variant?: 'default' | 'compact' | 'horizontal'
}

const PURPOSE_COLORS = {
  SALE: 'bg-emerald-500',
  RENT: 'bg-blue-500',
}

export default function PropertyCard({ property, index = 0, variant = 'default' }: PropertyCardProps) {
  const mainImage = property.images?.find((i) => i.isMain)?.url || property.images?.[0]?.url

  if (variant === 'horizontal') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="luxury-card flex overflow-hidden"
      >
        <div className="relative w-40 flex-shrink-0 overflow-hidden">
          {mainImage ? (
            <Image src={mainImage} alt={property.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Square className="w-8 h-8 text-gray-300" />
            </div>
          )}
        </div>
        <div className="p-4 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{property.title}</h3>
            <span className={cn('text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0', PURPOSE_COLORS[property.purpose])}>
              {PROPERTY_PURPOSE_LABELS[property.purpose]}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
            <MapPin className="w-3 h-3" />
            <span>{property.district}, {property.city}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#C9A84C]">{formatPrice(property.price)} ريال</span>
            <Link href={`/properties/${property.id}`} className="text-xs text-gray-500 hover:text-[#C9A84C] transition-colors">
              التفاصيل ←
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="luxury-card overflow-hidden group"
    >
      {/* Image */}
      <div className="property-image-container relative h-56 bg-gray-100">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Building className="w-16 h-16 text-gray-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className={cn('text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md', PURPOSE_COLORS[property.purpose])}>
            {PROPERTY_PURPOSE_LABELS[property.purpose]}
          </span>
          {property.featured && (
            <span className="gold-gradient text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              مميز ⭐
            </span>
          )}
        </div>

        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
            {PROPERTY_TYPE_LABELS[property.type]}
          </span>
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <a
              href={phoneLink(PHONE_NUMBER)}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:text-[#C9A84C] transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-1 group-hover:text-[#C9A84C] transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
          <MapPin className="w-3.5 h-3.5 text-[#C9A84C] flex-shrink-0" />
          <span className="truncate">{property.district ? `${property.district}، ` : ''}{property.city}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1.5">
            <Square className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>{formatArea(property.area)}</span>
          </div>
          {property.rooms && (
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>{property.rooms} غرف</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.views > 0 && (
            <div className="flex items-center gap-1.5 mr-auto text-gray-400 text-xs">
              <Eye className="w-3 h-3" />
              <span>{property.views}</span>
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">
              {property.purpose === 'RENT' ? 'الإيجار السنوي' : 'سعر البيع'}
            </p>
            <p className="font-bold text-xl text-[#C9A84C]">
              {formatPrice(property.price)}
              <span className="text-xs font-normal text-gray-500 mr-1">ريال</span>
            </p>
          </div>
          <Link
            href={`/properties/${property.id}`}
            className="btn-outline-gold text-sm py-2 px-4"
          >
            التفاصيل
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// Fix missing import
function Building({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}
