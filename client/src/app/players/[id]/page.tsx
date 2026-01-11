
import React from 'react';
import { MOCK_PLAYERS } from '../../../constants';
import { Shield, ArrowLeft, Download, History, BarChart2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
// Added useParams from react-router-dom for SPA routing compatibility
import { useParams } from 'react-router-dom';

// Changed params to optional to resolve TS error in index.tsx
export default function PlayerDetailPage({ params }: { params?: { id: string } }) {
  const urlParams = useParams();
  const playerId = params?.id || urlParams.id;
  const player = MOCK_PLAYERS.find(p => p.id === playerId) || MOCK_PLAYERS[0];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Bar */}
      <div className="bg-[#2F4F4F] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/players" className="inline-flex items-center text-[#87CEEB] font-bold text-xs mb-8 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft className="w-4 h-4 mr-2" /> BACK TO ROSTER
          </Link>
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
            <div className="flex items-center space-x-8">
              <div className="text-8xl font-black text-[#87CEEB] opacity-50 select-none">#{player.squadNumber}</div>
              <div>
                <h1 className="text-5xl md:text-7xl mb-2">{player.name}</h1>
                <div className="flex items-center space-x-4">
                  <span className="bg-[#87CEEB] text-[#2F4F4F] px-4 py-1 rounded font-black text-sm uppercase tracking-widest">{player.position}</span>
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Verified Pro Profile</span>
                </div>
              </div>
            </div>
            <button className="sky-button flex items-center space-x-3">
              <Download className="w-4 h-4" />
              <span>GENERATE PDF SUMMARY</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Bio & Details */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl text-[#2F4F4F] mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-[#87CEEB]" /> BIOGRAPHICAL DATA
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 bg-gray-50 p-10 rounded-3xl">
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Age</div>
                  <div className="text-2xl font-bold">{player.age} Years</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Height</div>
                  <div className="text-2xl font-bold">{player.height}m</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nationality</div>
                  <div className="text-2xl font-bold">Nigeria</div>
                </div>
              </div>
              <p className="mt-10 text-gray-500 leading-relaxed">
                Elite potential demonstrated in domestic competitions. Known for exceptional tactical intelligence and physical durability. Registered with Amafor Gladiators Academy since 2021.
              </p>
            </section>

            {/* Audit Trail - FR1.1.4 */}
            <section className="bg-gray-50 rounded-3xl p-10 border-l-8 border-[#87CEEB]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl text-[#2F4F4F] font-black flex items-center uppercase tracking-tight">
                  <History className="w-5 h-5 mr-3 text-[#2F4F4F]" /> PRO VIEW: Data Integrity Log
                </h2>
                <div className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-gray-400 border uppercase">ISO 27001 Audited</div>
              </div>
              <div className="space-y-4">
                {[
                  { user: 'Data Steward (ID: 082)', action: 'Updated Performance Stats', time: '12 May 2024, 14:30' },
                  { user: 'Sports Admin (ID: 041)', action: 'Verified Physical Metrics', time: '01 May 2024, 09:12' },
                  { user: 'System', action: 'Created Profile Instance', time: '15 Jan 2024, 11:00' }
                ].map((log, i) => (
                  <div key={i} className="flex justify-between items-center text-xs border-b border-gray-200 pb-3">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-2 text-green-500" />
                      <span className="font-bold">{log.action}</span>
                      <span className="mx-2 text-gray-300">by</span>
                      <span className="text-gray-500 italic">{log.user}</span>
                    </div>
                    <div className="text-gray-400 font-mono">{log.time}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Image & Action */}
          <div>
            <div className="sticky top-32">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl mb-8 border-4 border-white">
                <img src={player.imageUrl} className="w-full h-full object-cover" alt={player.name} />
              </div>
              <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-xl">
                <h3 className="text-xl mb-4 font-black tracking-tight">SCOUT EVALUATION</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  Scouts can request full match footage and historical data exports for this player through the Pro Portal.
                </p>
                <Link href="/register?type=scout" className="w-full sky-button block text-center py-4">
                  REQUEST FULL DOSSIER
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
