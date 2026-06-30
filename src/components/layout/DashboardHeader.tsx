'use client'

import { Bell, Search, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { AuthUser } from '@/types'
import { USER_ROLE_LABELS } from '@/types'

interface DashboardHeaderProps {
  user: AuthUser
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Right: Search */}
      <div className="relative hidden md:block">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="بحث سريع..."
          className="bg-gray-50 border border-gray-200 rounded-xl pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(201,168,76,0.3)] focus:border-[#C9A84C] w-64 transition-all"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        />
      </div>

      {/* Left: Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#C9A84C] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>عرض الموقع</span>
        </Link>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
          <Bell className="w-4.5 h-4.5 text-gray-500" />
          <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-[#C9A84C] rounded-full" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
            <p className="text-xs text-gray-400">{USER_ROLE_LABELS[user.role]}</p>
          </div>
          <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center text-white text-sm font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  )
}
