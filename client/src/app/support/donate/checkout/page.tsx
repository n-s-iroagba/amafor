'use client'

import { Header } from '@/features/home/components/Header'
import { Footer } from '@/features/home/components/Footer'
import Link from 'next/link'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { useState } from 'react'

export default function DonationCheckout() {
  const [amount, setAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [optInSupporterWall, setOptInSupporterWall] = useState(true)
  const [donorName, setDonorName] = useState('')
  const [email, setEmail] = useState('')

  const presetAmounts = ['5000', '10000', '25000', '50000', '100000']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalAmount = amount === 'custom' ? customAmount : amount
    
    // In production, this would redirect to Paystack
    alert(`Payment initiated for ₦${finalAmount}. In production, this would redirect to Paystack checkout.`)
  }

  return (
    <>
      <Header />
      
      <main className="py-16 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link href="/support" className="flex items-center gap-2 text-sky-700 hover:text-sky-800 mb-6 font-medium">
            <ArrowLeft className="w-5 h-5" />
            Back to Support
          </Link>

          <div className="bg-white rounded-lg shadow-card p-8">
            <h1 className="text-3xl mb-6 font-heading">Make a Donation</h1>

            <form onSubmit={handleSubmit}>
              {/* Donation Amount */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Select Amount</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                        amount === preset
                          ? 'border-sky-700 bg-sky-50 text-sky-700 font-medium'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      aria-pressed={amount === preset}
                    >
                      ₦{parseInt(preset).toLocaleString()}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount('custom')}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                      amount === 'custom'
                        ? 'border-sky-700 bg-sky-50 text-sky-700 font-medium'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    aria-pressed={amount === 'custom'}
                  >
                    Custom
                  </button>
                </div>
                {amount === 'custom' && (
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                    required
                    min="100"
                    aria-label="Custom donation amount"
                  />
                )}
              </div>

              {/* Donor Information */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                  required
                />
                <p className="text-sm text-slate-600 mt-1">
                  You'll receive a receipt via email
                </p>
              </div>

              {/* Supporter Wall Opt-in */}
              <div className="mb-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optInSupporterWall}
                    onChange={(e) => setOptInSupporterWall(e.target.checked)}
                    className="mt-1 w-5 h-5 text-sky-700 border-slate-300 rounded focus:ring-sky-700"
                  />
                  <div>
                    <div className="font-semibold">Add me to the Supporter Wall</div>
                    <div className="text-sm text-slate-600">
                      Your name will be publicly displayed on our Supporter Wall to recognize your contribution
                    </div>
                  </div>
                </label>
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Donation Amount:</span>
                  <span className="text-2xl font-bold text-sky-700 font-heading">
                    ₦{(amount === 'custom' ? customAmount : amount) ? 
                      parseInt(amount === 'custom' ? customAmount : amount).toLocaleString() : '0'}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  100% of your donation goes directly to supporting the club
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!amount || (amount === 'custom' && !customAmount) || !donorName || !email}
                className="w-full bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Donate with Paystack
              </button>

              <p className="text-sm text-slate-600 text-center mt-4">
                Secure payment powered by Paystack. You will be redirected to complete your donation.
              </p>
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center text-sm text-slate-600">
            <p>🔒 Secure payment processing</p>
            <p className="mt-2">Your donation receipt will include: Amount, Date, Transaction ID, and Reference Number</p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
