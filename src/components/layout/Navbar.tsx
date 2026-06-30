'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import Logo from '@/components/shared/Logo'
import { cn, whatsappLink, WHATSAPP_NUMBER, PHONE_NUMBER } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/properties', label: 'العقارات' },
  { href: '/map', label: 'الخريطة' },
  { href: '/search', label: 'البحث' },
  { href: '/blog', label: 'المدونة' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'تواصل معنا' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isHome = pathname === '/'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || !isHome
            ? 'navbar-blur shadow-sm py-2'
            : 'bg-transparent py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo
              variant={scrolled || !isHome ? 'dark' : 'light'}
              size="md"
            />

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === link.href
                      ? 'text-[#C9A84C] bg-[rgba(201,168,76,0.1)]'
                      : scrolled || !isHome
                      ? 'text-gray-700 hover:text-[#C9A84C] hover:bg-[rgba(201,168,76,0.07)]'
                      : 'text-gray-200 hover:text-[#E8C97A] hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-all duration-200',
                  scrolled || !isHome ? 'text-gray-700 hover:text-[#C9A84C]' : 'text-gray-200 hover:text-[#E8C97A]'
                )}
              >
                <Phone className="w-4 h-4" />
                <span className="font-cairo">{PHONE_NUMBER}</span>
              </a>

              <Link
                href="/login"
                className="btn-gold text-sm py-2.5 px-5"
              >
                لوحة التحكم
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors',
                scrolled || !isHome ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              )}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-white border-b border-gray-100 shadow-xl lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              <nav className="flex flex-col gap-1 mb-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-3 rounded-lg text-base font-medium transition-all',
                      pathname === link.href
                        ? 'text-[#C9A84C] bg-[rgba(201,168,76,0.1)]'
                        : 'text-gray-700 hover:text-[#C9A84C] hover:bg-gray-50'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl text-gray-700"
                >
                  <Phone className="w-5 h-5 text-[#C9A84C]" />
                  <span className="font-medium">{PHONE_NUMBER}</span>
                </a>
                <Link
                  href="/login"
                  className="btn-gold text-center"
                >
                  لوحة التحكم
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for non-home pages */}
      {!isHome && <div className="h-20" />}
    </>
  )
}
