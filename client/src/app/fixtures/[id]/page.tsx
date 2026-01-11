'use client'

import { Header } from '@/features/home/components/Header'
import { Footer } from '@/features/home/components/Footer'
import Link from 'next/link'
import { fixtures } from '@/data/mockData'
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react'

export default function FixtureDetail({ params }: { params: { id: string } }) {
  const fixture = fixtures.find(f => f.id === params.id)

  if (!fixture) {
    return (
      <>
        <Header />
        <main className="py-16 bg-white min-h-screen">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl mb-4 font-heading text-sky-500">Fixture Not Found</h1>
            <Link href="/fixtures" className="text-sky-600 hover:text-sky-700 font-semibold">
              Return to Fixtures
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      
      <main className="py-16 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/fixtures" className="inline-flex items-center gap-2 text-sky-500 hover:text-sky-600 mb-8 font-semibold transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Fixtures
          </Link>

          {/* Match Header */}
          <div className="bg-white border border-slate-200 p-8 mb-6 rounded-lg shadow-card">
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-wider text-sky-600 bg-sky-50 px-4 py-2 rounded-lg font-semibold">
                {fixture.competition}
              </span>
              {fixture.status === 'completed' && (
                <span className="text-xs uppercase tracking-wider bg-sky-50 text-sky-700 px-4 py-2 ml-2 rounded-lg font-semibold">
                  Full Time
                </span>
              )}
              {fixture.status === 'upcoming' && (
                <span className="text-xs uppercase tracking-wider bg-blue-50 text-blue-700 px-4 py-2 ml-2 rounded-lg font-semibold">
                  Upcoming
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 items-center gap-4 mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-heading text-sky-500">{fixture.homeTeam}</h2>
              </div>
              <div className="text-center">
                {fixture.status === 'completed' ? (
                  <div className="text-5xl font-heading text-sky-500">
                    {fixture.homeScore} - {fixture.awayScore}
                  </div>
                ) : (
                  <div className="text-3xl text-slate-400 font-heading">vs</div>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-heading text-sky-500">{fixture.awayTeam}</h2>
              </div>
            </div>

            <div className="space-y-3 text-center text-slate-600 border-t border-slate-200 pt-8">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                <span>{new Date(fixture.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                <span>{fixture.time}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5 text-slate-400" />
                <span>{fixture.venue}</span>
              </div>
            </div>
          </div>

          {/* Lineups */}
          {fixture.homeLineup && fixture.homeLineup.length > 0 && (
            <div className="bg-white border border-slate-200 p-8 mb-6 rounded-lg shadow-card">
              <h3 className="text-2xl mb-6 font-heading text-sky-500">Starting Lineups</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg mb-4 text-sky-500 font-heading">{fixture.homeTeam}</h4>
                  <div className="space-y-3">
                    {fixture.homeLineup.map((player, index) => (
                      <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
                        <div className="w-10 h-10 bg-sky-700 text-white rounded-full flex items-center justify-center font-semibold">
                          {player.number}
                        </div>
                        <div>
                          <div className="font-semibold text-sky-500">{player.name}</div>
                          <div className="text-sm text-slate-600">{player.position}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {fixture.awayLineup && fixture.awayLineup.length > 0 && (
                  <div>
                    <h4 className="text-lg mb-4 text-sky-500 font-heading">{fixture.awayTeam}</h4>
                    <div className="space-y-3">
                      {fixture.awayLineup.map((player, index) => (
                        <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
                          <div className="w-10 h-10 bg-slate-600 text-white rounded-full flex items-center justify-center font-semibold">
                            {player.number}
                          </div>
                          <div>
                            <div className="font-semibold text-sky-500">{player.name}</div>
                            <div className="text-sm text-slate-600">{player.position}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Match Report Link */}
          {fixture.matchReport && (
            <div className="bg-white border border-slate-200 p-8 mb-6 rounded-lg shadow-card">
              <h3 className="text-2xl mb-4 font-heading text-sky-500">Match Report</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Read the full match report and analysis of this exciting encounter.
              </p>
              <Link 
                href="/news/1" 
                className="inline-block bg-sky-900 hover:bg-sky-900/90 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
              >
                Read Match Report
              </Link>
            </div>
          )}

          {/* Pre-Match Content for Upcoming Fixtures */}
          {fixture.status === 'upcoming' && (
            <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-card">
              <h3 className="text-2xl mb-4 font-heading text-sky-500">Match Preview</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Get ready for this exciting fixture! Check back closer to match time for team news and lineups.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold">
                  Get Tickets
                </button>
                <button className="border-2 border-sky-500 text-sky-500 hover:bg-sky-900 hover:text-white px-8 py-3 rounded-lg transition-colors font-semibold">
                  Set Reminder
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
