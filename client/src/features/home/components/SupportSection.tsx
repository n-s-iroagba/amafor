'use client';

import Link from 'next/link'
import { SupporterWithTier } from '@/features/supporter/types';
import { useGet } from '@/shared/hooks/useApiQuery';

export default function SupportSection() {
  const { data: topPatrons, loading } = useGet<SupporterWithTier[]>(
    '/api/supporters/top',
    { 
      params: { limit: 4 },
      enabled: true 
    }
  )

  // Loading state
  if (loading) return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6">
            SUPPORT OUR MISSION
          </h2>
          <div className="h-1.5 sm:h-2 w-16 sm:w-20 lg:w-24 bg-sky-500 mx-auto mb-6 sm:mb-8"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    </section>
  )

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6">
            SUPPORT OUR MISSION
          </h2>
          <div className="h-1.5 sm:h-2 w-16 sm:w-20 lg:w-24 bg-sky-500 mx-auto mb-6 sm:mb-8"></div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed px-4">
            Your contribution helps develop young talent, improve facilities, and serve our community
          </p>
        </div>
        
        {/* Top Patrons Grid */}
        {topPatrons && topPatrons.length > 0 && (
          <div className="mb-12 sm:mb-14 lg:mb-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
              {topPatrons.map((patron) => (
                <div 
                  key={patron.id} 
                  className="group relative"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                  
                  {/* Card */}
                  <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 group-hover:border-sky-500 group-hover:-translate-y-2">
                    {/* Avatar */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0.5 sm:inset-1 bg-white rounded-full flex items-center justify-center">
                        <div className="w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center text-white font-black text-xl sm:text-2xl lg:text-3xl shadow-inner">
                          {patron.name.charAt(0)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Badge */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-md">
                        ⭐
                      </div>
                    </div>
                    
                    {/* Name */}
                    <h3 className="font-black text-gray-900 text-sm sm:text-base lg:text-lg mb-1 text-center group-hover:text-sky-600 transition-colors truncate px-1">
                      {patron.name}
                    </h3>
                    
                    {/* Tier */}
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <div className="h-px w-3 sm:w-4 bg-sky-500"></div>
                      <p className="text-xs sm:text-sm text-sky-600 font-bold uppercase tracking-wider truncate">
                        {patron.tier.name}
                      </p>
                      <div className="h-px w-3 sm:w-4 bg-sky-500"></div>
                    </div>
                    
                    {/* Decorative corner */}
                    <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-tl from-sky-500/10 to-transparent rounded-tl-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 px-4">
          <Link
            href="/support"
            className="bg-sky-500 hover:bg-sky-600 text-white px-8 sm:px-10 lg:px-12 py-3.5 sm:py-4 lg:py-5 font-bold text-base sm:text-lg transition-all text-center rounded-lg sm:rounded-none shadow-lg hover:shadow-xl"
          >
            DONATE NOW
          </Link>
          <Link
            href="/support/wall"
            className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 sm:px-10 lg:px-12 py-3.5 sm:py-4 lg:py-5 font-bold text-base sm:text-lg transition-all text-center rounded-lg sm:rounded-none shadow-lg hover:shadow-xl"
          >
            SUPPORTER WALL
          </Link>
        </div>
      </div>
    </section>
  )
}