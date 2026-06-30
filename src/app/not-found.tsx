import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="text-[12rem] font-bold leading-none gold-text-gradient mb-4">٤٠٤</div>
        <h1 className="text-2xl font-bold text-white mb-3">الصفحة غير موجودة</h1>
        <p className="text-gray-400 mb-8">الصفحة التي تبحث عنها غير موجودة أو تم نقلها</p>
        <Link href="/" className="btn-gold inline-block">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  )
}
