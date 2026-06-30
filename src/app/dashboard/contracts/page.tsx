'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, FileText, Search, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { CONTRACT_STATUS_LABELS } from '@/types'
import toast from 'react-hot-toast'

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700',
  EXPIRED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-50 text-red-600',
  PENDING: 'bg-yellow-50 text-yellow-700',
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [properties, setProperties] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [owners, setOwners] = useState<any[]>([])
  const [addLoading, setAddLoading] = useState(false)
  const [form, setForm] = useState({
    type: 'SALE', propertyId: '', clientId: '', ownerId: '',
    startDate: '', endDate: '', amount: '', notes: '',
  })

  const fetch_ = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '15' })
    if (status) params.set('status', status)
    const res = await fetch(`/api/contracts?${params}`)
    const data = await res.json()
    if (data.success) {
      setContracts(data.data)
      setTotal(data.pagination.total)
      setTotalPages(data.pagination.totalPages)
    }
    setLoading(false)
  }, [page, status])

  useEffect(() => { fetch_() }, [fetch_])

  const loadModalData = async () => {
    const [p, c, o] = await Promise.all([
      fetch('/api/properties?limit=100').then(r => r.json()),
      fetch('/api/clients?limit=100').then(r => r.json()),
      fetch('/api/owners?limit=100').then(r => r.json()),
    ])
    if (p.success) setProperties(p.data)
    if (c.success) setClients(c.data)
    if (o.success) setOwners(o.data)
  }

  const openModal = () => { loadModalData(); setShowModal(true) }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddLoading(true)
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      toast.success('تم إنشاء العقد بنجاح')
      setShowModal(false)
      fetch_()
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
          <h1 className="text-2xl font-bold text-gray-900">إدارة العقود</h1>
          <p className="text-gray-500 text-sm mt-1">{total} عقد</p>
        </div>
        <button onClick={openModal} className="btn-gold flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          عقد جديد
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[{ value: '', label: 'الكل' }, ...Object.entries(CONTRACT_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))].map((s) => (
          <button key={s.value} onClick={() => { setStatus(s.value); setPage(1) }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${status === s.value ? 'gold-gradient text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="dash-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">لا توجد عقود</p>
          </div>
        ) : (
          <table className="luxury-table">
            <thead>
              <tr>
                <th>رقم العقد</th>
                <th>العقار</th>
                <th>العميل</th>
                <th>المالك</th>
                <th>النوع</th>
                <th>المبلغ</th>
                <th>تاريخ الانتهاء</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract, i) => (
                <motion.tr key={contract.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td><span className="font-mono text-sm text-[#C9A84C]">{contract.contractNumber}</span></td>
                  <td><span className="text-sm font-medium text-gray-900">{contract.property?.title}</span></td>
                  <td><span className="text-sm text-gray-700">{contract.client?.name}</span></td>
                  <td><span className="text-sm text-gray-500">{contract.owner?.name || '-'}</span></td>
                  <td><span className="text-sm text-gray-700">{contract.type === 'SALE' ? 'بيع' : 'إيجار'}</span></td>
                  <td><span className="font-bold text-[#C9A84C] text-sm">{contract.amount.toLocaleString('ar-SA')} ر.س</span></td>
                  <td><span className="text-xs text-gray-500">{formatDate(contract.endDate)}</span></td>
                  <td>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[contract.status]}`}>
                      {CONTRACT_STATUS_LABELS[contract.status as keyof typeof CONTRACT_STATUS_LABELS]}
                    </span>
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
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-sm">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Contract Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900">إنشاء عقد جديد</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">نوع العقد *</label>
                    <select value={form.type} onChange={(e) => setForm(p => ({ ...p, type: e.target.value }))} className="input-luxury">
                      <option value="SALE">بيع</option>
                      <option value="RENT">إيجار</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">المبلغ (ر.س) *</label>
                    <input type="number" value={form.amount} onChange={(e) => setForm(p => ({ ...p, amount: e.target.value }))} required className="input-luxury" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">العقار *</label>
                  <select value={form.propertyId} onChange={(e) => setForm(p => ({ ...p, propertyId: e.target.value }))} required className="input-luxury">
                    <option value="">-- اختر العقار --</option>
                    {properties.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">العميل *</label>
                  <select value={form.clientId} onChange={(e) => setForm(p => ({ ...p, clientId: e.target.value }))} required className="input-luxury">
                    <option value="">-- اختر العميل --</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">المالك</label>
                  <select value={form.ownerId} onChange={(e) => setForm(p => ({ ...p, ownerId: e.target.value }))} className="input-luxury">
                    <option value="">-- اختر المالك --</option>
                    {owners.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">تاريخ البداية *</label>
                    <input type="date" value={form.startDate} onChange={(e) => setForm(p => ({ ...p, startDate: e.target.value }))} required className="input-luxury" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">تاريخ الانتهاء *</label>
                    <input type="date" value={form.endDate} onChange={(e) => setForm(p => ({ ...p, endDate: e.target.value }))} required className="input-luxury" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ملاحظات</label>
                  <textarea value={form.notes} onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} className="input-luxury resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={addLoading} className="btn-gold flex-1 flex items-center justify-center gap-2">
                    {addLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    إنشاء العقد
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-outline-gold px-6">إلغاء</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
