'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { whatsappLink, WHATSAPP_NUMBER } from '@/lib/utils'

export default function WhatsAppButton() {
  return (
    <motion.a
      href={whatsappLink(WHATSAPP_NUMBER, 'أهلاً، أريد الاستفسار عن عقار')}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-[#25D366] text-white rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-14 h-14 flex items-center justify-center">
        <MessageCircle className="w-7 h-7" fill="white" />
      </div>
      <div className="hidden md:block overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 pe-4">
        <span className="text-sm font-semibold whitespace-nowrap font-arabic">
          تواصل واتساب
        </span>
      </div>

      {/* Pulse animation */}
      <span className="absolute top-0 left-0 w-full h-full rounded-full bg-[#25D366] animate-ping opacity-20" />
    </motion.a>
  )
}
