'use client';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Send, MessageSquare, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreateDisputePage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard/advertiser/disputes');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/dashboard/advertiser/disputes" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Cancel Dispute
        </Link>

        <header className="mb-12">
          <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl text-[#2F4F4F] font-black uppercase tracking-tight">Open Dispute</h1>
          <p className="text-gray-500 text-sm mt-2">Report reporting discrepancies or payment issues for manual review.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100 space-y-8">
          <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Campaign</label>
             <select required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border focus:border-[#87CEEB] outline-none font-bold">
                <option>Summer Kit Launch</option>
                <option>Academy Scholarship Drive</option>
             </select>
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dispute Subject</label>
             <input type="text" required placeholder="e.g. Impression count mismatch" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border focus:border-[#87CEEB] outline-none font-bold" />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detailed Description</label>
             <textarea required placeholder="Provide evidence or context for the discrepancy..." className="w-full px-6 py-4 bg-gray-50 rounded-2xl border focus:border-[#87CEEB] outline-none font-bold h-32 resize-none" />
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start space-x-4">
             <AlertCircle className="w-6 h-6 text-amber-600 flex-none" />
             <p className="text-[10px] text-amber-800 font-bold uppercase leading-relaxed">
               All disputes are manually reviewed by the Commercial Lead. Expect a technical response within 24-48 business hours.
             </p>
          </div>

          <button type="submit" className="w-full sky-button py-5 uppercase tracking-[0.2em] flex items-center justify-center">
             <span>FILE FORMAL DISPUTE</span>
             <Send className="w-5 h-5 ml-3" />
          </button>
        </form>
      </div>
    </div>
  );
}