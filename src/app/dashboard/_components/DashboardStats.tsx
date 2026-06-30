'use client'

import { motion } from 'framer-motion'
import { Building2, Users, UserCheck, FileText, TrendingUp, Key, ShoppingBag, Home } from 'lucide-react'
import { formatPriceFull } from '@/lib/utils'

interface DashboardStatsProps {
  totalProperties: number
  totalClients: number
  totalOwners: number
  totalContracts: number
  totalRevenue: number
  activeRentals: number
  propertiesForSale: number
  propertiesForRent: number
}

export default function DashboardStats(props: DashboardStatsProps) {
  const stats = [
    {
      icon: Building2,
      label: 'إجمالي العقارات',
      value: props.totalProperties.toLocaleString('ar-SA'),
      sub: `${props.propertiesForSale} للبيع • ${props.propertiesForRent} للإيجار`,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      icon: Users,
      label: 'إجمالي العملاء',
      value: props.totalClients.toLocaleString('ar-SA'),
      sub: 'عملاء مسجلون',
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    {
      icon: UserCheck,
      label: 'الملاك',
      value: props.totalOwners.toLocaleString('ar-SA'),
      sub: 'مالك عقار مسجل',
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
    },
    {
      icon: FileText,
      label: 'العقود',
      value: props.totalContracts.toLocaleString('ar-SA'),
      sub: 'عقد منجز',
      color: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
    },
    {
      icon: TrendingUp,
      label: 'إجمالي الإيرادات',
      value: props.totalRevenue >= 1000000
        ? `${(props.totalRevenue / 1000000).toFixed(1)} م`
        : props.totalRevenue >= 1000
        ? `${(props.totalRevenue / 1000).toFixed(0)} ألف`
        : props.totalRevenue.toLocaleString('ar-SA'),
      sub: 'ريال سعودي',
      color: 'from-[#C9A84C] to-[#E8C97A]',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
    },
    {
      icon: Key,
      label: 'الإيجارات النشطة',
      value: props.activeRentals.toLocaleString('ar-SA'),
      sub: 'عقد إيجار نشط',
      color: 'from-teal-500 to-teal-600',
      bg: 'bg-teal-50',
      text: 'text-teal-600',
    },
    {
      icon: ShoppingBag,
      label: 'للبيع',
      value: props.propertiesForSale.toLocaleString('ar-SA'),
      sub: 'عقار متاح للبيع',
      color: 'from-pink-500 to-pink-600',
      bg: 'bg-pink-50',
      text: 'text-pink-600',
    },
    {
      icon: Home,
      label: 'للإيجار',
      value: props.propertiesForRent.toLocaleString('ar-SA'),
      sub: 'عقار للإيجار',
      color: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="stats-card"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm font-semibold text-gray-700 mb-0.5">{stat.label}</div>
            <div className="text-xs text-gray-400">{stat.sub}</div>
          </motion.div>
        )
      })}
    </div>
  )
}
