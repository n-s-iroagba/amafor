'use client'


import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { Footer } from '@/shared/components/Footer'
import { Header } from '@/shared/components/Header'

export default function ProViewApplication() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [socialUrl, setSocialUrl] = useState('')
  const [organization, setOrganization] = useState('')
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="py-16 bg-slate-50 min-h-screen">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white border border-slate-200 p-12 rounded-lg shadow-card text-center">
              <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-sky-700" />
              </div>
              <h1 className="text-3xl font-heading text-sky-500 mb-4">Application Submitted Successfully!</h1>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Thank you for applying for Pro View access. Your application is now{' '}
                <span className="font-semibold text-sky-700">pending manual review</span>.
              </p>
              <div className="bg-slate-50 p-6 mb-8 rounded-lg text-left">
                <h3 className="font-heading text-sky-500 mb-4">What happens next?</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex gap-3">
                    <span className="text-sky-700 font-bold">✓</span>
                    <span>Our team will review your credentials within 24-48 hours</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-sky-700 font-bold">✓</span>
                    <span>You'll receive an email notification with the decision</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-sky-700 font-bold">✓</span>
                    <span>If approved, login credentials will be sent to your email</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-sky-700 font-bold">✓</span>
                    <span>You can then access the Pro View portal immediately</span>
                  </li>
                </ul>
              </div>
              <div className="text-slate-600 mb-8">
                <p>A confirmation email has been sent to:</p>
                <p className="font-semibold text-sky-500 mt-1">{email}</p>
              </div>
              <Link 
                href="/"
                className="inline-block bg-sky-900 hover:bg-sky-900/90 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
              >
                Return to Homepage
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
          <Link href="/pro-view" className="inline-flex items-center gap-2 text-sky-500 hover:text-sky-700 mb-8 font-semibold transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Pro View Info
          </Link>

          <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-card">
            <h1 className="text-3xl font-heading text-sky-500 mb-2">Apply for Pro View Access</h1>
            <div className="h-1 w-16 bg-sky-700 mb-6"></div>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Complete the application below. Our team will review your credentials and respond within 24-48 hours.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-sky-500 mb-2">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-sky-500 mb-2">
                  Professional Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-sky-500 mb-2">
                  Organization <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Club, Agency, or Organization Name"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-sky-500 mb-2">
                  Professional Social Media Profile URL <span className="text-red-600">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile or https://twitter.com/yourprofile"
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                  required
                />
                <p className="text-sm text-slate-500 mt-2">
                  We use this to verify your professional credentials
                </p>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-sky-500 mb-2">
                  Reason for Application <span className="text-red-600">*</span>
                </label>
                <textarea
                  placeholder="Briefly describe your role and why you need access to Pro View"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 min-h-32"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!name || !email || !organization || !socialUrl || !reason}
                className="w-full bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg transition-colors font-semibold"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
