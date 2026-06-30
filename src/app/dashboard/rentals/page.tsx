'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Key, Plus, Search, Loader2, X } from 'lucide-react'
import { formatDate, formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS_LABELS: Record<string, string> = { ACTIVE: 'نشط', EXPIRED: 'منتهي', CANCELLED: 'ملغي' }
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700',
  EXPIRED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-50 text-red-600',
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [properties, setProperties] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [addLoading, setAddLoading] = useState(false)
  const [form, setForm] = useState({
    propertyId: '', clientId: '', amount: '', paymentDay: '1',
    startDate: '', endDate: '', notes: '',
  })

  const fetchRentals = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/rentals?limit=50')
      const data = await res.json()
      if (data.success) setRentals(data.data)
    } catch {
      // إذا لم يكن API الإيجارات متاحاً بعد، نعرض قائمة فاضية بدون كسر الصفحة
      setRentals([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchRentals() }, [fetchRentals])

  const openModal = async () => {
    const [p, c] = await Promise.all([
      fetch('/api/properties?purpose=RENT&limit=100').then(r => r.json()),
      fetch('/api/clients?limit=100').then(r => r.json()),
    ])
    if (p.success) setProperties(p.data)
    if (c.success) setClients(c.data)
    setShowModal(true)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddLoading(true)
    try {
      const res = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      toast.success('تم إنشاء عقد الإيجار')
      setShowModal(false)
      fetchRentals()
    } catch (err: any) {
      toast.error(err.message || 'فشلت العملية')
    } finally {
      setAddLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الإيجارات</h1>
          <p className="text-gray-500 text-sm mt-1">{rentals.length} عقد إيجار</p>
        </div>
        <button onClick={openModal} className="btn-gold flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          إيجار جديد
        </button>
      </div>

      <div className="dash-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-20">
            <Key className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">لا توجد عقود إيجار حالياً</p>
            <button onClick={openModal} className="btn-gold mt-4 text-sm">إضافة أول إيجار</button>
          </div>
        ) : (
          <table className="luxury-table">
            <thead>
              <tr>
                <th>العقار</th>
                <th>المستأجر</th>
                <th>المبلغ</th>
                <th>يوم الدفع</th>
                <th>تاريخ الانتهاء</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental, i) => (
                <motion.tr key={rental.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td><span className="font-medium text-gray-900 text-sm">{rental.property?.title}</span></td>
                  <td><span className="text-sm text-gray-700">{rental.client?.name}</span></td>
                  <td><span className="font-bold text-[#C9A84C] text-sm">{formatPrice(rental.amount)} ر.س</span></td>
                  <td><span className="text-sm text-gray-500">يوم {rental.paymentDay}</span></td>
                  <td><span className="text-xs text-gray-500">{formatDate(rental.endDate)}</span></td>
                  <td>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[rental.status]}`}>
                      {STATUS_LABELS[rental.status]}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">عقد إيجار جديد</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">العقار *</label>
                <select value={form.propertyId} onChange={(e) => setForm(p => ({ ...p, propertyId: e.target.value }))} required className="input-luxury">
                  <option value="">-- اختر العقار --</option>
                  {properties.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">المستأجر *</label>
                <select value={form.clientId} onChange={(e) => setForm(p => ({ ...p, clientId: e.target.value }))} required className="input-luxury">
                  <option value="">-- اختر العميل --</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">المبلغ السنوي *</label>
                  <input type="number" value={form.amount} onChange={(e) => setForm(p => ({ ...p, amount: e.target.value }))} required className="input-luxury" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">يوم الدفع الشهري</label>
                  <input type="number" min="1" max="28" value={form.paymentDay} onChange={(e) => setForm(p => ({ ...p, paymentDay: e.target.value }))} className="input-luxury" />
                </div>
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
                  حفظ العقد
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline-gold px-6">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
