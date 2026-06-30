'use client'

import Link from 'next/link'
import { Phone, ArrowLeft } from 'lucide-react'
import { getInitials, formatDate } from '@/lib/utils'
import { CLIENT_STATUS_LABELS } from '@/types'
import type { Client } from '@/types'

interface RecentClientsProps {
  clients: Client[]
}

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-50 text-blue-600',
  CONTACTED: 'bg-yellow-50 text-yellow-600',
  INTERESTED: 'bg-orange-50 text-orange-600',
  NEGOTIATING: 'bg-purple-50 text-purple-600',
  CLOSED: 'bg-green-50 text-green-600',
  LOST: 'bg-red-50 text-red-600',
}

export default function RecentClients({ clients }: RecentClientsProps) {
  return (
    <div className="dash-card">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900 text-base">أحدث العملاء</h3>
        <Link href="/dashboard/clients" className="text-xs text-[#C9A84C] hover:underline flex items-center gap-1">
          عرض الكل <ArrowLeft className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {clients.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">لا يوجد عملاء</p>
        ) : (
          clients.map((client) => (
            <Link
              key={client.id}
              href={`/dashboard/clients/${client.id}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-11 h-11 rounded-xl gold-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {getInitials(client.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-[#C9A84C] transition-colors">
                  {client.name}
                </p>
                <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                  <Phone className="w-3 h-3" />
                  <span>{client.phone}</span>
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[client.status] || 'bg-gray-50 text-gray-600'}`}>
                {CLIENT_STATUS_LABELS[client.status]}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
