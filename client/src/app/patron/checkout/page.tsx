'use client'

import Link from 'next/link'
import { ArrowLeft, Check, Trophy, Heart, Shield, Lock, CreditCard } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Header } from '@/shared/components/Header'
import { Footer } from '@/shared/components/Footer'
import { useGet } from '@/shared/hooks/useApiQuery'
import { PatronSubscriptionPackage } from '@/features/patron/types'
import { PaymentPayload, PaymentType } from '@/features/paystack/types'
import dynamic from 'next/dynamic'
import { API_ROUTES } from '@/config/routes'

const PaymentButton = dynamic(
  () => import('@/features/paystack/components/PaymentButton'),
  { ssr: false }
)

export default function PatronCheckout() {
  const { data: patronTiers } = useGet<PatronSubscriptionPackage[]>(API_ROUTES.PATRONS.PACKAGES)

  const [donationType, setDonationType] = useState<'subscription' | 'donation'>('subscription')
  const [selectedTier, setSelectedTier] = useState<string>('')
  const [selectedFrequency, setSelectedFrequency] = useState<string>('monthly')
  const [customAmount, setCustomAmount] = useState<string>('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Group tiers by unique tier name
  const uniqueTiers = useMemo(() => {
    if (!patronTiers) return []
    const tiers = new Set(patronTiers.map(t => t.tier))
    return Array.from(tiers)
  }, [patronTiers])

  // Get available frequencies for selected tier (or all if none selected)
  const availableFrequencies = useMemo(() => {
    if (!patronTiers) return []
    if (!selectedTier) return ['monthly'] // Default
    return patronTiers
      .filter(t => t.tier === selectedTier)
      .map(t => t.frequency)
  }, [patronTiers, selectedTier])

  // Find the exact package based on current selection
  const tierData = useMemo(() =>
    patronTiers?.find(t => t.tier === selectedTier && t.frequency === selectedFrequency),
    [patronTiers, selectedTier, selectedFrequency])

  // Helpers
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount)

  const isValidAmount = () => {
    if (donationType === 'subscription') return !!tierData
    if (donationType === 'donation') {
      const amount = parseInt(customAmount.replace(/[^0-9]/g, ''))
      return !isNaN(amount) && amount >= 1000 // Min 1000 NGN
    }
    return false
  }

  const isValidForm = useMemo(() => {
    return name.length > 2 && email.includes('@') && phone.length > 5 && isValidAmount()
  }, [name, email, phone, customAmount, selectedTier, selectedFrequency, donationType, tierData])

  const paymentPayload: PaymentPayload | undefined = useMemo(() => {
    if (!isValidForm) return undefined

    let amount = '0'
    if (donationType === 'subscription' && tierData) {
      amount = (tierData.miniumumAmount * 100).toString()
    } else {
      amount = (parseInt(customAmount.replace(/[^0-9]/g, '')) * 100).toString()
    }

    return {
      email,
      amount,
      metadata: {
        name,
        phone,
        type: donationType,
        tier: donationType === 'subscription' ? selectedTier : 'one-time',
        frequency: donationType === 'subscription' ? selectedFrequency : 'one-time',
        custom_fields: [
          { display_name: "Name", variable_name: "name", value: name },
          { display_name: "Phone", variable_name: "phone", value: phone },
          { display_name: "Type", variable_name: "type", value: donationType },
          { display_name: "Frequency", variable_name: "frequency", value: selectedFrequency }
        ]
      }
    }
  }, [isValidForm, donationType, tierData, customAmount, email, name, phone, selectedTier, selectedFrequency])

  return (
    <>
      <Header />

      <main className="bg-slate-50 min-h-screen pb-20 pt-8 sm:pt-12">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Breadcrumb */}
          <Link href="/patron/wall" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-700 mb-8 transition-colors group font-medium">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Supporter Wall
          </Link>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Left Column: Form */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">

                {/* Header */}
                <div className="bg-gradient-to-r from-sky-900 to-slate-900 p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <h1 className="text-3xl font-bold mb-2 relative z-10">Support the Team</h1>
                  <p className="text-sky-200 relative z-10">Your contribution helps us build champions.</p>
                </div>

                <div className="p-6 sm:p-8 space-y-8">

                  {/* Donation Type Toggle */}
                  <div className="bg-slate-100 p-1 rounded-xl flex">
                    <button
                      onClick={() => setDonationType('subscription')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm sm:text-base transition-all ${donationType === 'subscription'
                        ? 'bg-white text-sky-700 shadow-md transform scale-[1.02]'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                      data-testid="type-toggle-subscription"
                    >
                      <Trophy className="w-4 h-4" />
                      Recurring Support
                    </button>
                    <button
                      onClick={() => setDonationType('donation')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm sm:text-base transition-all ${donationType === 'donation'
                        ? 'bg-white text-sky-700 shadow-md transform scale-[1.02]'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                      data-testid="type-toggle-donation"
                    >
                      <Heart className="w-4 h-4" />
                      One-time Donation
                    </button>
                  </div>

                  {/* Dynamic Content Based on Type */}
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {donationType === 'subscription' ? (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-sky-600" />
                            Select Membership Tier
                          </h3>

                          {/* Frequency Toggle */}
                          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 text-xs font-bold">
                            <button
                              onClick={() => setSelectedFrequency('monthly')}
                              className={`px-3 py-1.5 rounded-md transition-all ${selectedFrequency === 'monthly' ? 'bg-white shadow text-sky-700' : 'text-slate-500'}`}
                              data-testid="frequency-monthly"
                            >
                              MONTHLY
                            </button>
                            <button
                              onClick={() => setSelectedFrequency('yearly')}
                              className={`px-3 py-1.5 rounded-md transition-all ${selectedFrequency === 'yearly' ? 'bg-white shadow text-sky-700' : 'text-slate-500'}`}
                              data-testid="frequency-yearly"
                            >
                              YEARLY
                            </button>
                          </div>
                        </div>

                        <div className="grid gap-3">
                          {uniqueTiers.map((tierName) => {
                            // Find package for this tier and current frequency
                            const pkg = patronTiers?.find(p => p.tier === tierName && p.frequency === selectedFrequency)
                            if (!pkg) return null

                            return (
                              <button
                                key={tierName}
                                onClick={() => setSelectedTier(tierName)}
                                className={`group relative text-left p-4 rounded-xl border-2 transition-all ${selectedTier === tierName
                                  ? 'border-sky-600 bg-sky-50 shadow-md'
                                  : 'border-slate-100 hover:border-sky-200 hover:bg-slate-50'
                                  }`}
                                data-testid="tier-selection-btn"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className={`font-bold text-lg capitalize ${selectedTier === tierName ? 'text-sky-900' : 'text-slate-700'}`}>
                                      {tierName.replace(/_/g, ' ')}
                                    </div>
                                    <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{selectedFrequency}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xl font-black text-slate-900">{formatCurrency(pkg.miniumumAmount)}</div>
                                    {selectedTier === tierName && (
                                      <div className="bg-sky-600 text-white text-xs px-2 py-1 rounded-full inline-block mt-1">Selected</div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-sky-50 rounded-xl p-6 border-2 border-sky-100">
                        <h3 className="text-lg font-bold text-sky-900 mb-4 flex items-center gap-2">
                          <Heart className="w-5 h-5 text-sky-600" />
                          Enter Donation Amount
                        </h3>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">₦</span>
                          <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="5,000"
                            className="w-full pl-10 pr-4 py-4 rounded-lg border-2 border-sky-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-100 outline-none text-2xl font-bold text-slate-800 placeholder:text-slate-300 bg-white"
                            data-testid="custom-amount-input"
                          />
                        </div>
                        <p className="text-sm text-sky-700 mt-2 font-medium">Minimum donation: ₦1,000</p>
                      </div>
                    )}
                  </div>

                  {/* User Details */}
                  <div className="border-t border-slate-100 pt-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Your Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-50 outline-none transition-all font-medium"
                          placeholder="John Doe"
                          data-testid="checkout-name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-50 outline-none transition-all font-medium"
                          placeholder="john@example.com"
                          data-testid="checkout-email"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-50 outline-none transition-all font-medium"
                          placeholder="+234..."
                          data-testid="checkout-phone"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <div className="pt-4">
                    <PaymentButton
                      key={isValidForm ? 'valid' : 'invalid'}
                      paymentDetails={paymentPayload!}
                      type={donationType}
                    />
                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400 font-medium">
                      <Lock className="w-3 h-3" />
                      SECURE PAYMENT BY PAYSTACK
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right Column: Summary */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">

              {/* Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Order Summary</h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Type</span>
                    <span className="font-bold text-slate-900 capitalize">{donationType}</span>
                  </div>
                  {donationType === 'subscription' && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Plan</span>
                      <span className="font-bold text-slate-900 capitalize">{selectedTier?.replace(/_/g, ' ') || '-'}</span>
                    </div>
                  )}
                  {donationType === 'subscription' && tierData && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Billing</span>
                      <span className="font-bold text-slate-900 capitalize">{tierData.frequency}</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center mb-6">
                  <span className="text-slate-600 font-medium">Total</span>
                  <span className="text-2xl font-black text-sky-700">
                    {donationType === 'subscription'
                      ? (tierData ? formatCurrency(tierData.miniumumAmount) : '₦0.00')
                      : formatCurrency(parseInt(customAmount || '0'))}
                  </span>
                </div>

                {/* Benefits List (Only for Subscription) */}
                {donationType === 'subscription' && tierData && tierData.benefits && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">INCLUDED BENEFITS</div>
                    <ul className="space-y-3">
                      {tierData.benefits.map((benefit, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-700">
                          <Check className="w-5 h-5 text-sky-500 shrink-0" />
                          <span className="leading-tight">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {donationType === 'donation' && (
                  <div className="text-center p-6 bg-sky-50 rounded-xl border-2 border-dashed border-sky-100">
                    <Heart className="w-10 h-10 text-sky-400 mx-auto mb-2" />
                    <p className="text-sm text-sky-800 font-medium">Thank you for your one-time support! Every contribution matters.</p>
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
