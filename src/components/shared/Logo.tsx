'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function Logo({
  variant = 'dark',
  size = 'md',
  showText = true,
  className,
}: LogoProps) {
  const sizes = {
    sm: { icon: 36, title: 'text-sm', subtitle: 'text-xs' },
    md: { icon: 44, title: 'text-base', subtitle: 'text-xs' },
    lg: { icon: 60, title: 'text-xl', subtitle: 'text-sm' },
  }

  const s = sizes[size]
  const isDark = variant === 'dark'

  return (
    <Link href="/" className={cn('flex items-center gap-3 group', className)}>
      {/* Emblem */}
      <div
        className="relative flex-shrink-0"
        style={{ width: s.icon, height: s.icon }}
      >
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer ring */}
          <circle cx="30" cy="30" r="29" stroke="url(#goldGrad)" strokeWidth="1.5" />

          {/* Building / Arch shape representing real estate */}
          <path
            d="M15 42V28L30 18L45 28V42H15Z"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Door */}
          <path
            d="M25 42V34C25 32.3431 26.3431 31 28 31H32C33.6569 31 35 32.3431 35 34V42"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="1.5"
          />

          {/* Windows */}
          <rect x="19" y="30" width="5" height="5" rx="1" fill="url(#goldGrad)" opacity="0.8" />
          <rect x="36" y="30" width="5" height="5" rx="1" fill="url(#goldGrad)" opacity="0.8" />

          {/* Crown top */}
          <path
            d="M26 18L30 14L34 18"
            stroke="url(#goldGrad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9A84C" />
              <stop offset="50%" stopColor="#E8C97A" />
              <stop offset="100%" stopColor="#C9A84C" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={cn(
              'font-bold tracking-wide',
              s.title,
              isDark ? 'text-gray-900' : 'text-white'
            )}
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            عالية المدينة
          </span>
          <span
            className={cn(
              'font-medium tracking-wider',
              s.subtitle,
              isDark ? 'text-gray-500' : 'text-gray-300'
            )}
            style={{
              fontFamily: 'Cairo, sans-serif',
              background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            للخدمات العقارية
          </span>
        </div>
      )}
    </Link>
  )
}
