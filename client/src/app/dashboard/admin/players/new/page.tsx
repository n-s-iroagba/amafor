'use client';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Save, UserPlus, Database, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPlayerPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard/admin/players');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard/admin/players" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Roster
        </Link>

        <header className="mb-12">
          <div className="bg-[#2F4F4F] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
            <UserPlus className="w-8 h-8 text-[#87CEEB]" />
          </div>
          <h1 className="text-4xl text-[#2F4F4F] font-black uppercase tracking-tight">Talent Registration</h1>
          <p className="text-gray-500 text-sm mt-2">Create a new professional profile instance for a Gladiators first-team or academy player.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100">
               <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-10 flex items-center">
                <Database className="w-4 h-4 mr-3 text-[#87CEEB]" /> Player Bio-Data
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Legal Name</label>
                    <input type="text" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border focus:border-[#87CEEB] outline-none font-bold" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Position</label>
                    <select required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border focus:border-[#87CEEB] outline-none font-bold">
                       <option value="GK">Goalkeeper (GK)</option>
                       <option value="DF">Defender (DF)</option>
                       <option value="MF">Midfielder (MF)</option>
                       <option value="FW">Forward (FW)</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Squad Number</label>
                    <input type="number" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border focus:border-[#87CEEB] outline-none font-bold" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified Age</label>
                    <input type="number" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border focus:border-[#87CEEB] outline-none font-bold" />
                 </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
               <Shield className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
               <h3 className="text-lg font-black mb-6 uppercase tracking-tight text-[#87CEEB]">ISO-27001 ADM-04</h3>
               <p className="text-xs text-gray-400 leading-relaxed mb-10">
                 Adding a new player creates a restricted data record. Biological data must be verified against official medical clearance.
               </p>
               <button type="submit" className="w-full sky-button py-5 uppercase tracking-[0.2em] flex items-center justify-center">
                 <span>COMMENCE ONBOARDING</span>
                 <Save className="w-5 h-5 ml-3" />
               </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}