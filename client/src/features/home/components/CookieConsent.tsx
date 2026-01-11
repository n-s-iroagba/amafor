'use client'

import { useState, useEffect } from 'react'

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShow(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShow(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-4 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            We use cookies to improve your experience on our site. By continuing, you accept our use of cookies.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="px-6 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-sm"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white transition-colors font-semibold text-sm"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
