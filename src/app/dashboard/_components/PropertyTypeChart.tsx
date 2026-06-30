'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface PropertyTypeChartProps {
  data: { type: string; count: number }[]
}

const COLORS = ['#C9A84C', '#E8C97A', '#A8893C', '#8B6914', '#D4A853', '#F0D99A', '#6B4F0A']

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-900">{payload[0].name}</p>
        <p className="text-[#C9A84C] font-medium">{payload[0].value} عقار</p>
      </div>
    )
  }
  return null
}

export default function PropertyTypeChart({ data }: PropertyTypeChartProps) {
  if (!data.length) {
    return (
      <div className="dash-card h-full flex items-center justify-center">
        <p className="text-gray-400 text-sm">لا توجد بيانات</p>
      </div>
    )
  }

  return (
    <div className="dash-card h-full">
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 text-base">توزيع العقارات</h3>
        <p className="text-gray-400 text-sm mt-0.5">حسب النوع</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="count"
            nameKey="type"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="space-y-2 mt-2">
        {data.map((item, i) => (
          <div key={item.type} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-gray-600">{item.type}</span>
            </div>
            <span className="font-semibold text-gray-900">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
