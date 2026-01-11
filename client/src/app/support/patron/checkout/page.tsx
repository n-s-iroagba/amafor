'use client'

import { Header } from '@/features/home/components/Header'
import { Footer } from '@/features/home/components/Footer'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, CreditCard, Check } from 'lucide-react'
import { useState } from 'react'
import { patronTiers } from '@/data/mockData'

export default function PatronCheckout() {
  const searchParams = useSearchParams()
  const preselectedTier = searchParams.get('tier') || 'Advocate'
  
  const [selectedTier, setSelectedTier] = useState(preselectedTier)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const tierData = patronTiers.find(t => t.name === selectedTier)

  const calculateAmount = () => {
    if (!tierData) return 0
    const basePrice = parseInt(tierData.price.replace(/[₦,]/g, ''))
    
    if (tierData.billing === 'Lifetime') return basePrice
    
    if (billingCycle === 'yearly') return basePrice
    if (billingCycle === 'monthly') return Math.floor(basePrice / 12)
    
    return basePrice
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Subscription initiated for ${selectedTier} tier (${billingCycle}). In production, this would redirect to Paystack subscription checkout.`)
  }

  return (
    <>
      <Header />
      
      <main className="py-16 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/support" className="flex items-center gap-2 text-sky-700 hover:text-sky-800 mb-6 font-medium">
            <ArrowLeft className="w-5 h-5" />
            Back to Support
          </Link>

          <h1 className="text-3xl md:text-4xl mb-8 font-heading">Become a Patron</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-card p-8">
                <form onSubmit={handleSubmit}>
                  {/* Tier Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-3">Select Patron Tier</label>
                    <div className="space-y-2">
                      {patronTiers.map((tier) => (
                        <button
                          key={tier.name}
                          type="button"
                          onClick={() => setSelectedTier(tier.name)}
                          className={`w-full text-left px-4 py-4 rounded-lg border-2 transition-colors ${
                            selectedTier === tier.name
                              ? 'border-sky-700 bg-sky-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          aria-pressed={selectedTier === tier.name}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold">{tier.name}</div>
                              <div className="text-sm text-slate-600">{tier.billing}</div>
                            </div>
                            <div className="text-lg font-bold text-sky-700 font-heading">{tier.price}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Billing Cycle (only for non-lifetime tiers) */}
                  {tierData && tierData.billing !== 'Lifetime' && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-3">Billing Cycle</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setBillingCycle('monthly')}
                          className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                            billingCycle === 'monthly'
                              ? 'border-sky-700 bg-sky-50 text-sky-700 font-medium'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          aria-pressed={billingCycle === 'monthly'}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillingCycle('yearly')}
                          className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                            billingCycle === 'yearly'
                              ? 'border-sky-700 bg-sky-50 text-sky-700 font-medium'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          aria-pressed={billingCycle === 'yearly'}
                        >
                          Yearly
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillingCycle('lifetime')}
                          className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                            billingCycle === 'lifetime'
                              ? 'border-sky-700 bg-sky-50 text-sky-700 font-medium'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          aria-pressed={billingCycle === 'lifetime'}
                        >
                          Lifetime
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Personal Information */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+234"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!name || !email || !phone}
                    className="w-full bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Subscribe with Paystack
                  </button>

                  <p className="text-sm text-slate-600 text-center mt-4">
                    Secure recurring payment powered by Paystack
                  </p>
                </form>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-card p-6 sticky top-24">
                <h3 className="font-semibold mb-4 font-heading">Summary</h3>
                
                <div className="mb-4 pb-4 border-b border-slate-200">
                  <div className="text-sm text-slate-600 mb-1">Selected Tier:</div>
                  <div className="font-semibold">{selectedTier}</div>
                </div>

                {tierData && tierData.billing !== 'Lifetime' && (
                  <div className="mb-4 pb-4 border-b border-slate-200">
                    <div className="text-sm text-slate-600 mb-1">Billing Cycle:</div>
                    <div className="font-semibold capitalize">{billingCycle}</div>
                  </div>
                )}

                <div className="mb-6 pb-6 border-b border-slate-200">
                  <div className="text-sm text-slate-600 mb-1">
                    {tierData?.billing === 'Lifetime' ? 'One-time Payment:' : 'Recurring Payment:'}
                  </div>
                  <div className="text-2xl font-bold text-sky-700 font-heading">
                    ₦{calculateAmount().toLocaleString()}
                    {tierData?.billing !== 'Lifetime' && (
                      <span className="text-sm text-slate-600">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    )}
                  </div>
                </div>

                {tierData && (
                  <div>
                    <div className="text-sm font-semibold mb-3">Your Benefits:</div>
                    <ul className="space-y-2">
                      {tierData.benefits.map((benefit, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <Check className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
