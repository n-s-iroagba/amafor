'use client'



import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { useState } from 'react'
import { Header } from '@/shared/components/Header'
import { Footer } from '@/shared/components/Footer'
import { useGet } from '@/shared/hooks/useApiQuery'
import { PatronSubscriptionPackage } from '@/features/patron/types'
import { PaymentType } from '@/features/paystack/types'
import dynamic from 'next/dynamic'

const PaymentButton = dynamic(
  () => import('@/features/paystack/components/PaymentButton'),
  { ssr: false }
)




/**
 * Page: Patron Checkout
 * Description: Processing page for patron subscriptions and donations.
 * Requirements: REQ-SUP-01 (Donations), REQ-SUP-02 (Subscriptions)
 * User Story: US-SUP-001 (Make Donation), US-SUP-002 (Subscribe)
 * User Journey: UJ-SUP-001 (Subscribe)
 * API: POST /payments/initialize (Payment Gateway)
 * Component: PaymentButton (Paystack Integration)
 */
export default function PatronCheckout() {

  const { data: patronTiers } = useGet<PatronSubscriptionPackage[]>('')
  const preselectedTier = ''

  const [selectedTier, setSelectedTier] = useState(preselectedTier)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const tierData = patronTiers && patronTiers.find(t => t.tier === selectedTier)





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
                <form>
                  {/* Tier Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-3">Select Patron Tier</label>
                    <div className="space-y-2">
                      {patronTiers && patronTiers.map((tier) => (
                        <button
                          key={tier.tier}
                          type="button"
                          onClick={() => setSelectedTier(tier.tier)}
                          className={`w-full text-left px-4 py-4 rounded-lg border-2 transition-colors ${selectedTier === tier.tier
                            ? 'border-sky-700 bg-sky-50'
                            : 'border-slate-200 hover:border-slate-300'
                            }`}
                          aria-pressed={selectedTier === tier.tier}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold">{tier.tier}</div>
                              <div className="text-sm text-slate-600">{tier.frequency}</div>
                            </div>
                            <div className="text-lg font-bold text-sky-700 font-heading">{tier.miniumumAmount}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

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



                  <PaymentButton paymentDetails={undefined} type={PaymentType.SUBSCRIPTION} />
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

      </main>

      <Footer />
    </>
  )
}
