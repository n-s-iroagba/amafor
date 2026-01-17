'use client'


import Link from 'next/link'
import { useSearchParams } from 'next/navigation'


import { Search, User, FileText, Trophy } from 'lucide-react'
import { useState } from 'react'
import { Header } from '@/shared/components/Header'
import { Footer } from '@/shared/components/Footer'
import { WhatsAppWidget } from '@/shared/components/WhatsAppWidget'
import { useGet } from '@/shared/hooks/useApiQuery'
import { Player } from '@/features/player/types'
import { Article } from '@/features/articles/types'
import { Fixture } from '@/features/fixture/types'

export default function SearchResults() {
   const {data:players} = useGet<Player[]>('')
     const {data:newsArticles} = useGet<Article[]>('')
       const {data:fixtures} = useGet<Fixture[]>('')

  const [activeTab, setActiveTab] = useState<'all' | 'players' | 'articles' | 'matches'>('all')

  // Search logic
  const query =''
  const searchPlayers = players||[].filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.position.toLowerCase().includes(query.toLowerCase())
  )

  const searchArticles = newsArticles||[].filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.excerpt.toLowerCase().includes(query.toLowerCase()) 
  )

  const searchMatches = fixtures||[].filter(f =>
    f.homeTeam.toLowerCase().includes(query.toLowerCase()) ||
    f.awayTeam.toLowerCase().includes(query.toLowerCase()) 
  )

  const totalResults = searchPlayers.length + searchArticles.length + searchMatches.length

  return (
    <>
      <Header />
      
      <main className="py-16 bg-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-heading text-sky-500 mb-2">Search Results</h1>
            <div className="h-1 w-16 bg-sky-600 mb-4"></div>
            <p className="text-slate-600 text-lg">
              {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
            </p>
          </div>

          {totalResults === 0 ? (
            <div className="bg-slate-50 border border-slate-200 p-16 text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-heading text-sky-500 mb-4">No results found</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                We couldn't find anything matching "{query}". Try searching for:
              </p>
              <ul className="text-slate-600 space-y-2">
                <li>• Player names (e.g., "Emeka Okonkwo")</li>
                <li>• Article topics (e.g., "match report", "academy")</li>
                <li>• Team names or competitions</li>
              </ul>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-2 mb-8 overflow-x-auto border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-3 transition-colors whitespace-nowrap font-semibold ${
                    activeTab === 'all'
                      ? 'border-b-2 border-sky-600 text-sky-600'
                      : 'text-slate-600 hover:text-sky-500'
                  }`}
                >
                  All ({totalResults})
                </button>
                {searchPlayers.length > 0 && (
                  <button
                    onClick={() => setActiveTab('players')}
                    className={`px-6 py-3 transition-colors whitespace-nowrap flex items-center gap-2 font-semibold ${
                      activeTab === 'players'
                        ? 'border-b-2 border-sky-600 text-sky-600'
                        : 'text-slate-600 hover:text-sky-500'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Players ({searchPlayers.length})
                  </button>
                )}
                {searchArticles.length > 0 && (
                  <button
                    onClick={() => setActiveTab('articles')}
                    className={`px-6 py-3 transition-colors whitespace-nowrap flex items-center gap-2 font-semibold ${
                      activeTab === 'articles'
                        ? 'border-b-2 border-sky-600 text-sky-600'
                        : 'text-slate-600 hover:text-sky-500'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Articles ({searchArticles.length})
                  </button>
                )}
                {searchMatches.length > 0 && (
                  <button
                    onClick={() => setActiveTab('matches')}
                    className={`px-6 py-3 transition-colors whitespace-nowrap flex items-center gap-2 font-semibold ${
                      activeTab === 'matches'
                        ? 'border-b-2 border-sky-600 text-sky-600'
                        : 'text-slate-600 hover:text-sky-500'
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                    Matches ({searchMatches.length})
                  </button>
                )}
              </div>

              <div className="space-y-12">
                {/* Players */}
                {(activeTab === 'all' || activeTab === 'players') && searchPlayers.length > 0 && (
                  <div>
                    {activeTab === 'all' && (
                      <h2 className="text-2xl font-heading text-sky-500 mb-6">Players</h2>
                    )}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchPlayers.map(player => (
                        <div key={player.id} className="bg-slate-50 border border-slate-200 p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-sky-900 rounded-full flex items-center justify-center text-white text-xl font-heading">
                              {player.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-heading text-sky-500 mb-1">{player.name}</h3>
                              {/* <p className="text-sm text-slate-600">{player.position} • Age {player.age}</p>
                              <p className="text-sm text-slate-500">{player.height}</p> */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Articles */}
                {(activeTab === 'all' || activeTab === 'articles') && searchArticles.length > 0 && (
                  <div>
                    {activeTab === 'all' && (
                      <h2 className="text-2xl font-heading text-sky-500 mb-6">Articles</h2>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">
                      {searchArticles.map(article => (
                        <Link
                          key={article.id}
                          href={`/news/${article.id}`}
                          className="group bg-slate-50 border border-slate-200 overflow-hidden flex gap-4 hover:border-sky-600 transition-colors"
                        >
                          {/* <div 
                            className="w-32 h-32 bg-cover bg-center shrink-0"
                            style={{ backgroundImage: `url(${article.image})` }}
                          />
                          <div className="p-4 flex-1">
                            <span className="text-xs uppercase tracking-wider text-sky-600 font-semibold">
                              {article.category}
                            </span>
                            <h3 className="text-lg font-heading text-sky-500 mt-2 mb-1 line-clamp-2 group-hover:text-sky-600 transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-sm text-slate-600 line-clamp-2">{article.excerpt}</p>
                            <p className="text-xs text-slate-500 mt-2">
                              {new Date(article.date).toLocaleDateString()}
                            </p>
                          </div> */}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matches */}
                {(activeTab === 'all' || activeTab === 'matches') && searchMatches.length > 0 && (
                  <div>
                    {activeTab === 'all' && (
                      <h2 className="text-2xl font-heading text-sky-500 mb-6">Matches</h2>
                    )}
                    {/* <div className="grid md:grid-cols-2 gap-6">
                      {searchMatches.map(match => (
                        <Link
                          key={match.id}
                          href={`/fixtures/${match.id}`}
                          className="bg-slate-50 border border-slate-200 p-6 hover:border-sky-600 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-xs uppercase tracking-wider text-sky-600 font-semibold">
                              {match.competition}
                            </span>
                            <span className={`text-xs uppercase tracking-wider px-3 py-1 font-semibold ${
                              match.status === 'completed' 
                                ? 'bg-green-50 text-green-700' 
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                              {match.status === 'completed' ? 'Final' : 'Upcoming'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-heading text-sky-500">{match.homeTeam}</span>
                            {match.status === 'completed' ? (
                              <span className="text-xl font-heading text-sky-500">{match.homeScore}</span>
                            ) : (
                              <span className="text-slate-400">vs</span>
                            )}
                          </div>
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-heading text-sky-500">{match.awayTeam}</span>
                            {match.status === 'completed' && (
                              <span className="text-xl font-heading text-sky-500">{match.awayScore}</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 border-t border-slate-200 pt-4">
                            {new Date(match.date).toLocaleDateString()} • {match.time}
                          </p>
                        </Link>
                      ))}
                    </div> */}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      <WhatsAppWidget />
    </>
  )
}
