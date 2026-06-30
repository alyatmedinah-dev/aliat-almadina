'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Phone, MessageCircle, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react'
import { getInitials, formatDate, whatsappLink } from '@/lib/utils'
import { CLIENT_STATUS_LABELS } from '@/types'
import toast from 'react-hot-toast'

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-50 text-blue-600 border-blue-100',
  CONTACTED: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  INTERESTED: 'bg-orange-50 text-orange-600 border-orange-100',
  NEGOTIATING: 'bg-purple-50 text-purple-600 border-purple-100',
  CLOSED: 'bg-green-50 text-green-600 border-green-100',
  LOST: 'bg-red-50 text-red-600 border-red-100',
}

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', phone: '', whatsapp: '', email: '', budget: '', requirements: '', source: '', status: 'NEW' })
  const [addLoading, setAddLoading] = useState(false)

  const fetchClients = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '15' })
    if (search) params.set('query', search)
    if (status) params.set('status', status)
    const res = await fetch(`/api/clients?${params}`)
    const data = await res.json()
    if (data.success) {
      setClients(data.data)
      setTotal(data.pagination.total)
      setTotalPages(data.pagination.totalPages)
    }
    setLoading(false)
  }, [page, search, status])

  useEffect(() => { fetchClients() }, [fetchClients])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddLoading(true)
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      toast.success('تم إضافة العميل')
      setShowAddModal(false)
      setAddForm({ name: '', phone: '', whatsapp: '', email: '', budget: '', requirements: '', source: '', status: 'NEW' })
      fetchClients()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setAddLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1>
          <p className="text-gray-500 text-sm mt-1">{total} عميل مسجل</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-gold flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          إضافة عميل
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Object.entries(CLIENT_STATUS_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setStatus(status === key ? '' : key); setPage(1) }}
            className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
              status === key ? STATUS_COLORS[key] + ' border' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="dash-card">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" placeholder="بحث بالاسم أو الجوال..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="input-luxury pr-10 py-2.5"
          />
        </div>
      </div>

      <div className="dash-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">لا يوجد عملاء</p>
          </div>
        ) : (
          <table className="luxury-table">
            <thead>
              <tr>
                <th>العميل</th>
                <th>التواصل</th>
                <th>الميزانية</th>
                <th>المصدر</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, i) => (
                <motion.tr key={client.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                        {getInitials(client.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{client.name}</p>
                        {client.email && <p className="text-gray-400 text-xs">{client.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <a href={`tel:${client.phone}`} className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      {client.whatsapp && (
                        <a href={whatsappLink(client.whatsapp)} target="_blank" className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <span className="text-sm text-gray-700">{client.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm text-gray-700">
                      {client.budget ? `${client.budget.toLocaleString('ar-SA')} ر.س` : '-'}
                    </span>
                  </td>
                  <td><span className="text-sm text-gray-500">{client.source || '-'}</span></td>
                  <td>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_COLORS[client.status]}`}>
                      {CLIENT_STATUS_LABELS[client.status as keyof typeof CLIENT_STATUS_LABELS]}
                    </span>
                  </td>
                  <td><span className="text-xs text-gray-400">{formatDate(client.createdAt)}</span></td>
                  <td>
                    <Link href={`/dashboard/clients/${client.id}`} className="text-xs text-[#C9A84C] hover:underline">
                      التفاصيل
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">إجمالي: {total}</p>
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

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900">إضافة عميل جديد</h3>
                <button onClick={() => setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم *</label>
                  <input value={addForm.name} onChange={(e) => setAddForm(p => ({ ...p, name: e.target.value }))} required className="input-luxury" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">الجوال *</label>
                    <input value={addForm.phone} onChange={(e) => setAddForm(p => ({ ...p, phone: e.target.value }))} required className="input-luxury" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">واتساب</label>
                    <input value={addForm.whatsapp} onChange={(e) => setAddForm(p => ({ ...p, whatsapp: e.target.value }))} className="input-luxury" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">الميزانية (ر.س)</label>
                  <input type="number" value={addForm.budget} onChange={(e) => setAddForm(p => ({ ...p, budget: e.target.value }))} className="input-luxury" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">متطلبات العميل</label>
                  <textarea value={addForm.requirements} onChange={(e) => setAddForm(p => ({ ...p, requirements: e.target.value }))} rows={3} className="input-luxury resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">المصدر</label>
                    <select value={addForm.source} onChange={(e) => setAddForm(p => ({ ...p, source: e.target.value }))} className="input-luxury">
                      <option value="">-- اختر --</option>
                      <option value="واتساب">واتساب</option>
                      <option value="اتصال">اتصال</option>
                      <option value="الموقع">الموقع الإلكتروني</option>
                      <option value="إحالة">إحالة</option>
                      <option value="سوشال ميديا">سوشال ميديا</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">الحالة</label>
                    <select value={addForm.status} onChange={(e) => setAddForm(p => ({ ...p, status: e.target.value }))} className="input-luxury">
                      {Object.entries(CLIENT_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={addLoading} className="btn-gold flex-1 flex items-center justify-center gap-2">
                    {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    إضافة العميل
                  </button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline-gold px-6">إلغاء</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
