'use client';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Calendar, MapPin, ArrowLeft, Save, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreateFixturePage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard/admin/fixtures');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard/admin/fixtures" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Cancel Schedule
        </Link>

        <header className="mb-12">
          <div className="bg-[#2F4F4F] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
            <Trophy className="w-8 h-8 text-[#87CEEB]" />
          </div>
          <h1 className="text-4xl text-[#2F4F4F] font-black uppercase tracking-tight">Schedule Fixture</h1>
          <p className="text-gray-500 text-sm mt-2">Initialize a new match event in the Gladiators calendar.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Opponent Team</label>
                <input type="text" required placeholder="e.g. Kano Pillars" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border focus:border-[#87CEEB] outline-none font-bold" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Match Venue</label>
                <div className="relative">
                   <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                   <input type="text" required placeholder="Stadium Name" className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border focus:border-[#87CEEB] outline-none font-bold" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Competition</label>
                <select required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border focus:border-[#87CEEB] outline-none font-bold">
                   <option>National League</option>
                   <option>FA Cup</option>
                   <option>Pre-Season Friendly</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kick-off Date/Time</label>
                <input type="datetime-local" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border focus:border-[#87CEEB] outline-none font-bold" />
             </div>
          </div>

          <button type="submit" className="w-full sky-button py-5 uppercase tracking-[0.2em] flex items-center justify-center">
             <span>INITIALIZE FIXTURE</span>
             <Save className="w-5 h-5 ml-3" />
          </button>
        </form>
      </div>
    </div>
  );
}