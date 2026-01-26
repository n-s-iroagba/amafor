'use client'

import { Header } from '@/shared/components/Header'
import { Footer } from '@/shared/components/Footer'
import Link from 'next/link'
import { Heart, Check, Star, Shield, Users, ArrowRight, Zap } from 'lucide-react'

import { useGet } from '@/shared/hooks/useApiQuery'
import { API_ROUTES } from '@/config/routes'
import { PatronSubscriptionPackage, PatronTier } from '@/features/patron/types'

/**
 * Patron/Support Page
 * 
 * Allows fans and organizations to support the club through
 * one-time donations or recurring subscription packages.
 * 
 * @requirement REQ-SUP-01: Public support/donation page.
 */
/**
 * Page: Patron Support Landing
 * Description: Overview of patron tiers and support options.
 * Requirements: REQ-SUP-02 (Subscription Tiers)
 * User Story: US-SUP-002 (View Subscription Plans)
 * User Journey: UJ-SUP-001 (Subscribe)
 * API: GET /patrons/packages (API_ROUTES.PATRONS.PACKAGES)
 * Hook: useGet(API_ROUTES.PATRONS.PACKAGES)
 */
export default function SupportDonate() {
  const { data: patronTiers, loading } = useGet<PatronSubscriptionPackage[]>(API_ROUTES.PATRONS.PACKAGES)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 bg-slate-900 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-sky-400/5 -skew-x-12 transform origin-top-right pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-400/10 border border-sky-400/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-8">
                <Heart className="w-3.5 h-3.5" /> Support the Vision
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tight leading-tight">
                Fuel the Future of <span className="text-sky-400">Nigerian Talent</span>
              </h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12">
                Your support drives our mission to discover, develop, and deploy the next generation of football stars. Join the Gladiators family.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 -mt-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            {/* One-Time Donation */}
            <div className="lg:col-span-1">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 h-full flex flex-col justify-between group hover:shadow-2xl transition-all duration-500">
                <div>
                  <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Zap className="w-8 h-8 text-sky-600" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Direct Impact</h2>
                  <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                    Make an immediate difference with a one-time contribution. Every Naira goes directly toward academy operations and local facility improvements.
                  </p>
                </div>
                <Link
                  href="/patron/checkout"
                  className="inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest group"
                >
                  Make a Donation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Supporter Wall Teaser */}
            <div className="lg:col-span-2">
              <div className="bg-sky-400 p-1 rounded-[2.5rem] h-full shadow-xl">
                <div className="bg-white p-10 rounded-[2.3rem] h-full flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-6 text-sky-600 font-black text-[10px] uppercase tracking-widest">
                      <Users className="w-4 h-4" /> Global Community
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight">Gladiators Wall of Fame</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                      Join the list of distinguished supporters recognized for their commitment to the sport. Your name etched in history.
                    </p>
                    <Link
                      href="/patron/wall"
                      className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-black text-xs uppercase tracking-widest transition-colors"
                    >
                      Browse the Wall <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="w-full md:w-64 h-64 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Users className="w-20 h-20 text-slate-200 group-hover:text-sky-200 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Patron Tiers */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">Official Patron Program</h2>
              <div className="h-1.5 w-24 bg-sky-400 mx-auto rounded-full mb-8" />
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] max-w-2xl mx-auto">
                Exclusive benefits for our dedicated recurring partners
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-sky-400/20 border-t-sky-400 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {patronTiers?.map((tier, index) => (
                  <div
                    key={index}
                    className={`relative p-1 rounded-[3rem] transition-transform duration-500 hover:-translate-y-2 group ${tier.tier === PatronTier.PATRON
                      ? 'bg-gradient-to-br from-sky-400 to-indigo-500'
                      : 'bg-slate-200'
                      }`}
                  >
                    <div className="bg-white p-10 rounded-[2.8rem] h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            {tier.tier.replace('_', ' ')}
                          </h3>
                          {tier.tier === PatronTier.PATRON && (
                            <div className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                              Popular
                            </div>
                          )}
                        </div>

                        <div className="flex items-baseline gap-1 mb-8">
                          <span className="text-4xl font-black text-slate-900">₦{tier.miniumumAmount.toLocaleString()}</span>
                          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/ {tier.frequency}</span>
                        </div>

                        <ul className="space-y-4 mb-10">
                          {tier.benefits.map((benefit, i) => (
                            <li key={i} className="flex gap-3 items-start">
                              <div className="mt-1 w-5 h-5 bg-sky-50 rounded-md flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5 text-sky-600" />
                              </div>
                              <span className="text-sm font-bold text-slate-600 leading-tight">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Link
                        href={`/patron/checkout?tier=${tier.tier}`}
                        className={`w-full py-5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest text-center ${tier.tier === PatronTier.PATRON
                          ? 'bg-slate-900 text-white hover:bg-slate-800'
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                          }`}
                      >
                        Select Tier
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>


        </div>
      </main>

      <Footer />
    </div>
  )
}
