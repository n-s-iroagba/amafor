'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Clock, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { API_ROUTES } from '@/config/routes';
import Image from 'next/image';
import Link from 'next/link';
import { useGet } from '@/shared/hooks/useApiQuery';
import { Fixture } from '@/features/fixture/types';

const NextFixtureSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const {
    data: fixture,
    loading: fixtureLoading,
  } = useGet<Fixture>(API_ROUTES.FIXTURES.NEXT_UPCOMING, {
    enabled: true,
  });

  // Countdown timer
  useEffect(() => {
    if (!fixture) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const kickoff = new Date(fixture.matchDate).getTime();
      const diff = kickoff - now;

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTime());

    const interval = setInterval(() => {
      const remaining = calculateTime();
      setTimeLeft(remaining);

      if (
        remaining.days === 0 &&
        remaining.hours === 0 &&
        remaining.minutes === 0 &&
        remaining.seconds === 0
      ) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fixture]);

  if (fixtureLoading) {
    return (
      <section className="py-20 bg-slate-900 border-y border-slate-800/50">
        <div className="container mx-auto px-4 max-w-7xl animate-pulse">
          <div className="h-96 bg-slate-800/50 rounded-3xl"></div>
        </div>
      </section>
    );
  }

  if (!fixture) {
    return null;
  }

  const matchDate = new Date(fixture.matchDate);
  const now = new Date();

  // Ensure we only show future fixtures
  if (matchDate.getTime() < now.getTime()) {
    return null;
  }

  return (
    <section className="relative py-24 overflow-hidden bg-slate-950">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000"></div>
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-bold tracking-wider mb-6">
            <Trophy className="w-4 h-4" />
            <span>NEXT MATCHDAY</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              The Big Showdown
            </span>
          </h2>
          <div className="flex items-center justify-center gap-6 text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500" />
              <span className="text-sm md:text-base font-medium">
                {matchDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-500" />
              <span className="text-sm md:text-base font-medium">
                {matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} Kickoff
              </span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="max-w-6xl mx-auto relative group">
          {/* Card Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-500 rounded-[2.5rem] opacity-30 group-hover:opacity-50 blur-xl transition-opacity duration-500"></div>

          <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-14 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">

              {/* Home Team */}
              <div className="flex-1 text-center md:text-right group/home">
                <div className="relative w-28 h-28 md:w-40 md:h-40 mx-auto md:ml-auto md:mr-0 mb-6 transition-transform duration-300 group-hover/home:scale-110">
                  <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-2xl group-hover/home:bg-sky-500/30 transition-colors"></div>
                  <Image
                    src={fixture.homeTeamLogo || '/placeholder-team.png'}
                    alt={fixture.homeTeam}
                    fill
                    className="object-contain drop-shadow-2xl relative z-10 py-2"
                  />
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight">
                  {fixture.homeTeam}
                </h3>
                <p className="text-sky-400 font-bold tracking-widest text-sm">HOME</p>
              </div>

              {/* VS / Timer */}
              <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl z-20 mb-8">
                  <span className="text-2xl md:text-3xl font-black text-slate-200 italic">VS</span>
                </div>

                {/* Countdown */}
                <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-2xl bg-slate-950/50 border border-white/5 backdrop-blur-sm">
                  <TimeUnit value={timeLeft.days} label="DAYS" />
                  <div className="text-2xl md:text-3xl font-light text-slate-600 pb-4">:</div>
                  <TimeUnit value={timeLeft.hours} label="HRS" />
                  <div className="text-2xl md:text-3xl font-light text-slate-600 pb-4">:</div>
                  <TimeUnit value={timeLeft.minutes} label="MINS" />
                  <div className="text-2xl md:text-3xl font-light text-slate-600 pb-4">:</div>
                  <TimeUnit value={timeLeft.seconds} label="SECS" />
                </div>
              </div>

              {/* Away Team */}
              <div className="flex-1 text-center md:text-left group/away">
                <div className="relative w-28 h-28 md:w-40 md:h-40 mx-auto md:mr-auto md:ml-0 mb-6 transition-transform duration-300 group-hover/away:scale-110">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl group-hover/away:bg-indigo-500/30 transition-colors"></div>
                  <Image
                    src={fixture.awayTeamLogo || '/placeholder-team.png'}
                    alt={fixture.awayTeam}
                    fill
                    className="object-contain drop-shadow-2xl relative z-10 py-2"
                  />
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight">
                  {fixture.awayTeam}
                </h3>
                <p className="text-indigo-400 font-bold tracking-widest text-sm">AWAY</p>
              </div>

            </div>

            {/* Stadium / Location */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 text-slate-400 mb-8">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium tracking-wide uppercase">
                  {fixture.venue || 'Home Ground'}
                </span>
              </div>

              <Link
                href={`/fixtures/${fixture.id}`}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-slate-950 font-bold text-lg rounded-full overflow-hidden transition-all hover:bg-sky-50 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  MATCH CENTER
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
    <span className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tabular-nums leading-none mb-2">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-[10px] md:text-xs font-bold text-slate-500 tracking-[0.2em]">
      {label}
    </span>
  </div>
);

export default NextFixtureSection;
