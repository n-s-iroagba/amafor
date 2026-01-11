import React from 'react';
import { MOCK_PLAYERS } from '../../constants';
// Added Shield to the lucide-react import list
import { Filter, Search, ChevronRight, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PlayersPage() {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl text-[#2F4F4F] mb-2 font-black uppercase tracking-tighter">SQUAD ROSTER</h1>
            <p className="text-gray-500 text-sm font-medium">Discover the talent of the Gladiators first team.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search players..." 
                className="pl-10 pr-4 py-2.5 border rounded-full focus:outline-none focus:border-[#87CEEB] bg-white text-sm"
              />
            </div>
            <button className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full border text-xs font-black text-gray-500 hover:border-[#87CEEB] transition-all">
              <Filter className="w-4 h-4" />
              <span>FILTER</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PLAYERS.map((player) => (
            <div key={player.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-[#87CEEB]/30 flex flex-col h-full">
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
                <img src={player.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={player.name} />
                <div className="absolute top-6 left-6 bg-[#2F4F4F] text-[#87CEEB] w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">
                  {player.squadNumber}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#2F4F4F] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity"></div>
              </div>
              <div className="p-8 text-center flex-grow flex flex-col">
                <div className="text-[#87CEEB] font-black text-[10px] uppercase tracking-[0.2em] mb-2">{player.position}</div>
                <h3 className="text-2xl mb-6 font-black uppercase tracking-tight">{player.name}</h3>
                <div className="flex justify-center space-x-8 text-xs text-gray-400 mb-8 font-bold">
                  <div><span className="font-black text-[#2F4F4F]">{player.age}</span> YRS</div>
                  <div><span className="font-black text-[#2F4F4F]">{player.height}</span> M</div>
                </div>
                <Link 
                  href={`/players/${player.id}`}
                  className="w-full bg-gray-50 text-[#2F4F4F] font-black py-4 rounded-2xl hover:bg-[#87CEEB] hover:text-[#2F4F4F] transition-all flex items-center justify-center group-hover:shadow-lg text-[10px] uppercase tracking-widest mt-auto"
                >
                  VIEW FULL STATS <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Scout Promotion Banner */}
        <div className="mt-20 gladiator-gradient rounded-[3.5rem] p-16 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
          <Shield className="absolute -right-8 -bottom-8 w-64 h-64 text-white/5" />
          <div className="mb-8 md:mb-0 relative z-10 max-w-xl">
            <h2 className="text-4xl mb-6 font-black tracking-tight uppercase">ARE YOU A SCOUT?</h2>
            <p className="text-gray-400 leading-relaxed font-medium">
              Get access to detailed match data, player performance analytics, and private scout reports by registering your professional account.
            </p>
          </div>
          <Link href="/register?type=scout" className="sky-button text-lg px-12 py-5 relative z-10 uppercase tracking-widest">REGISTER AS SCOUT</Link>
        </div>
      </div>
    </div>
  );
}