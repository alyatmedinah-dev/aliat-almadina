'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Loader2, Save, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { PROPERTY_TYPE_LABELS, PROPERTY_PURPOSE_LABELS, PROPERTY_STATUS_LABELS, DISTRICTS, AMENITIES } from '@/types'

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [owners, setOwners] = useState<{ id: string; name: string }[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const [form, setForm] = useState({
    title: '', description: '', type: 'VILLA', purpose: 'SALE', status: 'READY',
    price: '', area: '', rooms: '', bathrooms: '', floor: '',
    facing: '', district: '', city: 'المدينة المنورة', address: '',
    lat: '', lng: '', featured: false, ownerId: '',
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/properties/${id}`).then((r) => r.json()),
      fetch('/api/owners?limit=100').then((r) => r.json()),
    ]).then(([propData, ownersData]) => {
      if (propData.success) {
        const p = propData.data
        setForm({
          title: p.title || '',
          description: p.description || '',
          type: p.type,
          purpose: p.purpose,
          status: p.status,
          price: String(p.price),
          area: String(p.area),
          rooms: p.rooms ? String(p.rooms) : '',
          bathrooms: p.bathrooms ? String(p.bathrooms) : '',
          floor: p.floor ? String(p.floor) : '',
          facing: p.facing || '',
          district: p.district || '',
          city: p.city || 'المدينة المنورة',
          address: p.address || '',
          lat: p.lat ? String(p.lat) : '',
          lng: p.lng ? String(p.lng) : '',
          featured: p.featured,
          ownerId: p.ownerId || '',
        })
        setSelectedAmenities(p.amenities?.map((a: any) => a.name) || [])
      }
      if (ownersData.success) setOwners(ownersData.data)
      setLoading(false)
    })
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amenities: selectedAmenities }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      toast.success('تم تحديث العقار بنجاح')
      router.push('/dashboard/properties')
    } catch (err: any) {
      toast.error(err.message || 'فشل التحديث')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
      </div>
    )
  }

  const facingOptions = ['شمالية', 'جنوبية', 'شرقية', 'غربية', 'شمالية شرقية', 'شمالية غربية', 'جنوبية شرقية', 'جنوبية غربية']

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تعديل العقار</h1>
          <p className="text-gray-500 text-sm mt-0.5">{form.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="dash-card">
          <h2 className="font-bold text-gray-900 text-base mb-5">المعلومات الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">عنوان العقار *</label>
              <input name="title" value={form.title} onChange={handleChange} required className="input-luxury" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">نوع العقار</label>
              <select name="type" value={form.type} onChange={handleChange} className="input-luxury">
                {Object.entries(PROPERTY_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الغرض</label>
              <select name="purpose" value={form.purpose} onChange={handleChange} className="input-luxury">
                {Object.entries(PROPERTY_PURPOSE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الحالة</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-luxury">
                {Object.entries(PROPERTY_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">المالك</label>
              <select name="ownerId" value={form.ownerId} onChange={handleChange} className="input-luxury">
                <option value="">-- اختر --</option>
                {owners.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-luxury resize-none" />
            </div>
          </div>
        </div>

        <div className="dash-card">
          <h2 className="font-bold text-gray-900 text-base mb-5">السعر والمواصفات</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">السعر (ريال) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required className="input-luxury" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">المساحة (م²) *</label>
              <input type="number" name="area" value={form.area} onChange={handleChange} required className="input-luxury" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الغرف</label>
              <input type="number" name="rooms" value={form.rooms} onChange={handleChange} className="input-luxury" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">دورات المياه</label>
              <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} className="input-luxury" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الدور</label>
              <input type="number" name="floor" value={form.floor} onChange={handleChange} className="input-luxury" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الواجهة</label>
              <select name="facing" value={form.facing} onChange={handleChange} className="input-luxury">
                <option value="">-- اختر --</option>
                {facingOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="dash-card">
          <h2 className="font-bold text-gray-900 text-base mb-5">الموقع</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">المدينة</label>
              <input name="city" value={form.city} onChange={handleChange} className="input-luxury" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الحي</label>
              <select name="district" value={form.district} onChange={handleChange} className="input-luxury">
                <option value="">-- اختر --</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان</label>
              <input name="address" value={form.address} onChange={handleChange} className="input-luxury" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">خط العرض</label>
              <input type="number" name="lat" value={form.lat} onChange={handleChange} className="input-luxury" step="any" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">خط الطول</label>
              <input type="number" name="lng" value={form.lng} onChange={handleChange} className="input-luxury" step="any" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-[#C9A84C]" />
                <span className="text-sm font-medium text-gray-700">مميز في الرئيسية</span>
              </label>
            </div>
          </div>
        </div>

        <div className="dash-card">
          <h2 className="font-bold text-gray-900 text-base mb-5">المرافق</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((amenity) => {
              const selected = selectedAmenities.includes(amenity)
              return (
                <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${selected ? 'bg-[rgba(201,168,76,0.1)] border-[#C9A84C] text-[#C9A84C]' : 'bg-white border-gray-200 text-gray-600 hover:border-[#C9A84C]'}`}>
                  {amenity}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 pb-6">
          <button type="submit" disabled={saving} className="btn-gold flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline-gold">إلغاء</button>
        </div>
      </form>
    </div>
  )
}
