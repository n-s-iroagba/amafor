'use client';

import Link from 'next/link'
import { Users, ArrowRight } from 'lucide-react'
import { useGet } from '@/shared/hooks/useApiQuery';


interface Trialist {
  id: string;
  name: string;
  position: string;
  age: number;
  height: number;
  foot: string;
  previousClub: string;
  status: 'AVAILABLE' | 'SIGNED' | 'TRIALING';
  imageUrl: string;
}

export default function TrialistsSection() {
  const { data: trialists, loading } = useGet<Trialist[]>(
    '/api/academy/trialists',
    { 
      params: { limit: 4 },
      enabled: true 
    }
  )

  // Don't render if no trialists
  if (loading) return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-gray-900 mb-6">ACADEMY TRIALISTS</h2>
          <div className="h-2 w-24 bg-sky-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Loading trialists...
          </p>
        </div>
      </div>
    </section>
  )

  if (!trialists || trialists.length === 0) return null

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-sky-500 font-bold uppercase tracking-wider text-sm mb-4">
            <Users className="w-5 h-5" />
            Talent Showcase
          </div>
          <h2 className="text-5xl font-black text-gray-900 mb-6">ACADEMY TRIALISTS</h2>
          <div className="h-2 w-24 bg-sky-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet our promising young talents seeking their breakthrough in professional football
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trialists.map((trialist) => (
            <div 
              key={trialist.id}
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-sky-500"
            >
              <div className="relative h-80 overflow-hidden bg-gray-900">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${trialist.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {trialist.status}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  {trialist.name}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-sky-600 font-bold mb-4">
                  <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                  {trialist.position}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Age</div>
                    <div className="text-lg font-black text-gray-900">{trialist.age}</div>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Height</div>
                    <div className="text-lg font-black text-gray-900">{trialist.height}cm</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Foot</div>
                    <div className="text-lg font-black text-gray-900">{trialist.foot}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold">Previous:</span> {trialist.previousClub}
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-sky-600 via-sky-500 to-transparent opacity-0 group-hover:opacity-90 transition-opacity flex items-end justify-center pb-8">
                <button className="bg-white text-sky-600 px-6 py-3 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  VIEW PROFILE
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/academy/trialists"
            className="inline-flex items-center gap-3 bg-sky-500 hover:bg-sky-600 text-white px-12 py-5 font-bold text-lg transition-all group"
          >
            VIEW ALL TRIALISTS
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}