import Link from 'next/link'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import Logo from '@/components/shared/Logo'
import { whatsappLink, WHATSAPP_NUMBER, PHONE_NUMBER, RENTAL_MANAGER_PHONE, RENTAL_MANAGER_WHATSAPP } from '@/lib/utils'

const quickLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/properties', label: 'العقارات' },
  { href: '/map', label: 'خريطة العقارات' },
  { href: '/search', label: 'البحث المتقدم' },
  { href: '/blog', label: 'المدونة العقارية' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'تواصل معنا' },
]

const propertyTypes = [
  { href: '/properties?type=VILLA&purpose=SALE', label: 'فلل للبيع' },
  { href: '/properties?type=VILLA&purpose=RENT', label: 'فلل للإيجار' },
  { href: '/properties?type=APARTMENT&purpose=SALE', label: 'شقق للبيع' },
  { href: '/properties?type=APARTMENT&purpose=RENT', label: 'شقق للإيجار' },
  { href: '/properties?type=LAND&purpose=SALE', label: 'أراضي للبيع' },
  { href: '/properties?type=BUILDING&purpose=SALE', label: 'عمائر للبيع' },
  { href: '/properties?type=SHOP&purpose=RENT', label: 'محلات للإيجار' },
  { href: '/properties?type=OFFICE&purpose=RENT', label: 'مكاتب للإيجار' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0A0A0A] text-white">
      {/* Contact Banner */}
      <div className="border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Contact */}
            <div className="flex items-center gap-4 p-5 rounded-xl border border-[#2A2A2A] hover:border-[rgba(201,168,76,0.3)] transition-colors">
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">الإدارة العامة</p>
                <a href={`tel:${PHONE_NUMBER}`} className="text-white font-semibold text-lg hover:text-[#E8C97A] transition-colors">
                  {PHONE_NUMBER}
                </a>
              </div>
            </div>

            {/* Rental Manager */}
            <div className="flex items-center gap-4 p-5 rounded-xl border border-[#2A2A2A] hover:border-[rgba(201,168,76,0.3)] transition-colors">
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">مسؤول الإيجارات - إبراهيم الظاهري</p>
                <a href={`tel:${RENTAL_MANAGER_PHONE}`} className="text-white font-semibold text-lg hover:text-[#E8C97A] transition-colors">
                  {RENTAL_MANAGER_PHONE}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center gap-4 p-5 rounded-xl border border-[#2A2A2A] hover:border-[rgba(201,168,76,0.3)] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">واتساب - تواصل مباشر</p>
                <a
                  href={whatsappLink(WHATSAPP_NUMBER, 'أهلاً، أريد الاستفسار عن عقار')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-semibold text-lg hover:text-[#25D366] transition-colors"
                >
                  {PHONE_NUMBER}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Logo variant="light" size="md" className="mb-6" />
            <p className="text-gray-400 text-sm leading-7 mb-6">
              منصة عقارية احترافية في قلب المدينة المنورة. نوفر أفضل الحلول العقارية من بيع وإيجار وإدارة للعقارات.
            </p>
            <div className="flex items-start gap-3 text-gray-400 text-sm">
              <MapPin className="w-4 h-4 text-[#C9A84C] mt-0.5 flex-shrink-0" />
              <span>المدينة المنورة - حي الرانوناء</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 gold-gradient rounded-full inline-block"></span>
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#E8C97A] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 gold-gradient rounded-full inline-block"></span>
              أنواع العقارات
            </h3>
            <ul className="space-y-3">
              {propertyTypes.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-400 text-sm hover:text-[#E8C97A] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 gold-gradient rounded-full inline-block"></span>
              تواصل معنا
            </h3>
            <div className="space-y-4">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center gap-3 text-gray-400 text-sm hover:text-[#E8C97A] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C9A84C]" />
                <span>{PHONE_NUMBER}</span>
              </a>
              <a
                href="mailto:info@aliat-almadina.com"
                className="flex items-center gap-3 text-gray-400 text-sm hover:text-[#E8C97A] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#C9A84C]" />
                <span>info@aliat-almadina.com</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-[#C9A84C] mt-0.5" />
                <span>المدينة المنورة - حي الرانوناء</span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={whatsappLink(WHATSAPP_NUMBER, 'أهلاً، أريد الاستفسار عن عقار')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#22c55e] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              تواصل واتساب
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center">
              جميع الحقوق محفوظة © {year} - عالية المدينة للخدمات العقارية
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">
                سياسة الخصوصية
              </Link>
              <Link href="/terms" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">
                الشروط والأحكام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
