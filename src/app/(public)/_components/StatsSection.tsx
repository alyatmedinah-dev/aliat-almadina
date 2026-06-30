'use client'

import { useEffect, useRef, useState } from 'react'
import { Building2, Users, UserCheck, FileText } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

interface StatsSectionProps {
  totalProperties: number
  totalClients: number
  totalOwners: number
  totalContracts: number
}

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {count.toLocaleString('ar-SA')}{suffix}
    </span>
  )
}

const stats = (props: StatsSectionProps) => [
  {
    icon: Building2,
    value: props.totalProperties,
    suffix: '+',
    label: 'عقار متاح',
    description: 'في المدينة المنورة',
  },
  {
    icon: Users,
    value: props.totalClients,
    suffix: '+',
    label: 'عميل راضٍ',
    description: 'ثقوا بخدماتنا',
  },
  {
    icon: UserCheck,
    value: props.totalOwners,
    suffix: '+',
    label: 'مالك عقار',
    description: 'يثقون بنا',
  },
  {
    icon: FileText,
    value: props.totalContracts,
    suffix: '+',
    label: 'عقد منجز',
    description: 'بيع وإيجار',
  },
]

export default function StatsSection(props: StatsSectionProps) {
  const items = stats(props)

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center p-6 rounded-2xl border border-gray-100 hover:border-[rgba(201,168,76,0.3)] hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div
                  className="text-4xl font-bold mb-1 gold-text-gradient"
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-900 font-semibold text-base mb-1">{stat.label}</div>
                <div className="text-gray-400 text-xs">{stat.description}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
