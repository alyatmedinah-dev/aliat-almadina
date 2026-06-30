'use client'

import Link from 'next/link'
import { Plus, UserPlus, FileText, Building2 } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function QuickActions() {
  const [open, setOpen] = useState(false)

  const actions = [
    { href: '/dashboard/properties/add', label: 'إضافة عقار', icon: Building2, color: 'bg-blue-500' },
    { href: '/dashboard/owners/add', label: 'إضافة مالك', icon: UserPlus, color: 'bg-purple-500' },
    { href: '/dashboard/clients', label: 'إضافة عميل', icon: UserPlus, color: 'bg-emerald-500' },
    { href: '/dashboard/contracts', label: 'عقد جديد', icon: FileText, color: 'bg-orange-500' },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-gold flex items-center gap-2 text-sm"
      >
        <Plus className="w-4 h-4" />
        إجراء سريع
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20"
            >
              {actions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                  >
                    <div className={`w-7 h-7 ${action.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    {action.label}
                  </Link>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
