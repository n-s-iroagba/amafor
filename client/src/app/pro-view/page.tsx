'use client'

import { Header } from '@/shared/components/Header'
import { Footer } from '@/shared/components/Footer'
import Link from 'next/link'
import { Eye, Database, Video, Shield, ArrowRight, ChevronRight } from 'lucide-react'

export default function ProViewAccess() {
  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-sky-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block bg-sky-700/20 border border-sky-400/30 text-sky-300 px-6 py-2 rounded-lg mb-6 text-sm font-semibold uppercase tracking-wider">
              For Professional Scouts
            </div>
            <h1 className="text-5xl font-heading mb-6">Pro View Portal</h1>
            <div className="h-1 w-16 bg-sky-700 mx-auto mb-6"></div>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto mb-8 leading-relaxed">
              Exclusive access to comprehensive player data, match archives, and verified information
              for professional scouts and talent evaluators worldwide.
            </p>
            <Link
              href="/pro-view/apply"
              className="inline-flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white px-10 py-4 rounded-lg transition-colors font-semibold text-lg"
            >
              Apply for Access
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-lg shadow-card">
                <div className="w-14 h-14 bg-sky-100 rounded-lg flex items-center justify-center mb-6">
                  <Database className="w-7 h-7 text-sky-700" />
                </div>
                <h3 className="text-xl font-heading text-sky-500 mb-3">Verified Player Profiles</h3>
                <p className="text-slate-600 leading-relaxed">
                  Access comprehensive, verified data including biometrics, position details,
                  and complete playing history with immutable audit trails.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-8 rounded-lg shadow-card">
                <div className="w-14 h-14 bg-sky-100 rounded-lg flex items-center justify-center mb-6">
                  <Video className="w-7 h-7 text-sky-700" />
                </div>
                <h3 className="text-xl font-heading text-sky-500 mb-3">Full Fixture Archives</h3>
                <p className="text-slate-600 leading-relaxed">
                  Watch complete match recordings with high-quality video streaming,
                  available within 30 minutes of final whistle.
                </p>
              </div>

              {/* Data Export Tools Removed per BRD DEV-03 */}

              <div className="bg-slate-50 border border-slate-200 p-8 rounded-lg shadow-card">
                <div className="w-14 h-14 bg-sky-100 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-sky-700" />
                </div>
                <h3 className="text-xl font-heading text-sky-500 mb-3">Verified Information</h3>
                <p className="text-slate-600 leading-relaxed">
                  All data is maintained by our professional staff with complete change
                  history and audit logs for transparency.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-8 rounded-lg shadow-card">
                <div className="w-14 h-14 bg-sky-100 rounded-lg flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-sky-700" />
                </div>
                <h3 className="text-xl font-heading text-sky-500 mb-3">Advanced Search & Filters</h3>
                <p className="text-slate-600 leading-relaxed">
                  Find players quickly with advanced filtering by position, age, physical attributes,
                  and more with sub-2-second search performance.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-8 rounded-lg shadow-card">
                <div className="w-14 h-14 bg-sky-100 rounded-lg flex items-center justify-center mb-6">
                  <Database className="w-7 h-7 text-sky-700" />
                </div>
                <h3 className="text-xl font-heading text-sky-500 mb-3">Recent Activity Tracking</h3>
                <p className="text-slate-600 leading-relaxed">
                  Keep track of recently viewed players for easy access to prospects
                  you're monitoring.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who Can Apply */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white border border-slate-200 p-12 rounded-lg shadow-card">
              <h2 className="text-4xl font-heading text-sky-500 text-center mb-6">Who Can Apply?</h2>
              <p className="text-slate-600 mb-12 text-center leading-relaxed">
                Pro View access is granted to verified professional scouts and talent evaluators.
                Eligible applicants include:
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  { title: 'Professional Club Scouts', desc: 'Scouts working for professional football clubs at any level' },
                  { title: 'Licensed Agents', desc: 'FIFA-licensed or nationally registered player agents' },
                  { title: 'Football Analysts', desc: 'Professional analysts working for clubs, media, or analytics firms' },
                  { title: 'National Team Staff', desc: 'Scouts and coaches affiliated with national football federations' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-6 h-6 bg-sky-700 text-white rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-heading text-sky-500 mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-20 bg-sky-700 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-heading text-center mb-12">Application Process</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              {[
                { num: 1, title: 'Submit Application', desc: 'Complete the application form with your credentials including organization, social media profile links, and professional background.' },
                { num: 2, title: 'Manual Review', desc: 'Our commercial team reviews each application to verify credentials and professional standing. This typically takes 24-48 hours.' },
                { num: 3, title: 'Receive Decision', desc: 'You\'ll receive an email notification with the decision. If approved, your login credentials will be provided immediately.' },
                { num: 4, title: 'Access Pro View', desc: 'Log in to the secure Pro View portal and start accessing comprehensive player data and match archives.' }
              ].map((step) => (
                <div key={step.num} className="flex gap-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 font-heading text-xl">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading mb-2">{step.title}</h3>
                    <p className="text-sky-100 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-4xl font-heading text-sky-500 mb-6">Ready to Apply?</h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Join professional scouts from around the world who trust Amafor Gladiators FC
              for reliable player information and comprehensive match data.
            </p>
            <Link
              href="/pro-view/apply"
              className="inline-flex items-center gap-2 bg-sky-900 hover:bg-sky-900/90 text-white px-10 py-4 rounded-lg transition-colors font-semibold text-lg mb-8"
            >
              Apply for Pro View Access
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-slate-600">
              Questions? Contact us at{' '}
              <a href="mailto:proview@amaforgladiatorsfc.com" className="text-sky-700 hover:text-sky-800 font-semibold">
                proview@amaforgladiatorsfc.com
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
