'use client';
import React, { useState } from 'react';
import { User, Mail, Shield, ArrowLeft, Save, Bell, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function FanProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {showToast && (
        <div className="fixed top-24 right-8 bg-[#2F4F4F] text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center space-x-3 border-l-4 border-[#87CEEB] animate-in slide-in-from-right-10 duration-500">
          <CheckCircle className="w-5 h-5 text-[#87CEEB]" />
          <span className="text-xs font-black uppercase tracking-widest">Profile Saved & Sync'd</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/fan" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Dashboard
        </Link>

        <header className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-[#2F4F4F] p-3 rounded-2xl shadow-xl">
              <User className="w-8 h-8 text-[#87CEEB]" />
            </div>
            <h1 className="text-4xl text-[#2F4F4F] uppercase tracking-tighter font-black">PROFILE SETTINGS</h1>
          </div>
          <p className="text-gray-500 text-sm">Manage your personal data and security preferences under ISO 27001 protocols.</p>
        </header>

        <div className="space-y-8">
          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-10 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-[#87CEEB]" /> Identity Information
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest">First Name</label>
                <input type="text" defaultValue="Chinedu" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border focus:border-[#87CEEB] outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest">Last Name</label>
                <input type="text" defaultValue="Okafor" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border focus:border-[#87CEEB] outline-none font-bold" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input type="email" defaultValue="chinedu.o@gladiators.ng" className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border focus:border-[#87CEEB] outline-none font-bold" />
                </div>
              </div>
            </form>
          </section>

          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-10 flex items-center">
              <Bell className="w-4 h-4 mr-2 text-blue-500" /> Notifications
            </h2>
            <div className="space-y-6">
              {[
                { label: 'Match Day Alerts', desc: 'Receive kick-off and score notifications.' },
                { label: 'Exclusive Offers', desc: 'Partner discounts and merchandise early access.' },
                { label: 'Academy Reports', desc: 'Monthly updates on academy development pathway.' }
              ].map((opt, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div>
                    <div className="text-sm font-bold text-[#2F4F4F]">{opt.label}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{opt.desc}</div>
                  </div>
                  <button className="w-12 h-6 bg-[#87CEEB] rounded-full p-1 relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end pt-8">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="sky-button px-12 py-5 text-sm uppercase tracking-[0.2em] flex items-center group shadow-2xl shadow-[#87CEEB]/20 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />}
              <span>{isSaving ? 'PERSISTING DATA...' : 'SAVE PROFILE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}