import type { Metadata } from 'next'
import { Shield, Award, Users, Building2, CheckCircle, Phone } from 'lucide-react'
import { PHONE_NUMBER, whatsappLink, WHATSAPP_NUMBER } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'من نحن',
  description: 'تعرف على عالية المدينة للخدمات العقارية - منصة عقارية احترافية في المدينة المنورة',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-[#0A0A0A] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(ellipse at 30% 50%, #C9A84C, transparent 60%)` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            من نحن
          </h1>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-8">
            عالية المدينة للخدمات العقارية — منصة عقارية متكاملة تجمع أفضل العقارات في المدينة المنورة
            بأعلى معايير الجودة والاحترافية
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C9A84C] text-sm font-semibold mb-2 tracking-wider">قصتنا</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">رحلة بناء الثقة العقارية في المدينة المنورة</h2>
              <div className="section-divider right mb-6" />
              <p className="text-gray-600 leading-8 mb-4">
                نحن في عالية المدينة للخدمات العقارية نؤمن بأن امتلاك أو استئجار العقار المناسب ليس مجرد صفقة، بل هو قرار يؤثر على حياتك وعائلتك.
              </p>
              <p className="text-gray-600 leading-8 mb-6">
                انطلقنا من حي الرانوناء بالمدينة المنورة بخبرة متراكمة في السوق العقاري، وفريق متخصص يضم أفضل الكوادر في الاستشارات العقارية وإدارة العقارات.
              </p>
              <div className="space-y-3">
                {[
                  'خبرة واسعة في السوق العقاري بالمدينة المنورة',
                  'فريق محترف من المستشارين العقاريين المتخصصين',
                  'شفافية كاملة في جميع التعاملات والعقود',
                  'متابعة مستمرة ما بعد إتمام الصفقة',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#C9A84C] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Building2, num: '+١٠٠', label: 'عقار تم بيعه أو تأجيره' },
                { icon: Users, num: '+٢٠٠', label: 'عميل راضٍ' },
                { icon: Award, num: '+١٠', label: 'سنوات خبرة' },
                { icon: Shield, num: '١٠٠٪', label: 'معاملات موثوقة' },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="luxury-card p-6 text-center">
                    <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold gold-text-gradient mb-1">{stat.num}</div>
                    <div className="text-gray-500 text-xs">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">فريقنا</h2>
          <div className="section-divider mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {[
              { name: 'الإدارة العامة', role: 'مدير المنصة', phone: PHONE_NUMBER },
              { name: 'إبراهيم الظاهري', role: 'مسؤول الإيجارات', phone: '0548639461' },
            ].map((member) => (
              <div key={member.name} className="luxury-card p-8 text-center">
                <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
                <p className="text-[#C9A84C] text-sm mb-4">{member.role}</p>
                <a href={`tel:${member.phone}`}
                  className="flex items-center justify-center gap-2 text-gray-600 hover:text-[#C9A84C] transition-colors text-sm">
                  <Phone className="w-4 h-4" />
                  {member.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">ابدأ رحلتك العقارية معنا</h2>
          <p className="text-gray-400 mb-8">تواصل معنا اليوم ونحن سنساعدك في إيجاد ما تبحث عنه</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`tel:${PHONE_NUMBER}`} className="btn-gold flex items-center gap-2">
              <Phone className="w-4 h-4" />
              اتصل بنا
            </a>
            <a href={whatsappLink(WHATSAPP_NUMBER)} target="_blank"
              className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#22c55e] transition-colors">
              واتساب
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
