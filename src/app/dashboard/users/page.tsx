'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Loader2, X, Shield } from 'lucide-react'
import { getInitials, formatDate } from '@/lib/utils'
import { USER_ROLE_LABELS } from '@/types'
import toast from 'react-hot-toast'

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-50 text-purple-700',
  MANAGER: 'bg-blue-50 text-blue-700',
  EMPLOYEE: 'bg-gray-100 text-gray-600',
  MARKETING: 'bg-pink-50 text-pink-600',
  RECEPTION: 'bg-teal-50 text-teal-600',
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE', phone: '' })

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      if (data.success) setUsers(data.data)
      else toast.error(data.error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      toast.success('تم إضافة المستخدم بنجاح')
      setShowModal(false)
      setForm({ name: '', email: '', password: '', role: 'EMPLOYEE', phone: '' })
      fetchUsers()
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
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين والصلاحيات</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} مستخدم في النظام</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-gold flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          إضافة مستخدم
        </button>
      </div>

      <div className="dash-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="luxury-table">
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>البريد الإلكتروني</th>
                <th>الجوال</th>
                <th>الصلاحية</th>
                <th>الحالة</th>
                <th>تاريخ الإضافة</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(user.name)}
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td><span className="text-sm text-gray-600">{user.email}</span></td>
                  <td><span className="text-sm text-gray-500">{user.phone || '-'}</span></td>
                  <td>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${ROLE_COLORS[user.role]}`}>
                      <Shield className="w-3 h-3" />
                      {USER_ROLE_LABELS[user.role as keyof typeof USER_ROLE_LABELS]}
                    </span>
                  </td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {user.isActive ? 'نشط' : 'موقوف'}
                    </span>
                  </td>
                  <td><span className="text-xs text-gray-400">{formatDate(user.createdAt)}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">إضافة مستخدم جديد</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم الكامل *</label>
                <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required className="input-luxury" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني *</label>
                <input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} required className="input-luxury" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">كلمة المرور *</label>
                <input type="password" value={form.password} onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))} required minLength={8} className="input-luxury" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">الجوال</label>
                <input value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} className="input-luxury" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">الصلاحية</label>
                <select value={form.role} onChange={(e) => setForm(p => ({ ...p, role: e.target.value }))} className="input-luxury">
                  {Object.entries(USER_ROLE_LABELS).filter(([v]) => v !== 'SUPER_ADMIN').map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={addLoading} className="btn-gold flex-1 flex items-center justify-center gap-2">
                  {addLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  إضافة المستخدم
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
