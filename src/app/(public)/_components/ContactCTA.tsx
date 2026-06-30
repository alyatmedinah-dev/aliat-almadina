'use client'

import { motion } from 'framer-motion'
import { Phone, MessageCircle, MapPin } from 'lucide-react'
import { whatsappLink, WHATSAPP_NUMBER, PHONE_NUMBER, RENTAL_MANAGER_PHONE, RENTAL_MANAGER_WHATSAPP } from '@/lib/utils'

export default function ContactCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #111111 100%)',
          }}
        >
          {/* Gold overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(ellipse at 20% 50%, #C9A84C 0%, transparent 60%)`
            }}
          />

          <div className="relative z-10 p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              هل تبحث عن عقار؟
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              تواصل معنا الآن وسيقوم فريقنا المتخصص بمساعدتك في إيجاد العقار المناسب
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {/* Phone */}
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white px-6 py-4 rounded-2xl transition-all duration-200 hover:border-[rgba(201,168,76,0.4)]"
              >
                <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">اتصال مباشر</div>
                  <div className="font-semibold">{PHONE_NUMBER}</div>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappLink(WHATSAPP_NUMBER, 'أهلاً، أريد الاستفسار عن عقار')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 text-white px-6 py-4 rounded-2xl transition-all duration-200"
              >
                <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" fill="white" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">واتساب</div>
                  <div className="font-semibold">تواصل الآن</div>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center justify-center gap-3 bg-white/10 border border-white/10 text-white px-6 py-4 rounded-2xl">
                <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">موقعنا</div>
                  <div className="font-semibold text-sm">المدينة المنورة - الرانوناء</div>
                </div>
              </div>
            </div>

            {/* Rental Manager */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-gray-400 text-sm mb-3">للإيجارات تواصل مع مسؤول الإيجارات:</p>
              <a
                href={`tel:${RENTAL_MANAGER_PHONE}`}
                className="inline-flex items-center gap-2 text-[#E8C97A] font-semibold hover:text-[#C9A84C] transition-colors"
              >
                <Phone className="w-4 h-4" />
                إبراهيم الظاهري - {RENTAL_MANAGER_PHONE}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
