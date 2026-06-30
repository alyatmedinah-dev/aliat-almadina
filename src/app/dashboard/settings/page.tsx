'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    site_name: 'عالية المدينة للخدمات العقارية',
    site_phone: '0597773332',
    site_whatsapp: '966597773332',
    site_email: 'info@aliat-almadina.com',
    site_address: 'المدينة المنورة - حي الرانوناء',
    rental_manager_name: 'إبراهيم الظاهري',
    rental_manager_phone: '0548639461',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    youtube_url: '',
  })

  const handleSave = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('تم حفظ الإعدادات بنجاح')
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إعدادات الموقع</h1>
          <p className="text-gray-500 text-sm mt-1">إدارة معلومات وإعدادات المنصة</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="btn-gold flex items-center gap-2 text-sm">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ التغييرات
        </button>
      </div>

      {/* General Settings */}
      <div className="dash-card">
        <h2 className="font-bold text-gray-900 text-base mb-5 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#C9A84C]" />
          الإعدادات العامة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">اسم الموقع</label>
            <input value={settings.site_name} onChange={(e) => setSettings(p => ({ ...p, site_name: e.target.value }))} className="input-luxury" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الإدارة</label>
            <input value={settings.site_phone} onChange={(e) => setSettings(p => ({ ...p, site_phone: e.target.value }))} className="input-luxury" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">واتساب (مع رمز الدولة)</label>
            <input value={settings.site_whatsapp} onChange={(e) => setSettings(p => ({ ...p, site_whatsapp: e.target.value }))} className="input-luxury" placeholder="966XXXXXXXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني</label>
            <input type="email" value={settings.site_email} onChange={(e) => setSettings(p => ({ ...p, site_email: e.target.value }))} className="input-luxury" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان</label>
            <input value={settings.site_address} onChange={(e) => setSettings(p => ({ ...p, site_address: e.target.value }))} className="input-luxury" />
          </div>
        </div>
      </div>

      {/* Rental Manager */}
      <div className="dash-card">
        <h2 className="font-bold text-gray-900 text-base mb-5">مسؤول الإيجارات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم</label>
            <input value={settings.rental_manager_name} onChange={(e) => setSettings(p => ({ ...p, rental_manager_name: e.target.value }))} className="input-luxury" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الجوال</label>
            <input value={settings.rental_manager_phone} onChange={(e) => setSettings(p => ({ ...p, rental_manager_phone: e.target.value }))} className="input-luxury" />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="dash-card">
        <h2 className="font-bold text-gray-900 text-base mb-5">وسائل التواصل الاجتماعي</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'facebook_url', label: 'فيسبوك' },
            { key: 'twitter_url', label: 'تويتر / X' },
            { key: 'instagram_url', label: 'إنستغرام' },
            { key: 'youtube_url', label: 'يوتيوب' },
          ].map((s) => (
            <div key={s.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{s.label}</label>
              <input
                value={settings[s.key as keyof typeof settings]}
                onChange={(e) => setSettings(p => ({ ...p, [s.key]: e.target.value }))}
                className="input-luxury" placeholder="https://..." />
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="pb-6">
        <button onClick={handleSave} disabled={loading} className="btn-gold flex items-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? 'جاري الحفظ...' : 'حفظ جميع الإعدادات'}
        </button>
      </div>
    </div>
  )
}
