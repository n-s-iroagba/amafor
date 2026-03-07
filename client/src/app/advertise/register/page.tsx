'use client'

import { Header } from '@/shared/components/Header'
import { Footer } from '@/shared/components/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { usePost } from '@/shared/hooks/useApiQuery'
import { API_ROUTES } from '@/config/routes'


/**
 * Advertiser Registration
 * 
 * Public form for businesses to register as advertisers. Collects business 
 * details and credentials for manual verification.
 * 
 * @screen SC-005
 * @implements REQ-ADV-01, REQ-ADV-10
 * @usecase UC-ADV-02 (Register Account)
 * @requires SRS-I-006 (Auth API - POST /auth/signup)
 * @performance NFR-PERF-01
 * @observability SRS-OBS-008 Monitor registration funnel and verification delay
 */
export default function AdvertiserRegistration() {
  const [businessName, setBusinessName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')

  const { post, isPending } = usePost(API_ROUTES.AUTH.SIGNUP);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (password !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    try {
      await post({
        businessName,
        companyName: businessName,
        contactName,
        email,
        phone,
        contact_phone: phone,
        password,
        confirmPassword,
        userType: 'advertiser'
      });
      setSubmitted(true)
    } catch (error: any) {
      console.error('Registration failed:', error);
      const msg = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.';
      setFormError(msg);
    }
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="py-24 bg-sky-50 min-h-screen">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="bg-white p-12 rounded-lg shadow-card">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⏳</span>
              </div>
              <h1 className="text-3xl font-heading text-sky-800 mb-4" data-testid="success-message">Application Received</h1>
              <p className="text-lg text-sky-600 mb-8 max-w-lg mx-auto">
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

      <main className="py-16 bg-sky-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link href="/advertise" className="inline-flex items-center gap-2 text-sky-500 hover:text-sky-700 mb-8 font-semibold transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Advertise Info
          </Link>

          <div className="bg-white border border-sky-200 p-8 rounded-lg shadow-card">
            <h1 className="text-3xl font-heading text-sky-500 mb-2">Register as an Advertiser</h1>
            <div className="h-1 w-16 bg-sky-700 mb-6"></div>
            <p className="text-sky-600 mb-8 leading-relaxed">
              Complete the form below to create your advertiser account.
              Your account will be reviewed and verified within 24-48 hours.
            </p>

            {formError && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                <span data-testid="error-message">{formError}</span>
              </div>
            )}

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
                  className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                  required
                  data-testid="business-name-input"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-sky-500 mb-2">
                  Contact Person <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Full name of primary contact"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                  required
                  data-testid="contact-name-input"
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
                  className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                  required
                  data-testid="business-email-input"
                />
                <p className="text-sm text-sky-500 mt-2">
                  This will be your login email and where we send campaign notifications
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-sky-500 mb-2">
                  Business Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                  required
                  data-testid="business-phone-input"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-sky-500 mb-2">
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                  required
                  data-testid="password-input"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-sky-500 mb-2">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                  required
                  data-testid="confirm-password-input"
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
                disabled={!businessName || !contactName || !email || !phone || !password || !confirmPassword || isPending}
                className="w-full bg-sky-700 hover:bg-sky-800 disabled:bg-sky-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg transition-colors font-semibold"
                data-testid="submit-registration"
              >
                {isPending ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-sky-600">
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
