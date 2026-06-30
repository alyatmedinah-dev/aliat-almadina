'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Plus, Search, Filter, Edit2, Trash2, Eye, MapPin,
  Building2, ChevronLeft, ChevronRight, MoreVertical
} from 'lucide-react'
import { formatPrice, formatArea, formatDate } from '@/lib/utils'
import { PROPERTY_TYPE_LABELS, PROPERTY_PURPOSE_LABELS, PROPERTY_STATUS_LABELS } from '@/types'
import toast from 'react-hot-toast'

const PURPOSE_COLORS: Record<string, string> = {
  SALE: 'bg-emerald-100 text-emerald-700',
  RENT: 'bg-blue-100 text-blue-700',
}
const STATUS_COLORS: Record<string, string> = {
  READY: 'bg-green-100 text-green-700',
  UNDER_CONSTRUCTION: 'bg-yellow-100 text-yellow-700',
  RENTED: 'bg-blue-100 text-blue-700',
  SOLD: 'bg-gray-100 text-gray-600',
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [purpose, setPurpose] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' })
      if (search) params.set('query', search)
      if (type) params.set('type', type)
      if (purpose) params.set('purpose', purpose)

      const res = await fetch(`/api/properties?${params}`)
      const data = await res.json()
      if (data.success) {
        setProperties(data.data)
        setTotal(data.pagination.total)
        setTotalPages(data.pagination.totalPages)
      }
    } catch {
      toast.error('فشل تحميل العقارات')
    } finally {
      setLoading(false)
    }
  }, [page, search, type, purpose])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${title}"؟`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('تم حذف العقار')
        fetchProperties()
      } else {
        toast.error(data.error || 'فشل الحذف')
      }
    } catch {
      toast.error('فشل الحذف')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة العقارات</h1>
          <p className="text-gray-500 text-sm mt-1">{total} عقار مسجل</p>
        </div>
        <Link href="/dashboard/properties/add" className="btn-gold flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          إضافة عقار
        </Link>
      </div>

      {/* Filters */}
      <div className="dash-card">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="بحث بالعنوان أو الحي..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="input-luxury pr-10 py-2.5"
            />
          </div>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1) }}
            className="input-luxury w-40 py-2.5"
          >
            <option value="">كل الأنواع</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select
            value={purpose}
            onChange={(e) => { setPurpose(e.target.value); setPage(1) }}
            className="input-luxury w-36 py-2.5"
          >
            <option value="">بيع وإيجار</option>
            <option value="SALE">للبيع</option>
            <option value="RENT">للإيجار</option>
          </select>
          <button
            onClick={() => { setSearch(''); setType(''); setPurpose(''); setPage(1) }}
            className="btn-outline-gold text-sm py-2.5 px-4"
          >
            إعادة تعيين
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="dash-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">لا توجد عقارات</p>
            <Link href="/dashboard/properties/add" className="btn-gold mt-4 inline-block text-sm">
              إضافة أول عقار
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th className="w-16">الصورة</th>
                  <th>العقار</th>
                  <th>النوع</th>
                  <th>السعر</th>
                  <th>المساحة</th>
                  <th>الحالة</th>
                  <th>الغرض</th>
                  <th>التاريخ</th>
                  <th className="w-24">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property, i) => {
                  const mainImage = property.images?.[0]?.url
                  return (
                    <motion.tr
                      key={property.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <td>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          {mainImage ? (
                            <Image src={mainImage} alt={property.title} width={48} height={48} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">🏠</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{property.title}</p>
                          <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>{property.district || property.city}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-sm text-gray-700">{PROPERTY_TYPE_LABELS[property.type as keyof typeof PROPERTY_TYPE_LABELS]}</span>
                      </td>
                      <td>
                        <span className="font-bold text-[#C9A84C]">{formatPrice(property.price)}</span>
                        <span className="text-gray-400 text-xs mr-1">ر.س</span>
                      </td>
                      <td>
                        <span className="text-sm text-gray-600">{formatArea(property.area)}</span>
                      </td>
                      <td>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[property.status]}`}>
                          {PROPERTY_STATUS_LABELS[property.status as keyof typeof PROPERTY_STATUS_LABELS]}
                        </span>
                      </td>
                      <td>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PURPOSE_COLORS[property.purpose]}`}>
                          {PROPERTY_PURPOSE_LABELS[property.purpose as keyof typeof PROPERTY_PURPOSE_LABELS]}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs text-gray-400">{formatDate(property.createdAt)}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/properties/${property.id}`}
                            target="_blank"
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                            title="عرض"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/properties/${property.id}/edit`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                            title="تعديل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(property.id, property.title)}
                            disabled={deleting === property.id}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            title="حذف"
                          >
                            {deleting === property.id ? (
                              <div className="w-3.5 h-3.5 border border-red-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              عرض {((page - 1) * 15) + 1} - {Math.min(page * 15, total)} من {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-700 px-2">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
