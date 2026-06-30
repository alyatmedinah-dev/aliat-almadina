'use client'

import { motion } from 'framer-motion'
import { Shield, Award, Clock, Star } from 'lucide-react'

const reasons = [
  {
    icon: Shield,
    title: 'ضمان الجودة',
    description: 'نضمن لك أعلى مستويات الجودة في جميع خدماتنا العقارية',
    stat: '100%',
    statLabel: 'رضا العملاء',
  },
  {
    icon: Award,
    title: 'خبرة متخصصة',
    description: 'فريق متخصص بخبرة واسعة في السوق العقاري بالمدينة المنورة',
    stat: '+10',
    statLabel: 'سنوات خبرة',
  },
  {
    icon: Clock,
    title: 'سرعة الإنجاز',
    description: 'نلتزم بأسرع وقت ممكن في إتمام صفقاتك العقارية',
    stat: '48h',
    statLabel: 'متوسط الإنجاز',
  },
  {
    icon: Star,
    title: 'تقييم مرتفع',
    description: 'نحتل مكانة مرموقة في ثقة العملاء والملاك على حد سواء',
    stat: '4.9',
    statLabel: 'تقييم العملاء',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #C9A84C 0%, transparent 60%), radial-gradient(circle at 80% 50%, #C9A84C 0%, transparent 60%)`
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#C9A84C] text-sm font-semibold mb-2 tracking-wider uppercase">
            لماذا نحن
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            لماذا تختار عالية المدينة؟
          </h2>
          <div className="section-divider" />
          <p className="text-gray-400 max-w-xl mx-auto mt-4">
            نمتلك الخبرة والتخصص في السوق العقاري بالمدينة المنورة مع الالتزام بأعلى معايير الجودة
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, i) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group text-center p-8 rounded-2xl border border-[#2A2A2A] hover:border-[rgba(201,168,76,0.4)] bg-[#111111] hover:bg-[#161616] transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-900/20">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="gold-text-gradient text-4xl font-bold mb-1">{reason.stat}</div>
                <div className="text-gray-500 text-xs mb-4">{reason.statLabel}</div>
                <h3 className="font-bold text-white text-lg mb-3">{reason.title}</h3>
                <p className="text-gray-400 text-sm leading-6">{reason.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
