'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Phone, Mail, MapPin, Building2, FileText, ArrowRight, MessageCircle, Loader2 } from 'lucide-react'
import { whatsappLink, formatPrice, formatDate, getInitials } from '@/lib/utils'
import { PROPERTY_TYPE_LABELS, PROPERTY_PURPOSE_LABELS, CONTRACT_STATUS_LABELS } from '@/types'

const DEAL_LABELS: Record<string, string> = { SALE: 'بيع', RENT: 'إيجار', BOTH: 'بيع وإيجار' }

export default function OwnerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [owner, setOwner] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/owners/${params.id}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setOwner(d.data); setLoading(false) })
  }, [params.id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
    </div>
  )

  if (!owner) return <div className="text-center py-20 text-gray-400">المالك غير موجود</div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-700">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">تفاصيل المالك</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="dash-card text-center">
          <div className="w-20 h-20 rounded-2xl gold-gradient flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {getInitials(owner.name)}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{owner.name}</h2>
          <span className="badge-gold text-xs">{DEAL_LABELS[owner.dealType]}</span>

          <div className="mt-5 space-y-3 text-sm text-right">
            {owner.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                <a href={`tel:${owner.phone}`} className="text-gray-700 hover:text-[#C9A84C]">{owner.phone}</a>
              </div>
            )}
            {owner.whatsapp && (
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <a href={whatsappLink(owner.whatsapp)} target="_blank" className="text-gray-700 hover:text-green-500">واتساب</a>
              </div>
            )}
            {owner.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                <a href={`mailto:${owner.email}`} className="text-gray-700">{owner.email}</a>
              </div>
            )}
            {owner.address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                <span className="text-gray-700">{owner.address}</span>
              </div>
            )}
            {owner.nationalId && (
              <div className="flex items-center gap-3">
                <span className="text-[#C9A84C] text-xs font-bold flex-shrink-0">هوية</span>
                <span className="text-gray-700">{owner.nationalId}</span>
              </div>
            )}
          </div>

          {owner.notes && (
            <div className="mt-5 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 text-right">
              {owner.notes}
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{owner._count?.properties || 0}</div>
              <div className="text-xs text-blue-500 mt-0.5">عقار</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-amber-600">{owner._count?.contracts || 0}</div>
              <div className="text-xs text-amber-500 mt-0.5">عقد</div>
            </div>
          </div>
        </div>

        {/* Properties & Contracts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Properties */}
          <div className="dash-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#C9A84C]" />
                العقارات ({owner.properties?.length || 0})
              </h3>
              <Link href={`/dashboard/properties/add`} className="text-xs text-[#C9A84C] hover:underline">+ إضافة عقار</Link>
            </div>
            {owner.properties?.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">لا توجد عقارات</p>
            ) : (
              <div className="space-y-3">
                {owner.properties?.map((property: any) => (
                  <div key={property.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{property.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {PROPERTY_TYPE_LABELS[property.type as keyof typeof PROPERTY_TYPE_LABELS]} •
                        {PROPERTY_PURPOSE_LABELS[property.purpose as keyof typeof PROPERTY_PURPOSE_LABELS]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#C9A84C] font-bold text-sm">{formatPrice(property.price)} ر.س</p>
                      <Link href={`/dashboard/properties/${property.id}/edit`} className="text-xs text-gray-400 hover:text-gray-700">تعديل</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contracts */}
          <div className="dash-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C9A84C]" />
                العقود ({owner.contracts?.length || 0})
              </h3>
            </div>
            {owner.contracts?.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">لا توجد عقود</p>
            ) : (
              <div className="space-y-3">
                {owner.contracts?.map((contract: any) => (
                  <div key={contract.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{contract.property?.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {contract.client?.name} • {formatDate(contract.startDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#C9A84C] font-bold text-sm">{formatPrice(contract.amount)} ر.س</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        contract.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        contract.status === 'EXPIRED' ? 'bg-gray-100 text-gray-600' :
                        'bg-red-100 text-red-600'}`}>
                        {CONTRACT_STATUS_LABELS[contract.status as keyof typeof CONTRACT_STATUS_LABELS]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
