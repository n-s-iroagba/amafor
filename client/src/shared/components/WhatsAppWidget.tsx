'use client'

import { MessageCircle } from 'lucide-react'

export function WhatsAppWidget() {
  const phoneNumber = '+234XXXXXXXXXX' // Replace with actual WhatsApp number
  const message = 'Hello! I have a question about Amafor Gladiators FC.'

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
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