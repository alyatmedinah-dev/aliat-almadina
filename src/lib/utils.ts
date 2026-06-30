import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1)} م`
  }
  if (price >= 1_000) {
    return `${(price / 1_000).toFixed(0)} ألف`
  }
  return price.toLocaleString('ar-SA')
}

export function formatPriceFull(price: number): string {
  return `${price.toLocaleString('ar-SA')} ريال`
}

export function formatArea(area: number): string {
  return `${area.toLocaleString('ar-SA')} م²`
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ar-SA')
}

export function generateSlug(title: string): string {
  return title
    .replace(/\s+/g, '-')
    .replace(/[^\u0621-\u064A\u0660-\u0669a-zA-Z0-9-]/g, '')
    .toLowerCase()
    + '-' + Date.now()
}

export function generateContractNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `CNT-${year}-${random}`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2)
  return words[0][0] + words[words.length - 1][0]
}

export function whatsappLink(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const number = cleaned.startsWith('0') ? '966' + cleaned.slice(1) : cleaned
  const text = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${number}${text ? '?text=' + text : ''}`
}

export function phoneLink(phone: string): string {
  return `tel:${phone}`
}

export const WHATSAPP_NUMBER = '966597773332'
export const PHONE_NUMBER = '0597773332'
export const RENTAL_MANAGER_PHONE = '0548639461'
export const RENTAL_MANAGER_WHATSAPP = '966548639461'
