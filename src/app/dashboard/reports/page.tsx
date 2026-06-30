'use client'

import { useState, useEffect } from 'react'
import { BarChart2, TrendingUp, Building2, Users, FileText, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقارير والإحصائيات</h1>
          <p className="text-gray-500 text-sm mt-1">تحليل شامل لأداء المنصة</p>
        </div>
        <button className="btn-outline-gold flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" />
          تصدير PDF
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Building2, label: 'إجمالي العقارات', value: stats?.totalProperties || 0, color: 'bg-blue-500' },
          { icon: Users, label: 'إجمالي العملاء', value: stats?.totalClients || 0, color: 'bg-emerald-500' },
          { icon: FileText, label: 'إجمالي العقود', value: stats?.totalContracts || 0, color: 'bg-orange-500' },
          { icon: TrendingUp, label: 'الإيرادات (ر.س)', value: stats?.totalRevenue?.toLocaleString('ar-SA') || 0, color: 'bg-[#C9A84C]' },
        ].map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="dash-card">
              <div className={`w-10 h-10 ${kpi.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
              <div className="text-sm text-gray-500">{kpi.label}</div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="dash-card">
          <h3 className="font-bold text-gray-900 mb-5">الإيرادات الشهرية</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.monthlyRevenue || []}>
              <defs>
                <linearGradient id="barGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A84C" />
                  <stop offset="100%" stopColor="#E8C97A" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontFamily: 'Cairo', fontSize: 10, fill: '#9A9A9A' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'Cairo', fontSize: 10, fill: '#9A9A9A' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}م` : v >= 1000 ? `${(v/1000).toFixed(0)}ك` : v} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString('ar-SA')} ر.س`, 'الإيراد']} />
              <Bar dataKey="amount" fill="url(#barGold)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Property Types */}
        <div className="dash-card">
          <h3 className="font-bold text-gray-900 mb-5">توزيع العقارات حسب النوع</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.propertyTypeDistribution || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" horizontal={false} />
              <XAxis type="number" tick={{ fontFamily: 'Cairo', fontSize: 10, fill: '#9A9A9A' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="type" tick={{ fontFamily: 'Cairo', fontSize: 11, fill: '#5A5A5A' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip formatter={(v: number) => [v, 'عدد العقارات']} />
              <Bar dataKey="count" fill="#C9A84C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="dash-card">
        <h3 className="font-bold text-gray-900 mb-5">ملخص عام</h3>
        <table className="luxury-table">
          <thead>
            <tr>
              <th>البيان</th>
              <th>القيمة</th>
              <th>التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-medium text-gray-900">العقارات للبيع</td>
              <td><span className="font-bold text-emerald-600">{stats?.propertiesForSale || 0}</span></td>
              <td><span className="text-gray-400 text-xs">من إجمالي {stats?.totalProperties || 0}</span></td>
            </tr>
            <tr>
              <td className="font-medium text-gray-900">العقارات للإيجار</td>
              <td><span className="font-bold text-blue-600">{stats?.propertiesForRent || 0}</span></td>
              <td><span className="text-gray-400 text-xs">من إجمالي {stats?.totalProperties || 0}</span></td>
            </tr>
            <tr>
              <td className="font-medium text-gray-900">الإيجارات النشطة</td>
              <td><span className="font-bold text-teal-600">{stats?.activeRentals || 0}</span></td>
              <td><span className="text-gray-400 text-xs">عقد إيجار فعّال</span></td>
            </tr>
            <tr>
              <td className="font-medium text-gray-900">الملاك المسجلون</td>
              <td><span className="font-bold text-purple-600">{stats?.totalOwners || 0}</span></td>
              <td><span className="text-gray-400 text-xs">مالك عقار</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
