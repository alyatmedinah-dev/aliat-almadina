'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, BedDouble, Bath, Square, Eye, Phone, MessageCircle,
  Share2, Printer, ChevronLeft, ChevronRight, X, FileText, CheckCircle
} from 'lucide-react'
import { formatPriceFull, formatArea, formatDate, whatsappLink, PHONE_NUMBER } from '@/lib/utils'
import { PROPERTY_TYPE_LABELS, PROPERTY_PURPOSE_LABELS, PROPERTY_STATUS_LABELS } from '@/types'
import PropertyCard from '@/components/properties/PropertyCard'

interface Props {
  property: any
  similar: any[]
}

export default function PropertyDetailClient({ property, similar }: Props) {
  const [currentImg, setCurrentImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const images = property.images || []
  const mainImage = images[currentImg]

  const whatsappMsg = `أهلاً، أريد الاستفسار عن العقار: ${property.title}`
  const ownerWhatsapp = property.owner?.whatsapp || property.owner?.phone

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* Gallery */}
      <div className="bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden">
            {/* Main Image */}
            <div className="col-span-3 row-span-2 relative cursor-pointer" onClick={() => setLightbox(true)}>
              {images.length > 0 ? (
                <Image src={mainImage?.url || images[0]?.url} alt={property.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500 text-6xl">🏠</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 hover:opacity-100 font-medium text-sm bg-black/50 px-3 py-1.5 rounded-lg">
                  عرض الصور
                </span>
              </div>
              {images.length > 0 && (
                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                  {images.length} صور
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            {images.slice(1, 3).map((img: any, i: number) => (
              <div key={i} className="relative cursor-pointer overflow-hidden" onClick={() => { setCurrentImg(i + 1); setLightbox(true) }}>
                <Image src={img.url} alt="" fill className="object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title + Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${property.purpose === 'SALE' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {PROPERTY_PURPOSE_LABELS[property.purpose as keyof typeof PROPERTY_PURPOSE_LABELS]}
                </span>
                <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  {PROPERTY_TYPE_LABELS[property.type as keyof typeof PROPERTY_TYPE_LABELS]}
                </span>
                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                  {PROPERTY_STATUS_LABELS[property.status as keyof typeof PROPERTY_STATUS_LABELS]}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{property.title}</h1>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4 text-[#C9A84C]" />
                <span>{property.district && `${property.district}، `}{property.city}</span>
                {property.address && <span>• {property.address}</span>}
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Square, label: 'المساحة', value: formatArea(property.area) },
                ...(property.rooms ? [{ icon: BedDouble, label: 'الغرف', value: `${property.rooms} غرفة` }] : []),
                ...(property.bathrooms ? [{ icon: Bath, label: 'دورات المياه', value: String(property.bathrooms) }] : []),
                ...(property.facing ? [{ icon: MapPin, label: 'الواجهة', value: property.facing }] : []),
              ].map((spec) => {
                const Icon = spec.icon
                return (
                  <div key={spec.label} className="luxury-card p-4 text-center">
                    <Icon className="w-6 h-6 text-[#C9A84C] mx-auto mb-2" />
                    <div className="font-bold text-gray-900 text-lg">{spec.value}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{spec.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Description */}
            {property.description && (
              <div className="luxury-card p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-3">الوصف</h2>
                <p className="text-gray-600 leading-8 text-sm">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="luxury-card p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4">المرافق والمميزات</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((a: any) => (
                    <div key={a.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                      {a.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map Placeholder */}
            {property.lat && property.lng && (
              <div className="luxury-card overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">الموقع على الخريطة</h2>
                </div>
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}&q=${property.lat},${property.lng}&zoom=15`}
                  width="100%" height="300" style={{ border: 0 }} loading="lazy"
                  title="موقع العقار"
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Price Card */}
            <div className="luxury-card p-6 sticky top-24">
              <div className="mb-5">
                <p className="text-gray-400 text-sm mb-1">
                  {property.purpose === 'RENT' ? 'الإيجار السنوي' : 'سعر البيع'}
                </p>
                <p className="text-3xl font-bold gold-text-gradient">
                  {formatPriceFull(property.price)}
                </p>
              </div>

              <div className="space-y-3">
                <a href={`tel:${PHONE_NUMBER}`}
                  className="w-full btn-gold flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  اتصل الآن
                </a>
                <a
                  href={whatsappLink(ownerWhatsapp || PHONE_NUMBER, whatsappMsg)}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 px-5 rounded-xl font-semibold text-sm hover:bg-[#22c55e] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" fill="white" />
                  واتساب
                </a>
                <div className="flex gap-2">
                  <button onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center gap-1.5 btn-outline-gold text-sm py-2.5">
                    <Printer className="w-4 h-4" />
                    طباعة
                  </button>
                  <button onClick={() => navigator.share?.({ title: property.title, url: window.location.href })}
                    className="flex-1 flex items-center justify-center gap-1.5 btn-outline-gold text-sm py-2.5">
                    <Share2 className="w-4 h-4" />
                    مشاركة
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{property.views} مشاهدة</span>
                </div>
                <span>{formatDate(property.createdAt)}</span>
              </div>
            </div>

            {/* Owner Card */}
            {property.owner && (
              <div className="luxury-card p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">المالك</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-white font-bold text-sm">
                    {property.owner.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{property.owner.name}</p>
                    <a href={`tel:${property.owner.phone}`} className="text-gray-400 text-xs hover:text-[#C9A84C]">
                      {property.owner.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* PDFs */}
            {property.pdfs?.length > 0 && (
              <div className="luxury-card p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">المستندات</h3>
                <div className="space-y-2">
                  {property.pdfs.map((pdf: any) => (
                    <a key={pdf.id} href={pdf.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#C9A84C] transition-colors">
                      <FileText className="w-4 h-4 text-[#C9A84C]" />
                      {pdf.name || 'تحميل PDF'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">عقارات مشابهة</h2>
            <div className="section-divider right mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similar.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          >
            <button onClick={() => setLightbox(false)}
              className="absolute top-4 left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentImg((p) => (p - 1 + images.length) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="relative w-full max-w-4xl h-[70vh] px-16">
              <Image src={images[currentImg]?.url} alt="" fill className="object-contain" />
            </div>
            <button
              onClick={() => setCurrentImg((p) => (p + 1) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_: any, i: number) => (
                <button key={i} onClick={() => setCurrentImg(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? 'bg-[#C9A84C] w-5' : 'bg-white/40'}`} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
