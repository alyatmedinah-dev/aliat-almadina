'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { Phone, MessageCircle, MapPin, Loader2 } from 'lucide-react'
import { formatPrice, whatsappLink, PHONE_NUMBER } from '@/lib/utils'
import { PROPERTY_TYPE_LABELS, PROPERTY_PURPOSE_LABELS } from '@/types'

// مركز الخريطة الافتراضي: حي الرانوناء، المدينة المنورة
const DEFAULT_CENTER = { lat: 24.4539, lng: 39.5942 }
const DEFAULT_ZOOM = 14

interface MapProperty {
  id: string
  title: string
  price: number
  type: string
  purpose: string
  lat: number | null
  lng: number | null
  district?: string | null
  images?: { url: string }[]
}

interface MapViewProps {
  properties: MapProperty[]
  apiKey: string
}

declare global {
  interface Window {
    google: any
    initGoogleMaps?: () => void
  }
}

export default function MapView({ properties, apiKey }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const infoWindowRef = useRef<any>(null)
  const [loaded, setLoaded] = useState(false)
  const [scriptError, setScriptError] = useState(false)

  // تحميل سكربت Google Maps مرة واحدة فقط
  useEffect(() => {
    if (window.google?.maps) {
      setLoaded(true)
      return
    }

    if (!apiKey) {
      setScriptError(true)
      return
    }

    const existingScript = document.getElementById('google-maps-script')
    if (existingScript) {
      existingScript.addEventListener('load', () => setLoaded(true))
      return
    }

    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,visualization`
    script.async = true
    script.defer = true
    script.onload = () => setLoaded(true)
    script.onerror = () => setScriptError(true)
    document.head.appendChild(script)
  }, [apiKey])

  // تهيئة الخريطة بعد تحميل السكربت
  useEffect(() => {
    if (!loaded || !mapRef.current || mapInstanceRef.current) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#1A1A1A' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1A1A1A' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#9A9A9A' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2A2A2A' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0A0A0A' }] },
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    })

    mapInstanceRef.current = map
    infoWindowRef.current = new window.google.maps.InfoWindow()
  }, [loaded])

  // تحديث الـ Markers عند تغيّر قائمة العقارات (الفلاتر)
  const renderMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return

    // مسح الماركرز القديمة
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    const validProperties = properties.filter((p) => p.lat && p.lng)
    if (validProperties.length === 0) return

    const bounds = new window.google.maps.LatLngBounds()

    validProperties.forEach((property) => {
      const position = { lat: property.lat as number, lng: property.lng as number }
      bounds.extend(position)

      const isRent = property.purpose === 'RENT'
      const marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: property.title,
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: isRent ? '#3B82F6' : '#10B981',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: 10,
        },
      })

      marker.addListener('click', () => {
        const img = property.images?.[0]?.url
        const content = `
          <div style="font-family: Cairo, sans-serif; direction: rtl; min-width: 220px; padding: 4px;">
            ${img ? `<img src="${img}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />` : ''}
            <div style="font-weight:700;font-size:14px;color:#111;margin-bottom:4px;">${property.title}</div>
            <div style="font-size:12px;color:#888;margin-bottom:6px;">${property.district || ''}</div>
            <div style="font-weight:700;color:#C9A84C;font-size:15px;margin-bottom:8px;">${formatPrice(property.price)} ريال</div>
            <a href="/properties/${property.id}" style="display:inline-block;background:#C9A84C;color:white;padding:6px 14px;border-radius:6px;font-size:12px;text-decoration:none;font-weight:600;">عرض التفاصيل</a>
          </div>
        `
        infoWindowRef.current.setContent(content)
        infoWindowRef.current.open(mapInstanceRef.current, marker)
      })

      markersRef.current.push(marker)
    })

    if (validProperties.length === 1) {
      mapInstanceRef.current.setCenter(bounds.getCenter())
      mapInstanceRef.current.setZoom(15)
    } else if (validProperties.length > 1) {
      mapInstanceRef.current.fitBounds(bounds, 60)
    }
  }, [properties])

  useEffect(() => {
    renderMarkers()
  }, [renderMarkers, loaded])

  if (scriptError) {
    return (
      <div className="w-full h-full min-h-[500px] bg-[#111] flex flex-col items-center justify-center text-center p-8 rounded-2xl">
        <MapPin className="w-10 h-10 text-gray-500 mb-3" />
        <p className="text-gray-300 font-medium mb-1">تعذّر تحميل الخريطة</p>
        <p className="text-gray-500 text-sm">يرجى التأكد من ضبط مفتاح Google Maps API بشكل صحيح في متغيرات البيئة (NEXT_PUBLIC_GOOGLE_MAPS_KEY)</p>
      </div>
    )
  }

  if (!loaded) {
    return (
      <div className="w-full h-full min-h-[500px] bg-[#111] flex items-center justify-center rounded-2xl">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-full min-h-[500px] rounded-2xl" />
}
