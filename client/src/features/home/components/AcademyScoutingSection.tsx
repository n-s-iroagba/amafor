'use client';

import Link from 'next/link'
import { GraduationCap, Eye, ArrowRight } from 'lucide-react'

export default function AcademyScoutingSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Academy Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 p-8 md:p-12 text-white group hover:shadow-2xl transition-shadow">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-6">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black mb-4">
                ACADEMY
              </h3>
              
              <p className="text-white/90 mb-6 leading-relaxed text-lg">
                Join our world-class youth development program. We nurture talent from grassroots to professional level with expert coaching and modern facilities.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Professional coaching staff</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Age groups from U-8 to U-19</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Clear pathway to professional football</span>
                </li>
              </ul>
              
              <Link
                href="/academy"
                className="inline-flex items-center gap-2 bg-white text-sky-600 hover:bg-gray-100 px-8 py-4 font-bold transition-all group-hover:gap-4"
              >
                LEARN MORE
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Scouting Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-12 text-white group hover:shadow-2xl transition-shadow">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-sky-500/20 rounded-lg flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-sky-400" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black mb-4">
                PRO VIEW PORTAL
              </h3>
              
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                Are you a professional scout or agent? Get exclusive access to verified player profiles, full match archives, and comprehensive performance data.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-sky-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  </div>
                  <span>Access to full match video archives</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-sky-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  </div>
                  <span>Verified player profiles with audit trails</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-sky-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  </div>
                  <span>Downloadable player reports</span>
                </li>
              </ul>
              
              <Link
                href="/pro-view"
                className="inline-flex items-center gap-2 bg-sky-500 text-white hover:bg-sky-600 px-8 py-4 font-bold transition-all group-hover:gap-4"
              >
                APPLY FOR ACCESS
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}