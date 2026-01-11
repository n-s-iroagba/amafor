'use client';
import React from 'react';
import { MOCK_FIXTURES } from '../../../../constants';
import { Calendar, Trophy, MapPin, Edit3, CheckCircle, Clock, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function FixturesAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/admin" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Central Command
        </Link>

        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl text-[#2F4F4F] mb-2 uppercase tracking-tight">Fixtures & Results (ADM-06)</h1>
            <p className="text-gray-500 text-sm">Schedule upcoming matches, manage venues, and update final results.</p>
          </div>
          <button className="sky-button flex items-center space-x-2 py-4">
            <Plus className="w-5 h-5" />
            <span>CREATE FIXTURE</span>
          </button>
        </header>

        <div className="space-y-6">
          {MOCK_FIXTURES.map(fixture => (
            <div key={fixture.id} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center gap-12 group hover:shadow-xl transition-all">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 items-center gap-8 text-center md:text-left">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Home Team</div>
                  <div className="text-2xl font-black text-[#2F4F4F] uppercase">{fixture.homeTeam}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl text-[10px] font-black text-gray-400 uppercase mb-4">VS</div>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl flex items-center justify-center text-2xl font-black text-[#2F4F4F]">{fixture.homeScore || 0}</div>
                    <span className="text-2xl font-black text-gray-200">-</span>
                    <div className="w-16 h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl flex items-center justify-center text-2xl font-black text-[#2F4F4F]">{fixture.awayScore || 0}</div>
                  </div>
                </div>
                <div className="space-y-1 text-center md:text-right">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Away Team</div>
                  <div className="text-2xl font-black text-[#2F4F4F] uppercase">{fixture.awayTeam}</div>
                </div>
              </div>

              <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-gray-100 pt-8 lg:pt-0 lg:pl-12 space-y-4">
                <div className="flex items-center text-xs font-bold text-gray-500">
                  <Calendar className="w-4 h-4 mr-3 text-[#87CEEB]" />
                  {new Date(fixture.matchDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-xs font-bold text-gray-500">
                  <Trophy className="w-4 h-4 mr-3 text-[#87CEEB]" />
                  {fixture.competition}
                </div>
                <div className="flex items-center text-xs font-bold text-gray-500">
                  <MapPin className="w-4 h-4 mr-3 text-[#87CEEB]" />
                  {fixture.venue}
                </div>
                <Link 
                  href={`/dashboard/admin/fixtures/${fixture.id}`}
                  className="w-full mt-4 py-4 bg-[#2F4F4F] text-[#87CEEB] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center hover:bg-[#87CEEB] hover:text-[#2F4F4F] transition-all"
                >
                  <Edit3 className="w-4 h-4 mr-2" /> MANAGE MATCH DATA
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}