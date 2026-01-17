
'use client';
import React, { useState } from 'react';
import { Search, Filter, Download, ArrowLeft, Shield, UserCheck } from 'lucide-react';
import Link from 'next/link';


export default function ScoutPlayerDirectory() {
  const [filter, setFilter] = useState('ALL');
  const players =[]

  const filteredPlayers = filter === 'ALL' 
    ? players : players.filter(p => p.position === filter);

  const handleExport = () => {
    // PV-C02 State logic: Simulate CSV Export
    const headers = 'Name,Position,Age,Height,SquadNumber\n';
    const csv = players.map(p => `${p.name},${p.position},${p.age},${p.height},${p.jerseyNumber}`).join('\n');
    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AGFC_ProView_Talent_Export.csv';
    a.click();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard/scout" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Dashboard
        </Link>

        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl text-[#2F4F4F] mb-2">PRO TALENT DIRECTORY</h1>
            <p className="text-gray-500 text-sm">Access verified bio-data and performance tracking for the active roster.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleExport}
              className="flex items-center space-x-2 bg-white px-6 py-3 rounded-2xl border text-xs font-black text-[#2F4F4F] hover:border-[#87CEEB] shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT TO CSV</span>
            </button>
            <Link href="/dashboard/scout/matches" className="sky-button text-xs py-3.5 uppercase tracking-widest">
              VIEW MATCH ARCHIVE
            </Link>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm mb-12 flex flex-wrap items-center gap-6">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name, position, or squad number..."
              className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#87CEEB] text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            {['ALL', 'GK', 'DF', 'MF', 'FW'].map(pos => (
              <button
                key={pos}
                onClick={() => setFilter(pos)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                  filter === pos ? 'bg-[#2F4F4F] text-[#87CEEB]' : 'bg-gray-50 text-gray-400 hover:text-[#2F4F4F]'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Player Grid (PV-02) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPlayers.map(player => (
            <Link 
              href={`/dashboard/scout/players/${player.id}`} 
              key={player.id}
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-[#87CEEB]/30 relative"
            >
              <div className="absolute top-6 right-6 z-10">
                <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white/50">
                  <UserCheck className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                <img src={player.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-[#87CEEB] uppercase tracking-widest">{player.position}</span>
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">#{player.jerseyNumber}</span>
                </div>
                <h3 className="text-xl text-[#2F4F4F] mb-4 group-hover:text-[#87CEEB] transition-colors">{player.name}</h3>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase mb-1">Age</div>
                    <div className="text-sm font-bold">{player.age}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase mb-1">Height</div>
                    <div className="text-sm font-bold">{player.height}m</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
