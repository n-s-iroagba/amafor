'use client';
import React, { useState } from 'react';
import { DollarSign, ArrowLeft, Save, TrendingUp, HelpCircle, ShieldCheck, History, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdRateAdminPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [rates, setRates] = useState([
    { zone: 'Homepage Banner', id: 'hp', current: 5.00, scheduled: 5.50, effective: '2024-07-01' },
    { zone: 'Mid-Article Video', id: 'vid', current: 4.50, scheduled: 4.50, effective: '-' },
    { zone: 'Sidebar Square', id: 'side', current: 3.50, scheduled: 3.50, effective: '-' },
  ]);

  const handleCommit = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {showToast && (
        <div className="fixed top-24 right-8 bg-[#2F4F4F] text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center space-x-3 border-l-4 border-[#87CEEB] animate-in slide-in-from-right-10 duration-500">
          <CheckCircle className="w-5 h-5 text-[#87CEEB]" />
          <span className="text-xs font-black uppercase tracking-widest">Commercial Rates Updated</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        <Link to="/dashboard/admin" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Central Command
        </Link>

        <header className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-[#2F4F4F] p-3 rounded-2xl shadow-xl">
              <DollarSign className="w-8 h-8 text-[#87CEEB]" />
            </div>
            <h1 className="text-4xl text-[#2F4F4F] uppercase tracking-tighter font-black">Rate Configuration (ADM-09)</h1>
          </div>
          <p className="text-gray-500 text-sm">Control the Cost Per View (CPV) for all platform ad zones. Changes require 30-day notice per commercial terms.</p>
        </header>

        <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-10 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-xs font-black text-[#2F4F4F] uppercase tracking-widest">Active Monetization Slots</h3>
            <span className="text-[10px] font-black text-gray-400 uppercase bg-white px-4 py-1 rounded-full border border-gray-200">Currency: NGN</span>
          </div>
          
          <div className="divide-y divide-gray-50">
            {rates.map(rate => (
              <div key={rate.id} className="p-10 flex flex-col md:flex-row items-start md:items-center gap-12 group hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="text-xl font-black text-[#2F4F4F] uppercase mb-1 tracking-tight">{rate.zone}</h4>
                  <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Current Rate: <span className="text-[#2F4F4F] ml-2 font-black">₦{rate.current.toFixed(2)} / CPV</span>
                  </div>
                </div>
                
                <div className="w-full md:w-64">
                   <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Proposed CPV (NGN)</label>
                   <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#2F4F4F]">₦</span>
                     <input 
                       type="number" 
                       step="0.01"
                       defaultValue={rate.current} 
                       className="w-full pl-8 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#87CEEB] rounded-2xl font-black text-lg outline-none transition-all"
                     />
                   </div>
                </div>

                <div className="w-full md:w-48 text-center md:text-right">
                  <div className="text-[9px] font-black text-gray-300 uppercase mb-2">Effective From</div>
                  <div className="text-xs font-bold text-[#2F4F4F] uppercase tracking-tighter">{rate.effective === '-' ? 'No Change' : rate.effective}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-10 bg-[#2F4F4F] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start space-x-4 max-w-lg">
              <History className="w-6 h-6 text-[#87CEEB] flex-none mt-1" />
              <p className="text-[11px] text-gray-400 font-bold leading-relaxed uppercase">
                Submitting updates will notify all <span className="text-white">Active Advertisers</span> of the rate change. New rates will be locked for editing for 30 days after implementation.
              </p>
            </div>
            <button 
              onClick={handleCommit}
              disabled={isSaving}
              className="sky-button px-12 py-5 text-sm uppercase tracking-[0.2em] flex items-center group disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />}
              <span>{isSaving ? 'NOTIFYING PARTNERS...' : 'COMMIT RATE UPDATE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}