'use client'

import { Header } from '@/shared/components/Header'
import { Footer } from '@/shared/components/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function AdvertiserRegistration() {
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would submit to backend
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="py-24 bg-slate-50 min-h-screen">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="bg-white p-12 rounded-lg shadow-card">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⏳</span>
              </div>
              <h1 className="text-3xl font-heading text-slate-800 mb-4">Application Received</h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
                Thank you for registering. Your account is currently <strong>Awaiting Verification</strong>.
                <br /><br />
                Our Commercial Manager will review your business details and approve your account within 24-48 hours.
                You will receive an email notification once your account is active.
              </p>
              <Link href="/" className="inline-block bg-sky-700 text-white px-8 py-3 rounded-lg hover:bg-sky-800 transition-colors">
                Return Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }


  return (
    <>
      <Header />

      <main className="py-16 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link href="/advertise" className="inline-flex items-center gap-2 text-sky-500 hover:text-sky-700 mb-8 font-semibold transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Advertise Info
          </Link>

          <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-card">
            <h1 className="text-3xl font-heading text-sky-500 mb-2">Register as an Advertiser</h1>
            <div className="h-1 w-16 bg-sky-700 mb-6"></div>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Complete the form below to create your advertiser account.
              Your account will be reviewed and verified within 24-48 hours.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-sky-500 mb-2">
                  Business Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your business or company name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-sky-500 mb-2">
                  Business Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  placeholder="business@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                  required
                />
                <p className="text-sm text-slate-500 mt-2">
                  This will be your login email and where we send campaign notifications
                </p>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-sky-500 mb-2">
                  Business Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 mb-8 rounded-lg">
                <p className="text-sm text-blue-900 leading-relaxed">
                  <strong>Note:</strong> By registering, you agree to our advertising terms and conditions.
                  All campaign content must comply with our guidelines and will be reviewed before publication.
                </p>
              </div>

              <button
                type="submit"
                disabled={!businessName || !email || !phone}
                className="w-full bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg transition-colors font-semibold"
              >
                Submit Application
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-slate-600">
            <p>Already have an account?{' '}
              <Link href="/auth/login" className="text-sky-700 hover:text-sky-800 font-semibold">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
