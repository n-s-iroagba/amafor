
import { WhatsAppWidget } from '@/features/shared/WhatsAppWidget';
import { CookieConsent } from '@/features/shared/CookieConsent';
import { Footer } from '@/features/shared/Footer';
import Link from 'next/link'
import { fixtures, leagueTable } from '@/data/mockData'
import { Calendar, MapPin } from 'lucide-react'
import { Header } from '@/features/home/components/Header';

export default function LeagueFixtures() {
  const upcomingFixtures = fixtures.filter(f => f.status === 'upcoming')
  const completedFixtures = fixtures.filter(f => f.status === 'completed')

  return (
    <>
      <Header />
      
      <main className="py-16 bg-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-5xl font-heading text-sky-500 mb-2">Fixtures & Results</h1>
            <div className="h-1 w-16 bg-sky-600 mb-6"></div>
            <p className="text-xl text-slate-600">
              View upcoming matches and recent results
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Upcoming Fixtures */}
              <div>
                <h2 className="text-3xl font-heading text-sky-500 mb-8">Upcoming Fixtures</h2>
                <div className="space-y-4">
                  {upcomingFixtures.map((fixture) => (
                    <Link
                      key={fixture.id}
                      href={`/fixtures/${fixture.id}`}
                      className="block bg-slate-50 border border-slate-200 p-6 hover:border-sky-600 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs uppercase tracking-wider text-sky-600 font-semibold">
                          {fixture.competition}
                        </span>
                        <span className="text-xs uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 font-semibold">
                          Upcoming
                        </span>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4 mb-4">
                        <div className="text-right">
                          <h3 className="font-heading text-lg text-sky-500">{fixture.homeTeam}</h3>
                        </div>
                        <div className="text-center text-2xl font-heading text-slate-400">
                          vs
                        </div>
                        <div>
                          <h3 className="font-heading text-lg text-sky-500">{fixture.awayTeam}</h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-sm text-slate-600 border-t border-slate-200 pt-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(fixture.date).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{fixture.time}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {fixture.venue}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Results */}
              <div>
                <h2 className="text-3xl font-heading text-sky-500 mb-8">Recent Results</h2>
                <div className="space-y-4">
                  {completedFixtures.map((fixture) => (
                    <Link
                      key={fixture.id}
                      href={`/fixtures/${fixture.id}`}
                      className="block bg-slate-50 border border-slate-200 p-6 hover:border-sky-600 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs uppercase tracking-wider text-sky-600 font-semibold">
                          {fixture.competition}
                        </span>
                        <span className="text-xs uppercase tracking-wider bg-green-50 text-green-700 px-3 py-1 font-semibold">
                          Full Time
                        </span>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4 mb-4">
                        <div className="text-right">
                          <h3 className="font-heading text-lg text-sky-500">{fixture.homeTeam}</h3>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-heading text-sky-500">
                            {fixture.homeScore} - {fixture.awayScore}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-heading text-lg text-sky-500">{fixture.awayTeam}</h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-sm text-slate-600 border-t border-slate-200 pt-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(fixture.date).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {fixture.venue}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* League Table Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 border border-slate-200 p-6 sticky top-24">
                <h2 className="text-2xl font-heading text-sky-500 mb-6">League Table</h2>
                <div className="space-y-1">
                  {leagueTable.map((team, index) => (
                    <div
                      key={team.team}
                      className={`flex items-center gap-3 p-3 ${
                        team.team === 'Amafor Gladiators' ? 'bg-sky-50 border border-sky-200' : 'bg-white'
                      }`}
                    >
                      <span className="text-sm font-semibold text-slate-600 w-6">{index + 1}</span>
                      <span className={`flex-1 text-sm ${team.team === 'Amafor Gladiators' ? 'font-semibold text-sky-500' : 'text-slate-700'}`}>
                        {team.team}
                      </span>
                      <span className="text-sm font-semibold text-sky-500 w-8 text-right">{team.points}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-600">
                  <div className="grid grid-cols-4 gap-2 text-center font-semibold mb-2">
                    <span>P</span>
                    <span>W</span>
                    <span>D</span>
                    <span>L</span>
                  </div>
                  {leagueTable.slice(0, 3).map((team) => (
                    <div key={team.team} className="grid grid-cols-4 gap-2 text-center py-1">
                      <span>{team.played}</span>
                      <span>{team.won}</span>
                      <span>{team.drawn}</span>
                      <span>{team.lost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CookieConsent />
      <WhatsAppWidget />
    </>
  )
}
