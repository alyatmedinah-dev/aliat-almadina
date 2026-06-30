import type { Metadata } from 'next'
import { Phone, MessageCircle, MapPin, Mail, Clock } from 'lucide-react'
import { whatsappLink, WHATSAPP_NUMBER, PHONE_NUMBER, RENTAL_MANAGER_PHONE, RENTAL_MANAGER_WHATSAPP } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'تواصل معنا',
  description: 'تواصل مع فريق عالية المدينة للخدمات العقارية في المدينة المنورة',
}

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-[#0A0A0A] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">تواصل معنا</h1>
          <p className="text-gray-400 text-lg">فريقنا متاح لمساعدتك في إيجاد العقار المناسب</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact Cards */}
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات التواصل</h2>

            {[
              {
                icon: Phone,
                title: 'الإدارة العامة',
                subtitle: 'للاستفسارات العامة',
                value: PHONE_NUMBER,
                href: `tel:${PHONE_NUMBER}`,
                iconBg: 'gold-gradient',
              },
              {
                icon: Phone,
                title: 'مسؤول الإيجارات',
                subtitle: 'إبراهيم الظاهري - للإيجارات',
                value: RENTAL_MANAGER_PHONE,
                href: `tel:${RENTAL_MANAGER_PHONE}`,
                iconBg: 'gold-gradient',
              },
              {
                icon: MessageCircle,
                title: 'واتساب',
                subtitle: 'تواصل مباشر وسريع',
                value: 'راسلنا الآن',
                href: whatsappLink(WHATSAPP_NUMBER, 'أهلاً، أريد الاستفسار'),
                iconBg: 'bg-[#25D366]',
              },
              {
                icon: Mail,
                title: 'البريد الإلكتروني',
                subtitle: 'للمراسلات الرسمية',
                value: 'info@aliat-almadina.com',
                href: 'mailto:info@aliat-almadina.com',
                iconBg: 'gold-gradient',
              },
              {
                icon: MapPin,
                title: 'موقعنا',
                subtitle: 'المدينة المنورة',
                value: 'حي الرانوناء',
                href: '#',
                iconBg: 'gold-gradient',
              },
              {
                icon: Clock,
                title: 'ساعات العمل',
                subtitle: 'أيام الأسبوع',
                value: '٨ ص - ١٠ م',
                href: '#',
                iconBg: 'gold-gradient',
              },
            ].map((card) => {
              const Icon = card.icon
              return (
                <a key={card.title} href={card.href}
                  className="flex items-center gap-4 p-5 luxury-card">
                  <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{card.title}</p>
                    <p className="text-gray-400 text-xs">{card.subtitle}</p>
                    <p className="text-[#C9A84C] font-medium text-sm mt-0.5">{card.value}</p>
                  </div>
                </a>
              )
            })}
          </div>

          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">أرسل لنا رسالة</h2>
            <div className="luxury-card p-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم</label>
                    <input className="input-luxury" placeholder="اسمك الكامل" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">الجوال</label>
                    <input className="input-luxury" placeholder="05XXXXXXXX" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني</label>
                  <input type="email" className="input-luxury" placeholder="example@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">موضوع التواصل</label>
                  <select className="input-luxury">
                    <option>استفسار عن عقار</option>
                    <option>طلب تقييم عقار</option>
                    <option>استشارة عقارية</option>
                    <option>أخرى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">الرسالة</label>
                  <textarea rows={5} className="input-luxury resize-none" placeholder="اكتب رسالتك هنا..." />
                </div>
                <a
                  href={whatsappLink(WHATSAPP_NUMBER, 'أهلاً، أريد التواصل معكم')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-gold flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  أرسل عبر واتساب
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 luxury-card overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">موقعنا على الخريطة</h3>
            <p className="text-gray-400 text-sm mt-0.5">المدينة المنورة - حي الرانوناء</p>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8744!2d39.5942!3d24.4539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDI3JzE0LjAiTiAzOcKwMzUnMzkuMSJF!5e0!3m2!1sar!2ssa!4v1"
            width="100%" height="400" style={{ border: 0 }} loading="lazy" allowFullScreen title="الموقع"
          />
        </div>
      </div>
    </div>
  )
}
