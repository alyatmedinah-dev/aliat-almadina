import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'عالية المدينة للخدمات العقارية',
    template: '%s | عالية المدينة للخدمات العقارية',
  },
  description: 'منصة عقارية احترافية في المدينة المنورة - حي الرانوناء. فلل، شقق، أراضي، عمائر، محلات تجارية للبيع والإيجار.',
  keywords: ['عقارات', 'المدينة المنورة', 'فلل للبيع', 'شقق للإيجار', 'أراضي', 'عالية المدينة'],
  authors: [{ name: 'عالية المدينة للخدمات العقارية' }],
  creator: 'عالية المدينة للخدمات العقارية',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://aliat-almadina.com',
    title: 'عالية المدينة للخدمات العقارية',
    description: 'منصة عقارية احترافية في المدينة المنورة',
    siteName: 'عالية المدينة',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'عالية المدينة للخدمات العقارية',
    description: 'منصة عقارية احترافية في المدينة المنورة',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#C9A84C" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-arabic antialiased">
        {children}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'Cairo, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              direction: 'rtl',
              borderRadius: '10px',
              padding: '14px 20px',
            },
            success: {
              style: {
                background: '#0A0A0A',
                color: '#E8C97A',
                border: '1px solid rgba(201, 168, 76, 0.3)',
              },
              iconTheme: { primary: '#C9A84C', secondary: '#0A0A0A' },
            },
            error: {
              style: {
                background: '#1A0A0A',
                color: '#F87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
