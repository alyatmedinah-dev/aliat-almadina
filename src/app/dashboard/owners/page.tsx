'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Search, Phone, Building2, ChevronLeft, ChevronRight, Edit2, Eye, Trash2 } from 'lucide-react'
import { getInitials, formatDate, whatsappLink } from '@/lib/utils'
import toast from 'react-hot-toast'

const DEAL_LABELS: Record<string, string> = { SALE: 'بيع', RENT: 'إيجار', BOTH: 'بيع وإيجار' }

export default function OwnersPage() {
  const [owners, setOwners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '15' })
    if (search) params.set('query', search)
    const res = await fetch(`/api/owners?${params}`)
    const data = await res.json()
    if (data.success) {
      setOwners(data.data)
      setTotal(data.pagination.total)
      setTotalPages(data.pagination.totalPages)
    }
    setLoading(false)
  }, [page, search])

  useEffect(() => { fetch_() }, [fetch_])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`حذف المالك "${name}"؟`)) return
    const res = await fetch(`/api/owners/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) { toast.success('تم الحذف'); fetch_() }
    else toast.error(data.error)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الملاك</h1>
          <p className="text-gray-500 text-sm mt-1">{total} مالك مسجل</p>
        </div>
        <Link href="/dashboard/owners/add" className="btn-gold flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          إضافة مالك
        </Link>
      </div>

      <div className="dash-card">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="بحث بالاسم أو الجوال أو الهوية..."
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="input-luxury pr-10 py-2.5"
            />
          </div>
        </div>
      </div>

      <div className="dash-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : owners.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">لا يوجد ملاك</p>
          </div>
        ) : (
          <table className="luxury-table">
            <thead>
              <tr>
                <th>المالك</th>
                <th>رقم الجوال</th>
                <th>رقم الهوية</th>
                <th>نوع التعامل</th>
                <th>العقارات</th>
                <th>العقود</th>
                <th>التاريخ</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner, i) => (
                <motion.tr key={owner.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {getInitials(owner.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{owner.name}</p>
                        {owner.email && <p className="text-gray-400 text-xs">{owner.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <a href={`tel:${owner.phone}`} className="text-sm text-gray-700 hover:text-[#C9A84C] transition-colors flex items-center gap-1">
                      <Phone className="w-3 h-3" />{owner.phone}
                    </a>
                  </td>
                  <td><span className="text-sm text-gray-600">{owner.nationalId || '-'}</span></td>
                  <td>
                    <span className="badge-gold text-xs">{DEAL_LABELS[owner.dealType]}</span>
                  </td>
                  <td>
                    <span className="font-semibold text-gray-900">{owner._count?.properties || 0}</span>
                  </td>
                  <td>
                    <span className="font-semibold text-gray-900">{owner._count?.contracts || 0}</span>
                  </td>
                  <td><span className="text-xs text-gray-400">{formatDate(owner.createdAt)}</span></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Link href={`/dashboard/owners/${owner.id}`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(owner.id, owner.name)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">إجمالي: {total} مالك</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
