'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Upload, X, MapPin, Plus, Loader2, Building2,
  Image as ImageIcon, FileText, Video, CheckSquare, Square
} from 'lucide-react'
import toast from 'react-hot-toast'
import { PROPERTY_TYPE_LABELS, PROPERTY_PURPOSE_LABELS, PROPERTY_STATUS_LABELS, DISTRICTS, AMENITIES } from '@/types'

export default function AddPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [owners, setOwners] = useState<{ id: string; name: string }[]>([])
  const [images, setImages] = useState<{ url: string; publicId: string; isMain: boolean }[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: '', description: '', type: 'VILLA', purpose: 'SALE', status: 'READY',
    price: '', area: '', rooms: '', bathrooms: '', floor: '',
    facing: '', district: '', city: 'المدينة المنورة', address: '',
    lat: '24.4539', lng: '39.5942', featured: false, ownerId: '',
  })

  useEffect(() => {
    fetch('/api/owners?limit=100')
      .then((r) => r.json())
      .then((d) => { if (d.success) setOwners(d.data) })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleImageUpload = async (files: FileList) => {
    setUploading(true)
    for (const file of Array.from(files)) {
      try {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('type', 'image')
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.success) {
          setImages((prev) => [...prev, { ...data.data, isMain: prev.length === 0 }])
        }
      } catch {
        toast.error(`فشل رفع ${file.name}`)
      }
    }
    setUploading(false)
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    )
  }

  const setMainImage = (idx: number) => {
    setImages((prev) => prev.map((img, i) => ({ ...img, isMain: i === idx })))
  }

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx)
      if (next.length > 0 && !next.some((i) => i.isMain)) next[0].isMain = true
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.price || !form.area) {
      toast.error('يرجى تعبئة الحقول المطلوبة: العنوان، السعر، المساحة')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amenities: selectedAmenities }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      const propertyId = data.data.id
      // Upload images with propertyId
      for (const img of images) {
        // Images already uploaded to Cloudinary, now link to property
        await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId, url: img.url, publicId: img.publicId, isMain: img.isMain, type: 'link' }),
        }).catch(() => {})
      }

      toast.success('تم إضافة العقار بنجاح')
      router.push('/dashboard/properties')
    } catch (err: any) {
      toast.error(err.message || 'فشل إضافة العقار')
    } finally {
      setLoading(false)
    }
  }

  const facingOptions = ['شمالية', 'جنوبية', 'شرقية', 'غربية', 'شمالية شرقية', 'شمالية غربية', 'جنوبية شرقية', 'جنوبية غربية']

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-700 transition-colors">→</button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إضافة عقار جديد</h1>
          <p className="text-gray-500 text-sm mt-0.5">أضف عقاراً جديداً إلى المنصة</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="dash-card">
          <h2 className="font-bold text-gray-900 text-base mb-5 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#C9A84C]" />
            المعلومات الأساسية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">عنوان العقار <span className="text-red-500">*</span></label>
              <input name="title" value={form.title} onChange={handleChange} required
                className="input-luxury" placeholder="مثال: فيلا فاخرة في حي الرانوناء" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">نوع العقار <span className="text-red-500">*</span></label>
              <select name="type" value={form.type} onChange={handleChange} className="input-luxury">
                {Object.entries(PROPERTY_TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الغرض <span className="text-red-500">*</span></label>
              <select name="purpose" value={form.purpose} onChange={handleChange} className="input-luxury">
                {Object.entries(PROPERTY_PURPOSE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">حالة العقار</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-luxury">
                {Object.entries(PROPERTY_STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">المالك</label>
              <select name="ownerId" value={form.ownerId} onChange={handleChange} className="input-luxury">
                <option value="">-- اختر المالك --</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                className="input-luxury resize-none" placeholder="وصف تفصيلي للعقار..." />
            </div>
          </div>
        </div>

        {/* Pricing & Specs */}
        <div className="dash-card">
          <h2 className="font-bold text-gray-900 text-base mb-5 flex items-center gap-2">
            <span className="w-5 h-5 text-[#C9A84C] font-bold text-lg">ر</span>
            السعر والمواصفات
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">السعر (ريال) <span className="text-red-500">*</span></label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required
                className="input-luxury" placeholder="1500000" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">المساحة (م²) <span className="text-red-500">*</span></label>
              <input type="number" name="area" value={form.area} onChange={handleChange} required
                className="input-luxury" placeholder="350" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الغرف</label>
              <input type="number" name="rooms" value={form.rooms} onChange={handleChange}
                className="input-luxury" placeholder="4" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">دورات المياه</label>
              <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange}
                className="input-luxury" placeholder="3" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الدور</label>
              <input type="number" name="floor" value={form.floor} onChange={handleChange}
                className="input-luxury" placeholder="1" min="0" />
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

        {/* Location */}
        <div className="dash-card">
          <h2 className="font-bold text-gray-900 text-base mb-5 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#C9A84C]" />
            الموقع
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">المدينة</label>
              <input name="city" value={form.city} onChange={handleChange} className="input-luxury" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الحي</label>
              <select name="district" value={form.district} onChange={handleChange} className="input-luxury">
                <option value="">-- اختر الحي --</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان التفصيلي</label>
              <input name="address" value={form.address} onChange={handleChange}
                className="input-luxury" placeholder="شارع الملك فهد، قرب..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">خط العرض (Lat)</label>
              <input type="number" name="lat" value={form.lat} onChange={handleChange}
                className="input-luxury" step="any" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">خط الطول (Lng)</label>
              <input type="number" name="lng" value={form.lng} onChange={handleChange}
                className="input-luxury" step="any" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#C9A84C]"
                />
                <span className="text-sm font-medium text-gray-700">تمييز العقار في الرئيسية</span>
              </label>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="dash-card">
          <h2 className="font-bold text-gray-900 text-base mb-5">المرافق والمميزات</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((amenity) => {
              const selected = selectedAmenities.includes(amenity)
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    selected
                      ? 'bg-[rgba(201,168,76,0.1)] border-[#C9A84C] text-[#C9A84C]'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-[#C9A84C]'
                  }`}
                >
                  {selected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                  {amenity}
                </button>
              )
            })}
          </div>
        </div>

        {/* Images */}
        <div className="dash-card">
          <h2 className="font-bold text-gray-900 text-base mb-5 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#C9A84C]" />
            الصور
          </h2>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-[#C9A84C] rounded-xl p-8 text-center cursor-pointer transition-colors"
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-[#C9A84C]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">جاري الرفع...</span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">اضغط أو اسحب الصور هنا</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG - حتى 10 صور</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
          />

          {images.length > 0 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mt-4">
              {images.map((img, i) => (
                <div key={i} className={`relative rounded-xl overflow-hidden border-2 ${img.isMain ? 'border-[#C9A84C]' : 'border-transparent'} group`}>
                  <img src={img.url} alt="" className="w-full h-20 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button type="button" onClick={() => setMainImage(i)}
                      className="text-xs bg-[#C9A84C] text-white px-1.5 py-0.5 rounded">رئيسية</button>
                    <button type="button" onClick={() => removeImage(i)}
                      className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  {img.isMain && (
                    <div className="absolute top-1 right-1 bg-[#C9A84C] text-white text-xs px-1.5 py-0.5 rounded">رئيسية</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pb-6">
          <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? 'جاري الإضافة...' : 'إضافة العقار'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline-gold">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  )
}
