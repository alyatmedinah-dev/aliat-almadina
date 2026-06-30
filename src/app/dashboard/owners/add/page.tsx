'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AddOwnerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', whatsapp: '', email: '',
    nationalId: '', address: '', notes: '', dealType: 'BOTH',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      toast.success('تم إضافة المالك بنجاح')
      router.push('/dashboard/owners')
    } catch (err: any) {
      toast.error(err.message || 'فشل الإضافة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إضافة مالك جديد</h1>
          <p className="text-gray-500 text-sm mt-0.5">أضف مالك عقار جديد</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="dash-card">
          <h2 className="font-bold text-gray-900 text-base mb-5">البيانات الشخصية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم الكامل <span className="text-red-500">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} required className="input-luxury" placeholder="محمد عبدالله السلمي" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الجوال <span className="text-red-500">*</span></label>
              <input name="phone" value={form.phone} onChange={handleChange} required className="input-luxury" placeholder="05XXXXXXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">واتساب</label>
              <input name="whatsapp" value={form.whatsapp} onChange={handleChange} className="input-luxury" placeholder="05XXXXXXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-luxury" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الهوية</label>
              <input name="nationalId" value={form.nationalId} onChange={handleChange} className="input-luxury" placeholder="1XXXXXXXXX" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان</label>
              <input name="address" value={form.address} onChange={handleChange} className="input-luxury" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">نوع التعامل</label>
              <select name="dealType" value={form.dealType} onChange={handleChange} className="input-luxury">
                <option value="BOTH">بيع وإيجار</option>
                <option value="SALE">بيع فقط</option>
                <option value="RENT">إيجار فقط</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ملاحظات</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="input-luxury resize-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pb-6">
          <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? 'جاري الإضافة...' : 'إضافة المالك'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline-gold">إلغاء</button>
        </div>
      </form>
    </div>
  )
}
