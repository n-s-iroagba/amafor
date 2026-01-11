'use client';
import React, { useState } from 'react';
import { Heart, ShieldCheck, ArrowLeft, Save, Globe, MessageSquare, Award, History, Edit3, Loader2, CheckCircle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MOCK_PATRONS } from '../../../../constants';

export default function PatronManagementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patron = MOCK_PATRONS.find(p => p.id === id) || MOCK_PATRONS[0];
  const [isUpdating, setIsUpdating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/dashboard/admin/patrons');
      }, 1500);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {showToast && (
        <div className="fixed top-24 right-8 bg-[#2F4F4F] text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center space-x-3 border-l-4 border-[#87CEEB] animate-in slide-in-from-right-10 duration-500">
          <CheckCircle className="w-5 h-5 text-[#87CEEB]" />
          <span className="text-xs font-black uppercase tracking-widest">Patron Registry Synchronized</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard/admin/patrons" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Patronage Hub
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-gray-200">
              <img src={patron.isCorporate ? patron.logoUrl : patron.portraitUrl} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl text-[#2F4F4F] font-black uppercase tracking-tight">{patron.name}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-200">ACTIVE PATRON</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TIER: {patron.tier}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleUpdate}
            disabled={isUpdating}
            className="sky-button flex items-center space-x-3 py-5 px-10 disabled:opacity-50 shadow-xl"
          >
            {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{isUpdating ? 'SYNCING REGISTRY...' : 'UPDATE PATRON RECORD'}</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
               <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-10 flex items-center">
                <Globe className="w-4 h-4 mr-3 text-[#87CEEB]" /> Public Recognition (Supporter Wall)
              </h2>
              
              <form className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest">Display Name (Publicly Visible)</label>
                  <input type="text" defaultValue={patron.displayName} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-[#87CEEB] outline-none font-bold text-[#2F4F4F]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest">Public Legacy Message</label>
                  <textarea defaultValue={patron.message} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-[#87CEEB] outline-none font-bold text-[#2F4F4F] h-32 resize-none leading-relaxed" />
                </div>
              </form>
            </section>

            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
               <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-10 flex items-center">
                <History className="w-4 h-4 mr-3 text-amber-500" /> Settlement Integrity History
              </h2>
              <div className="space-y-4">
                 {[
                   { date: 'May 01, 2024', ref: 'PS_RECUR_8812', amount: '₦25,000', status: 'Success' },
                   { date: 'Apr 01, 2024', ref: 'PS_RECUR_4201', amount: '₦25,000', status: 'Success' },
                   { date: 'Mar 01, 2024', ref: 'PS_RECUR_1109', amount: '₦25,000', status: 'Success' }
                 ].map((tx, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                      <div>
                        <div className="text-xs font-black text-[#2F4F4F] uppercase tracking-widest">{tx.date}</div>
                        <div className="text-[9px] text-gray-400 font-mono mt-1">REF: {tx.ref}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-[#2F4F4F]">{tx.amount}</div>
                        <div className="text-[9px] text-green-500 font-black uppercase tracking-widest mt-1">{tx.status}</div>
                      </div>
                   </div>
                 ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <Heart className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
               <h3 className="text-lg font-black mb-6 uppercase tracking-tight text-[#87CEEB]">Active Commitment</h3>
               <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between text-xs font-bold border-b border-white/10 pb-4">
                    <span className="text-gray-400 uppercase tracking-widest">Next Renewal</span>
                    <span className="font-mono">JUNE 01, 2024</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold border-b border-white/10 pb-4">
                    <span className="text-gray-400 uppercase tracking-widest">Method</span>
                    <span className="uppercase">Paystack Card</span>
                  </div>
                  <button className="w-full py-4 bg-[#87CEEB] text-[#2F4F4F] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-lg">
                    MANUAL RECONCILE
                  </button>
               </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 flex items-start space-x-4 shadow-sm">
              <Award className="w-6 h-6 text-blue-600 flex-none" />
              <p className="text-[10px] text-blue-800 font-bold uppercase leading-relaxed">
                Legends and Sponsors have priority placement on the physical Arena Supporter Wall. Verify name spelling against official ID before bulk printing.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}