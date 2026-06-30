'use client'

import { motion } from 'framer-motion'
import { Home, Search, FileText, Map, TrendingUp, Phone } from 'lucide-react'

const services = [
  {
    icon: Home,
    title: 'بيع العقارات',
    description: 'نساعدك في بيع عقارك بأفضل سعر وأسرع وقت مع ضمان سلامة الإجراءات القانونية.',
  },
  {
    icon: Search,
    title: 'تأجير العقارات',
    description: 'خدمة إيجار متكاملة للمالك والمستأجر مع متابعة دورية وإدارة احترافية.',
  },
  {
    icon: FileText,
    title: 'إدارة العقود',
    description: 'صياغة وإدارة جميع عقود البيع والإيجار بشكل رسمي ومعتمد.',
  },
  {
    icon: Map,
    title: 'تقييم العقارات',
    description: 'تقييم احترافي لعقارك بناءً على معطيات السوق الحالية في المدينة المنورة.',
  },
  {
    icon: TrendingUp,
    title: 'الاستشارات العقارية',
    description: 'استشارات متخصصة للمستثمرين والأفراد في قرارات الشراء والاستثمار العقاري.',
  },
  {
    icon: Phone,
    title: 'خدمة عملاء 24/7',
    description: 'فريق متاح على مدار الساعة للرد على استفساراتك ومتابعة طلباتك.',
  },
]

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#C9A84C] text-sm font-semibold mb-2 tracking-wider uppercase">
            خدماتنا
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ما نقدمه لك
          </h2>
          <div className="section-divider" />
          <p className="text-gray-500 max-w-xl mx-auto mt-4">
            نوفر باقة متكاملة من الخدمات العقارية الاحترافية لتلبية جميع احتياجاتك
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group p-7 rounded-2xl border border-gray-100 hover:border-[rgba(201,168,76,0.3)] hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[rgba(201,168,76,0.1)] group-hover:gold-gradient flex items-center justify-center mb-5 transition-all duration-300">
                  <Icon className="w-7 h-7 text-[#C9A84C] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-7">{service.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
