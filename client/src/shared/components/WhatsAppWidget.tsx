'use client'

import { MessageCircle } from 'lucide-react'

/**
 * Floating WhatsApp contact widget.
 *
 * Phone number and default message are driven by environment variables so that
 * they never need to be hardcoded in source code:
 *   NEXT_PUBLIC_WHATSAPP_NUMBER – digits only, e.g. 2348012345678
 *   NEXT_PUBLIC_WHATSAPP_MESSAGE – optional default pre-filled message
 */
export function WhatsAppWidget() {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const message =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    'Hello! I have a question about Amafor Gladiators FC.'

  const handleClick = () => {
    if (!phoneNumber) {
      console.warn('[WhatsAppWidget] NEXT_PUBLIC_WHATSAPP_NUMBER is not set.')
      return
    }
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-50"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </button>
  )
}