'use client';

import Link from 'next/link'
import { Calendar, ImageIcon, ArrowRight } from 'lucide-react'
import { useGet } from '@/shared/hooks/useApiQuery';
import { FixtureWithLeague, MatchImage } from '../types';
import { formatDate } from '@/shared/utils';



export interface MatchGallery extends FixtureWithLeague {
  images: MatchImage[];
}

export default function MatchGallerySection() {
  const { data: matchGalleries, loading: galleriesLoading } = useGet<MatchGallery[]>(
    '/api/fixtures/galleries',
    {
      params: { limit: 6 },
      enabled: true
    }
  )

  // Don't render if loading or no galleries
  if (galleriesLoading) return (
    <section className="py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-5xl font-black text-white">MATCH GALLERY</h2>
            <div className="h-2 w-24 bg-sky-500 mt-4"></div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-700"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-700 rounded mb-3"></div>
                <div className="h-6 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  if (!matchGalleries || matchGalleries.length === 0) return null

  return (
    <section className="py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-5xl font-black text-white">MATCH GALLERY</h2>
            <div className="h-2 w-24 bg-sky-500 mt-4"></div>
          </div>
          <Link href="/gallery" className="text-sky-400 hover:text-sky-300 font-bold inline-flex items-center gap-3 text-lg">
            VIEW ALL
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchGalleries.map((match) => (
            <Link
              key={match.id}
              href={`/gallery/${match.id}`}
              className="group bg-gray-800 rounded-lg overflow-hidden hover:ring-4 hover:ring-sky-500 transition-all"
            >
              <div className="relative overflow-hidden h-64">
                {match.images && match.images.length > 0 ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${match.images[0].url})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                    
                    {match.images.length > 1 && (
                      <div className="absolute top-4 right-4 bg-sky-500 text-white px-3 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        {match.images.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-600" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  {formatDate(match.date)}
                
                </div>

                <div className="text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
                  {match.league.name}
                </div>

                <h3 className="text-xl font-black text-white mb-2 group-hover:text-sky-400 transition-colors">
                  {match.homeTeam} vs {match.awayTeam}
                </h3>

                {match.homeScore !== undefined && match.awayScore !== undefined && (
                  <div className="text-2xl font-black text-gray-300">
                    {match.homeScore} - {match.awayScore}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}