'use client'

import { Header } from '@/shared/components/Header'
import { Footer } from '@/shared/components/Footer'
import Link from 'next/link'

import { Eye, TrendingUp, Target, ArrowRight, ChevronRight } from 'lucide-react'
import { adZones } from '@/features/advertisement/data'


/**
 * Page: Advertising Landing Page
 * Description: Information page for potential advertisers showcasing ad zones and pricing.
 * Requirements: REQ-ADV-01 (Advertiser Reference)
 * User Story: US-ADV-001 (View Advertising Options)
 * User Journey: UJ-ADV-001 (Registration)
 * API: None (Static Content)
 */
export default function AdvertiseInfo() {
  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-sky-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-heading mb-6">Advertise with Amafor Gladiators FC</h1>
            <div className="h-1 w-16 bg-sky-600 mx-auto mb-6"></div>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto mb-8 leading-relaxed">
              Reach thousands of passionate football fans across Nigeria and beyond.
              Get your brand in front of an engaged audience that loves the beautiful game.
            </p>
            <Link
              href="/advertise/register"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-10 py-4 rounded-lg transition-colors font-semibold text-lg"
              data-testid="hero-register-btn"
            >
              Register as an Advertiser
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Why Advertise */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-heading text-sky-500 text-center mb-12">Why Advertise with Us?</h2>
            <div className="grid md:grid-cols-3 gap-12">

              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-sky-700" />
                </div>
                <h3 className="text-xl font-heading text-sky-500 mb-3">Targeted Reach</h3>
                <p className="text-slate-600 leading-relaxed">
                  Target specific content categories to reach the right audience for your business
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-sky-700" />
                </div>
                <h3 className="text-xl font-heading text-sky-500 mb-3">Measurable Results</h3>
                <p className="text-slate-600 leading-relaxed">
                  Real-time performance tracking and detailed analytics for every campaign
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Zones */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-heading text-sky-500 text-center mb-12">Available Ad Zones</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {adZones.map((zone) => (
                <div key={zone.id} className="bg-white border border-slate-200 p-8 rounded-lg shadow-card" data-testid={`ad-zone-${zone.id}`}>
                  <h3 className="text-2xl font-heading text-sky-500 mb-4">{zone.name}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{zone.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-600">Dimensions:</span>
                      <span className="font-semibold text-sky-500">{zone.dimensions}px</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-600">Max Size:</span>
                      <span className="font-semibold text-sky-500">{zone.maxSize}</span>
                    </div>

                  </div>

                  <div className="bg-slate-100 h-32 flex items-center justify-center text-slate-500 border border-slate-200 rounded-lg">
                    {zone.dimensions} Preview
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-heading text-sky-500 text-center mb-12">How It Works</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              {[
                {
                  step: 1,
                  title: 'Register Your Business',
                  description: 'Create an advertiser account by providing your business details. Our team will verify your account within 24-48 hours.'
                },
                {
                  step: 2,
                  title: 'Create Your Campaign',
                  description: 'Choose your ad zone, upload your creative, set targeting preferences, and define your desired number of unique views.'
                },
                {
                  step: 3,
                  title: 'Make Payment',
                  description: 'Pay securely via Paystack. Cost is calculated based on per-view rate × target views. Receive instant payment confirmation.'
                },
                {
                  step: 4,
                  title: 'Track Performance',
                  description: 'Monitor your campaign in real-time through your dashboard. View delivered views, remaining views, and cost-per-view metrics.'
                },
                {
                  step: 5,
                  title: 'Campaign Completion',
                  description: 'When your target is reached, the campaign automatically pauses. You\'ll receive an email with final statistics and upsell options.'
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="w-12 h-12 bg-sky-700 text-white rounded-full flex items-center justify-center shrink-0 font-heading text-xl">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-heading text-sky-500 mb-2">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Information */}
        <section className="py-20 bg-sky-700 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-heading text-center mb-6">Transparent Pricing</h2>
            <p className="text-center text-xl mb-12 max-w-3xl mx-auto">
              Pay only for unique views. We count each visitor once per 24 hours to ensure quality engagement.
            </p>
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur p-8 rounded-lg border border-white/20">
              <h3 className="text-2xl font-heading mb-6">Example Campaign</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Ad Zone:</span>
                  <span className="font-semibold">Homepage Top Banner</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Per-View Rate:</span>
                  <span className="font-semibold">₦50</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Target Unique Views:</span>
                  <span className="font-semibold">10,000</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-white/20">
                  <span className="text-xl">Total Campaign Cost:</span>
                  <span className="text-3xl font-heading">₦500,000</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-heading text-sky-500 mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Join local businesses already advertising with Amafor Gladiators FC.
                Register today and launch your first campaign.
              </p>
              <Link
                href="/advertise/register"
                className="inline-flex items-center gap-2 bg-sky-900 hover:bg-sky-900/90 text-white px-10 py-4 rounded-lg transition-colors font-semibold text-lg mb-8"
                data-testid="cta-register-btn"
              >
                Register Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-slate-600">
                Questions? Contact us at{' '}
                <a href="mailto:advertise@amaforgladiatorsfc.com" className="text-sky-700 hover:text-sky-800 font-semibold">
                  advertise@amaforgladiatorsfc.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
