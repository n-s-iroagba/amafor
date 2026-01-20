
'use client';

import { Play, Clock, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';


export default function FixtureArchivesLibrary() {
  const archives = [

  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/scout" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Dashboard
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl text-[#2F4F4F] mb-2 uppercase tracking-tight">Fixture Video Archive</h1>
          <p className="text-gray-500 text-sm">Exclusive full-fixture coverage for professional scouting analysis.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {archives.map((match, i) => (
            <div key={match.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-[#87CEEB]/20">
              <div className="aspect-video relative overflow-hidden bg-[#2F4F4F]">
                {match.status === 'available' ? (
                  <>
                    <img src={`https://picsum.photos/seed/${match.id}/600/400`} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
                    <Link href={`/dashboard/scout/matches/${match.id}`} className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-[#87CEEB] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-[#2F4F4F] ml-1" />
                      </div>
                    </Link>
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] text-white font-black tracking-widest">
                      {match.duration}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-12 h-12 border-4 border-[#87CEEB]/20 border-t-[#87CEEB] rounded-full animate-spin mb-4" />
                    <h4 className="text-[#87CEEB] text-xs font-black tracking-[0.2em] mb-2">PROCESSING ARCHIVE</h4>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Available within 30 mins</p>
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#87CEEB]/10 text-[#87CEEB] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{match.competition}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${match.status === 'available' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {match.status}
                  </span>
                </div>
                <h3 className="text-xl text-[#2F4F4F] mb-6 font-bold">{match.homeTeam} vs {match.awayTeam}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5 mr-2 text-gray-300" />
                    {new Date(match.matchDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <Shield className="w-3.5 h-3.5 mr-2 text-gray-300" />
                    {match.quality} Quality
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Notice */}
        <div className="mt-20 bg-[#2F4F4F] p-12 rounded-[3rem] text-white relative overflow-hidden">
          <Shield className="absolute -right-12 -bottom-12 w-64 h-64 text-white/5" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl mb-4 font-black tracking-tight uppercase">ISO 27001 Audited Media</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              All fixture archives are verified for data integrity. Access is restricted to professional scouts and club officials. Automated logging is active for all playback sessions.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-[10px] font-black tracking-widest text-[#87CEEB]">
                <Shield className="w-4 h-4" /> 256-BIT ENCRYPTION
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-black tracking-widest text-[#87CEEB]">
                <Clock className="w-4 h-4" /> IMMUTABLE ACCESS LOGS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
