'use client';

import Link from 'next/link'

import {  SupporterWithTier } from '@/features/supporter/types';
import { useGet } from '@/shared/hooks/useApiQuery';



export default function SupportSection() {
  const { data: topPatrons, loading } = useGet<SupporterWithTier[]>(
    '/api/supporters/top',
    { 
      params: { limit: 4 },
      enabled: true 
    }
  )

  // Don't render if loading or no patrons
  if (loading) return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-5xl font-black text-gray-900 mb-6">SUPPORT OUR MISSION</h2>
          <div className="h-2 w-24 bg-sky-500 mx-auto mb-8"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    </section>
  )

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-5xl font-black text-gray-900 mb-6">SUPPORT OUR MISSION</h2>
          <div className="h-2 w-24 bg-sky-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Your contribution helps develop young talent, improve facilities, and serve our community
          </p>
        </div>
        
        {topPatrons && topPatrons.length > 0 && (
          <div className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {topPatrons.map((patron) => (
                <div 
                  key={patron.id} 
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                  
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 group-hover:border-sky-500 group-hover:-translate-y-2">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full animate-pulse"></div>
                      <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-inner">
                          {patron.name.charAt(0)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute top-3 right-3">
                      <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        ⭐
                      </div>
                    </div>
                    
                    <h3 className="font-black text-gray-900 text-lg mb-1 text-center group-hover:text-sky-600 transition-colors">
                      {patron.name}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-px w-4 bg-sky-500"></div>
                      <p className="text-xs text-sky-600 font-bold uppercase tracking-wider">
                        {patron.tier.name}
                      </p>
                      <div className="h-px w-4 bg-sky-500"></div>
                    </div>
                    
                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-sky-500/10 to-transparent rounded-tl-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="/support"
            className="bg-sky-500 hover:bg-sky-600 text-white px-12 py-5 font-bold text-lg transition-all"
          >
            DONATE NOW
          </Link>
          <Link
            href="/support/wall"
            className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-12 py-5 font-bold text-lg transition-all"
          >
            SUPPORTER WALL
          </Link>
        </div>
      </div>
    </section>
  )
}