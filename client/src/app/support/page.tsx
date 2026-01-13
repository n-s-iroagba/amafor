'use client'

import { Header } from '@/shared/components/Header'
import { Footer } from '@/shared/components/Footer'
import Link from 'next/link'

import { Heart, Check } from 'lucide-react'
import { SupporterTier } from '@/features/supporter/types'
import { useGet } from '@/shared/hooks/useApiQuery'

export default function SupportDonate() {
  const {data:patronTiers} = useGet<SupporterTier[]>('')
  return (
    <>
      <Header />
      
      <main className="py-16 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl mb-4 font-heading">Support Amafor Gladiators FC</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Your support helps us develop young talent, improve facilities, and serve our community. 
              Choose how you'd like to contribute to our mission.
            </p>
          </div>

          {/* One-Time Donation */}
          <div className="bg-white rounded-lg shadow-card p-8 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-sky-700" />
              <h2 className="text-3xl font-heading">Make a One-Time Donation</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Every contribution makes a difference. Make a one-time donation of any amount to 
              support the club. You can choose to be recognized on our Supporter Wall.
            </p>
            <Link 
              href="/support/donate/checkout"
              className="inline-block bg-sky-700 hover:bg-sky-800 text-white px-8 py-3 rounded-lg transition-colors font-medium"
            >
              Donate Now
            </Link>
          </div>

          {/* Patron Tiers */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl mb-4 font-heading">Become a Patron</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Join our exclusive patron program with recurring support. Enjoy special benefits 
                and recognition while helping build the future of Nigerian football.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {patronTiers?.length && patronTiers.map((tier, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-lg shadow-card p-8 ${
                    tier.name === 'Grand Patron' ? 'ring-2 ring-sky-500' : ''
                  }`}
                >
                  {tier.name === 'Grand Patron' && (
                    <div className="text-sm text-sky-700 bg-sky-50 px-3 py-1 rounded-full inline-block mb-4 font-medium">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl mb-2 font-heading">{tier.name}</h3>
                  <div className="text-3xl font-bold text-sky-700 mb-1 font-heading">
                    {tier.price}
                  </div>
                  <div className="text-slate-600 mb-6">{tier.billing}</div>
                  <ul className="space-y-3 mb-8">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex gap-3">
                        <Check className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href={`/support/patron/checkout?tier=${encodeURIComponent(tier.name)}`}
                    className="block text-center bg-sky-700 hover:bg-sky-800 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Choose {tier.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link 
                href="/support/wall"
                className="text-sky-700 hover:text-sky-800 underline font-medium"
              >
                View our Supporter Wall
              </Link>
            </div>
          </div>

          {/* Impact Section */}
          <div className="mt-16 bg-sky-700 text-white rounded-lg p-8 md:p-12">
            <h2 className="text-3xl mb-6 text-center font-heading">Your Impact</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 font-heading">150+</div>
                <div>Academy players supported annually</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 font-heading">₦15M</div>
                <div>Invested in facility improvements</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 font-heading">5</div>
                <div>Community programs funded</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
