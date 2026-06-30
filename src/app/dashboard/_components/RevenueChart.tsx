'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

interface RevenueChartProps {
  data: { month: string; amount: number }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-900 mb-1">{label}</p>
        <p className="text-[#C9A84C] font-medium">
          {payload[0].value.toLocaleString('ar-SA')} ريال
        </p>
      </div>
    )
  }
  return null
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="dash-card h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-base">الإيرادات الشهرية</h3>
          <p className="text-gray-400 text-sm mt-0.5">عرض للسنة الحالية</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#C9A84C]" />
          <span className="text-xs text-gray-500">الإيرادات</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontFamily: 'Cairo', fontSize: 11, fill: '#9A9A9A' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: 'Cairo', fontSize: 11, fill: '#9A9A9A' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}م` : v >= 1000 ? `${(v / 1000).toFixed(0)}ك` : v}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#C9A84C"
            strokeWidth={2.5}
            fill="url(#goldGradient)"
            dot={{ fill: '#C9A84C', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#C9A84C', strokeWidth: 2, stroke: 'white' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
