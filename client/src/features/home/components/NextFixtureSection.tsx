import React, { useEffect, useState } from 'react';
import { Trophy, Clock, Target } from 'lucide-react';


import { API_ROUTES } from '@/config/routes';
import Image from 'next/image';
import { useGet } from '@/shared/hooks/useApiQuery';
import { Fixture } from '@/features/fixture/types';

const NextFixtureSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const {
    data: fixture,
    loading: fixtureLoading,
    error: fixtureError,
  } = useGet<Fixture>(API_ROUTES.FIXTURES.NEXT_UPCOMING);

  // Countdown timer
  useEffect(() => {
    if (!fixture) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const kickoff = new Date(fixture.matchDate).getTime();
      const diff = kickoff - now;

      if (diff <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [fixture]);

  if (!fixture) {
    return <p className="text-center py-8">No Upcoming Fixture</p>;
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-sky-900/5 via-transparent to-cyan-900/5"></div>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-900 rounded-2xl sm:rounded-3xl overflow-hidden text-white shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-transparent to-cyan-500/20"></div>

          <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12 text-center">
            {/* Trophy Icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-sky-400 to-cyan-400 p-4 rounded-2xl shadow-xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Date + League */}
            <div className="mb-8">
              <p className="text-xl md:text-2xl font-light text-sky-100">
                {new Date(fixture.matchDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p className="text-base md:text-lg text-cyan-200 font-medium">
                Kick Off{' '}
                {new Date(fixture.matchDate).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                • League #{fixture.leagueId}
              </p>
            </div>

            {/* Teams & Countdown */}
            <div className="mb-10 w-full">
              <div className="grid md:grid-cols-3 gap-8 items-center justify-items-center max-w-5xl mx-auto">
                {/* Home Team */}
                <div className="text-center group w-full max-w-[200px]">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl mx-auto">
                      <Image
                        src={fixture.homeTeamLogo}
                        alt={`${fixture.homeTeam}'s logo`}
                        width={56}
                        height={56}
                        className="object-contain rounded-full border-2 border-sky-500"
                        priority
                        quality={85}
                        sizes="(max-width: 640px) 40px, 56px"

                        loading="eager"
                      />
                    </div>
                  </div>
                  <p className="font-bold text-lg">{fixture.homeTeam}</p>
                </div>

                {/* Countdown */}
                <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 px-6 py-6 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/10 w-full max-w-xs">
                  <div className="flex items-center justify-center space-x-3">
                    <Clock className="w-6 h-6 text-sky-400" />
                    <div className="text-3xl font-mono font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
                      {String(timeLeft.hours).padStart(2, '0')}:
                      {String(timeLeft.minutes).padStart(2, '0')}:
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                  </div>
                </div>

                {/* Away Team */}
                <div className="text-center group w-full max-w-[200px]">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-2xl mx-auto">
                      <Image
                        src={fixture.awayTeamLogo}
                        alt={`${fixture.awayTeam}'s logo`}
                        width={56}
                        height={56}
                        className="object-contain rounded-full border-2 border-sky-500"
                        priority
                        quality={85}
                        sizes="(max-width: 640px) 40px, 56px"

                        loading="eager"
                      />
                    </div>
                  </div>
                  <p className="font-bold text-lg">{fixture.awayTeam}</p>
                </div>
              </div>
            </div>

            {/* Fixture Center Button */}
            <div className="flex justify-center">
              <button className="group relative px-10 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition-all">
                <span className="relative z-10 flex items-center justify-center">
                  <Target className="w-6 h-6 mr-3" />
                  MATCH CENTER
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextFixtureSection;
