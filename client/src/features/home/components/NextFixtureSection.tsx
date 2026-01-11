'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trophy, ArrowRight } from 'lucide-react'
import { useGet } from "@/hooks/useApiQuery"

interface NextFixture {
  id: string;
  matchDate: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function NextFixtureSection() {
  const { data: nextFixture, loading: fixtureLoading } = useGet<NextFixture>(
    '/api/fixtures/next',
    { enabled: true }
  )
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!nextFixture?.matchDate) return

    const calculateTimeLeft = () => {
      const difference = +new Date(nextFixture.matchDate) - +new Date()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [nextFixture])

  // Don't render if loading or no fixture
  if (fixtureLoading || !nextFixture) return null

  return (
    <section className="py-16 bg-white border-b-4 border-sky-500">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-sky-500 font-bold uppercase tracking-wider text-sm mb-4">
              <Trophy className="w-5 h-5" />
              Next Match
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              {nextFixture.homeTeam} <span className="text-sky-500">VS</span> {nextFixture.awayTeam}
            </h2>
            <p className="text-gray-600 font-semibold">{nextFixture.competition}</p>
            {nextFixture.venue && (
              <p className="text-sm text-gray-500 mt-1">📍 {nextFixture.venue}</p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item) => (
              <div key={item.label} className="bg-gray-900 rounded-lg p-6 text-center">
                <div className="text-4xl md:text-5xl font-black text-sky-400 mb-2">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-xs md:text-sm text-gray-400 uppercase font-bold tracking-wider">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href={`/fixtures/${nextFixture.id}`}
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 font-bold transition-all"
            >
              VIEW MATCH DETAILS
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}