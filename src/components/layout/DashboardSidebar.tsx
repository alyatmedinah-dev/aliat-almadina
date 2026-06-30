'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Building2, Users, UserCheck, FileText,
  Home, BarChart2, Settings, LogOut, ChevronLeft,
  ChevronRight, BookOpen, Key, Warehouse, Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Logo from '@/components/shared/Logo'
import type { AuthUser } from '@/types'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  roles?: string[]
  badge?: number
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/dashboard/properties', label: 'العقارات', icon: Building2 },
  { href: '/dashboard/owners', label: 'الملاك', icon: UserCheck },
  { href: '/dashboard/clients', label: 'العملاء', icon: Users },
  { href: '/dashboard/contracts', label: 'العقود', icon: FileText },
  { href: '/dashboard/rentals', label: 'الإيجارات', icon: Key },
  { href: '/dashboard/reports', label: 'التقارير', icon: BarChart2 },
  { href: '/dashboard/blog', label: 'المدونة', icon: BookOpen, roles: ['SUPER_ADMIN', 'MANAGER', 'MARKETING'] },
  { href: '/dashboard/users', label: 'المستخدمون', icon: Users, roles: ['SUPER_ADMIN'] },
  { href: '/dashboard/settings', label: 'الإعدادات', icon: Settings, roles: ['SUPER_ADMIN', 'MANAGER'] },
]

interface DashboardSidebarProps {
  user: AuthUser
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const visibleItems = navItems.filter((item) =>
    !item.roles || item.roles.includes(user.role)
  )

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-l border-gray-100 flex flex-col h-screen sticky top-0 z-30 shadow-sm overflow-hidden"
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100 flex-shrink-0">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-w-0"
            >
              <Logo size="sm" />
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center mx-auto"
            >
              <Home className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'sidebar-item',
                isActive && 'active',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-[#C9A84C]' : 'text-gray-400')} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-gray-100 p-3 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-gray-50">
            <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-[#C9A84C]">
                {user.role === 'SUPER_ADMIN' ? 'مدير النظام' :
                  user.role === 'MANAGER' ? 'مدير' :
                  user.role === 'MARKETING' ? 'تسويق' :
                  user.role === 'RECEPTION' ? 'استقبال' : 'موظف'}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={cn(
            'sidebar-item w-full text-red-500 hover:bg-red-50 hover:text-red-600',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full mt-2 flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  )
}
