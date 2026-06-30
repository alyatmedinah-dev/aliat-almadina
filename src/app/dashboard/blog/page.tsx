'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Plus, Loader2, X, Eye, EyeOff } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function BlogDashboardPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', imageUrl: '', published: false })

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/blog')
    const data = await res.json()
    if (data.success) setPosts(data.data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddLoading(true)
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      toast.success('تم نشر المقال')
      setShowModal(false)
      setForm({ title: '', excerpt: '', content: '', imageUrl: '', published: false })
      fetchPosts()
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
          <h1 className="text-2xl font-bold text-gray-900">إدارة المدونة العقارية</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} مقال</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-gold flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          مقال جديد
        </button>
      </div>

      <div className="dash-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">لا توجد مقالات بعد</p>
            <button onClick={() => setShowModal(true)} className="btn-gold mt-4 text-sm">كتابة أول مقال</button>
          </div>
        ) : (
          <table className="luxury-table">
            <thead>
              <tr>
                <th>العنوان</th>
                <th>الكاتب</th>
                <th>الحالة</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <motion.tr key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td><span className="font-medium text-gray-900 text-sm">{post.title}</span></td>
                  <td><span className="text-sm text-gray-500">{post.author?.name}</span></td>
                  <td>
                    <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${post.published ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {post.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {post.published ? 'منشور' : 'مسودة'}
                    </span>
                  </td>
                  <td><span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900">مقال جديد</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان *</label>
                  <input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} required className="input-luxury" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">مقتطف مختصر</label>
                  <input value={form.excerpt} onChange={(e) => setForm(p => ({ ...p, excerpt: e.target.value }))} className="input-luxury" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">رابط الصورة</label>
                  <input value={form.imageUrl} onChange={(e) => setForm(p => ({ ...p, imageUrl: e.target.value }))} className="input-luxury" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">المحتوى *</label>
                  <textarea value={form.content} onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))} required rows={6} className="input-luxury resize-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4 accent-[#C9A84C]" />
                  <span className="text-sm font-medium text-gray-700">نشر المقال فوراً</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={addLoading} className="btn-gold flex-1 flex items-center justify-center gap-2">
                    {addLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    حفظ المقال
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
