'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import Logo from '@/components/shared/Logo'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      toast.success(data.message || 'مرحباً بك!')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Left Panel - Dark */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Decorative */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-30" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-30" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: `repeating-linear-gradient(45deg, #C9A84C 0px, #C9A84C 1px, transparent 1px, transparent 50px)` }}
          />
          <div className="absolute w-64 h-64 rounded-full bg-[#C9A84C] opacity-5 -top-20 -right-20 blur-3xl" />
          <div className="absolute w-64 h-64 rounded-full bg-[#C9A84C] opacity-5 -bottom-20 -left-20 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center"
        >
          <Logo variant="light" size="lg" className="justify-center mb-10" />

          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            منصة إدارة عقارية
            <span className="block gold-text-gradient">احترافية ومتكاملة</span>
          </h2>
          <p className="text-gray-400 text-base max-w-sm mx-auto leading-8">
            نظام متكامل لإدارة العقارات، الملاك، العملاء، العقود والإيجارات في المدينة المنورة
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {[
              { num: '١٠٠٪', text: 'رضا العملاء' },
              { num: '+١٠', text: 'سنوات خبرة' },
              { num: 'آمن', text: 'وموثوق' },
              { num: '٢٤/٧', text: 'دعم فني' },
            ].map((item) => (
              <div key={item.text} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-xl font-bold gold-text-gradient">{item.num}</div>
                <div className="text-gray-400 text-xs mt-1">{item.text}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#FAFAFA]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Logo variant="dark" size="lg" className="justify-center" />
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">تسجيل الدخول</h1>
              <p className="text-gray-500 text-sm">أدخل بيانات حسابك للوصول إلى لوحة التحكم</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    required
                    className="input-luxury pr-11"
                    placeholder="admin@aliat-almadina.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    required
                    className="input-luxury pr-11 pl-11"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold flex items-center justify-center gap-2 py-3.5 text-base"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> جاري الدخول...</>
                ) : (
                  'دخول إلى لوحة التحكم'
                )}
              </button>
            </form>

            {/* Hint */}
            <div className="mt-6 p-4 bg-[rgba(201,168,76,0.06)] rounded-xl border border-[rgba(201,168,76,0.15)]">
              <p className="text-xs text-gray-500 text-center mb-2 font-medium">بيانات تجريبية للنظام</p>
              <div className="text-xs text-gray-400 text-center space-y-1">
                <p>البريد: <span className="text-[#C9A84C] font-medium select-all">admin@aliat-almadina.com</span></p>
                <p>الرمز: <span className="text-[#C9A84C] font-medium select-all">Admin@1234</span></p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
