'use client'

import { Header } from '@/shared/components/Header'
import { Footer } from '@/shared/components/Footer'
import Link from 'next/link'
import { Heart, Loader2, AlertCircle } from 'lucide-react'
import { useGet } from '@/shared/hooks/useApiQuery'
import { SupporterWithTier } from '@/features/supporter/types'

export default function SupporterWall() {
  const { data: supporters, loading, error } = useGet<SupporterWithTier[]>('/api/supporters')
  
  const sortedSupporters = supporters?.length ? [...supporters].sort((a, b) => {
    const aLastName = a.name.split(' ').pop() || ''
    const bLastName = b.name.split(' ').pop() || ''
    
    const aIsLatin = /^[A-Za-z]/.test(aLastName)
    const bIsLatin = /^[A-Za-z]/.test(bLastName)
    
    // Both latin characters - sort alphabetically
    if (aIsLatin && bIsLatin) {
      return aLastName.localeCompare(bLastName)
    }
    
    // One is latin, one is not - latin comes first
    if (aIsLatin) return -1
    if (bIsLatin) return 1
    
    // Both non-latin - sort by date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  }) : []

  // Group by first letter of last name with proper typing
  const groupedSupporters: Record<string, SupporterWithTier[]> = {}
  
  sortedSupporters.forEach(supporter => {
    const lastName = supporter.name.split(' ').pop() || ''
    const firstChar = /^[A-Za-z]/.test(lastName) 
      ? lastName.charAt(0).toUpperCase() 
      : '#'
    
    if (!groupedSupporters[firstChar]) {
      groupedSupporters[firstChar] = []
    }
    groupedSupporters[firstChar].push(supporter)
  })

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Grand Patron': return 'text-sky-700 bg-sky-50'
      case 'Patron': return 'text-sky-600 bg-sky-50'
      case 'Supporter': return 'text-sky-500 bg-sky-50'
      case 'Advocate': return 'text-sky-600 bg-sky-50'
      default: return 'text-slate-600 bg-slate-50'
    }
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <main className="py-16 bg-slate-50 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-slate-700 animate-spin mb-4" />
              <p className="text-slate-600">Loading supporters...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <main className="py-16 bg-slate-50 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-4xl mx-auto text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Supporters</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Empty state
  if (!supporters || supporters.length === 0) {
    return (
      <>
        <Header />
        <main className="py-16 bg-slate-50 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="w-12 h-12 text-sky-700" />
                <h1 className="font-heading text-4xl md:text-5xl">Supporter Wall</h1>
              </div>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Thank you to all our amazing supporters who make Amafor Gladiators FC possible. 
                Your generosity helps us develop young talent and serve our community.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-card p-12 max-w-4xl mx-auto text-center">
              <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No supporters yet</h3>
              <p className="text-slate-500 mb-6">
                Be the first to support Amafor Gladiators FC!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/support/donate/checkout"
                  className="inline-block bg-sky-700 hover:bg-sky-800 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
                >
                  Make a Donation
                </Link>
                <Link 
                  href="/support/patron/checkout"
                  className="inline-block border-2 border-sky-700 text-sky-700 hover:bg-sky-50 px-8 py-3 rounded-lg transition-colors font-semibold"
                >
                  Become a Patron
                </Link>
              </div>
            </div>
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
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-12 h-12 text-sky-700" />
              <h1 className="font-heading text-4xl md:text-5xl">Supporter Wall</h1>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Thank you to all our amazing supporters who make Amafor Gladiators FC possible. 
              Your generosity helps us develop young talent and serve our community.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-card p-6 text-center">
              <div className="text-3xl font-bold text-sky-700 mb-1 font-heading">
                {supporters.length}
              </div>
              <div className="text-sm text-slate-600">Total Supporters</div>
            </div>
            <div className="bg-white rounded-lg shadow-card p-6 text-center">
              <div className="text-3xl font-bold text-sky-700 mb-1 font-heading">
                {supporters.filter(s => s.tier.name === 'Grand Patron').length}
              </div>
              <div className="text-sm text-slate-600">Grand Patrons</div>
            </div>
            <div className="bg-white rounded-lg shadow-card p-6 text-center">
              <div className="text-3xl font-bold text-sky-600 mb-1 font-heading">
                {supporters.filter(s => s.tier.name === 'Patron').length}
              </div>
              <div className="text-sm text-slate-600">Patrons</div>
            </div>
            <div className="bg-white rounded-lg shadow-card p-6 text-center">
              <div className="text-3xl font-bold text-sky-500 mb-1 font-heading">
                {supporters.filter(s => s.tier.name === 'Supporter').length}
              </div>
              <div className="text-sm text-slate-600">Supporters</div>
            </div>
          </div>

          {/* Supporter List */}
          <div className="bg-white rounded-lg shadow-card p-8 max-w-6xl mx-auto">
            {Object.keys(groupedSupporters).length > 0 ? (
              Object.keys(groupedSupporters)
                .sort((a, b) => {
                  if (a === '#') return 1
                  if (b === '#') return -1
                  return a.localeCompare(b)
                })
                .map(letter => (
                  <div key={letter} className="mb-8 last:mb-0">
                    <h2 className="font-heading text-3xl text-sky-700 mb-4 pb-2 border-b-2 border-sky-700">
                      {letter}
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupedSupporters[letter].map((supporter, index) => (
                        <div 
                          key={`${letter}-${index}`}
                          className="bg-slate-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="font-semibold mb-1">{supporter.name}</div>
                              <div className={`text-xs px-2 py-1 rounded-full inline-block ${getTierColor(supporter.tier.name)}`}>
                                {supporter.tier.name}
                              </div>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-sky-600 to-sky-800 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                              {supporter.name.charAt(0)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">No supporters to display.</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">Want to see your name on the Supporter Wall?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/support/donate/checkout"
                className="inline-block bg-sky-700 hover:bg-sky-800 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
              >
                Make a Donation
              </Link>
              <Link 
                href="/support/patron/checkout"
                className="inline-block border-2 border-sky-700 text-sky-700 hover:bg-sky-50 px-8 py-3 rounded-lg transition-colors font-semibold"
              >
                Become a Patron
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}