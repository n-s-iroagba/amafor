'use client';
import React, { useState } from 'react';
import { Settings, Shield, Globe, Lock, Sliders, Save, ArrowLeft, RefreshCw, Zap, Database } from 'lucide-react';
import Link from 'next/link';

export default function PlatformSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/dashboard/admin" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Central Command
        </Link>

        <header className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-[#2F4F4F] p-3 rounded-2xl shadow-xl">
              <Settings className="w-8 h-8 text-[#87CEEB]" />
            </div>
            <h1 className="text-4xl text-[#2F4F4F] uppercase tracking-tighter font-black">System Config (ADM-16)</h1>
          </div>
          <p className="text-gray-500 text-sm">Global ecosystem parameters. High-level changes are mirrored to the security audit trail.</p>
        </header>

        <div className="space-y-6">
          {/* Operations Section */}
          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-10 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-[#87CEEB]" /> Operational Controls
            </h3>
            
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div className="max-w-md">
                  <h4 className="text-lg font-black text-[#2F4F4F] uppercase tracking-tight">Maintenance Mode</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-bold uppercase mt-1">Restrict public access while performing core infrastructure updates.</p>
                </div>
                <button 
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`w-16 h-8 rounded-full p-1 transition-all duration-500 ${maintenanceMode ? 'bg-[#87CEEB]' : 'bg-gray-200'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 transform ${maintenanceMode ? 'translate-x-8' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-10">
                <div className="max-w-md">
                  <h4 className="text-lg font-black text-[#2F4F4F] uppercase tracking-tight">Scout Self-Registration</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-bold uppercase mt-1">Enable or disable the public onboarding path for professional scouts.</p>
                </div>
                <button className="w-16 h-8 bg-[#87CEEB] rounded-full p-1">
                  <div className="w-6 h-6 bg-white rounded-full translate-x-8" />
                </button>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-10 flex items-center">
              <Lock className="w-4 h-4 mr-2 text-red-500" /> Security Thresholds
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Rate Limit (Req/Min)</label>
                <input type="number" defaultValue={300} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-black text-lg focus:ring-2 focus:ring-[#87CEEB] outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Session Timeout (Mins)</label>
                <input type="number" defaultValue={60} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-black text-lg focus:ring-2 focus:ring-[#87CEEB] outline-none" />
              </div>
            </div>
          </section>

          {/* Integration Section */}
          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-10 flex items-center">
              <RefreshCw className="w-4 h-4 mr-2 text-green-500" /> External API Endpoints
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Paystack_Logo.png" className="h-4 object-contain opacity-50 grayscale" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest">Paystack Gateway</div>
                    <div className="text-[9px] font-bold text-gray-400 font-mono">LIVE_KEY_8820...</div>
                  </div>
                </div>
                <button className="text-[9px] font-black text-[#87CEEB] uppercase tracking-widest hover:underline">Rotate Key</button>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-8">
            <button className="sky-button px-12 py-5 text-sm uppercase tracking-[0.2em] flex items-center group shadow-2xl shadow-[#87CEEB]/20">
              <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              COMMIT CHANGES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
