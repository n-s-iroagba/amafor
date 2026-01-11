'use client';
import React, { useState } from 'react';
import { MOCK_PLAYERS } from '../../../../constants';
// Added ShieldCheck to the lucide-react import list to resolve the "Cannot find name 'ShieldCheck'" error
import { Shield, ArrowLeft, Save, UserCheck, Activity, Award, Calendar, Database, AlertCircle, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function AdminPlayerEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const player = MOCK_PLAYERS.find(p => p.id === id) || MOCK_PLAYERS[0];
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCommit = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/dashboard/admin/players');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {showToast && (
        <div className="fixed top-24 right-8 bg-[#2F4F4F] text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center space-x-3 border-l-4 border-[#87CEEB] animate-in slide-in-from-right-10 duration-500">
          <CheckCircle className="w-5 h-5 text-[#87CEEB]" />
          <span className="text-xs font-black uppercase tracking-widest">Roster Record Authenticated</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <Link to="/dashboard/admin/players" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Roster
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-gray-200">
              <img src={player.imageUrl} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-4xl text-[#2F4F4F] font-black uppercase tracking-tight">{player.name}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-[10px] font-black text-[#87CEEB] uppercase tracking-[0.2em]">Profile ID: {player.id}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center">
                  <UserCheck className="w-3.5 h-3.5 mr-1" /> VERIFIED STATUS
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleCommit}
            disabled={isSaving}
            className="sky-button flex items-center space-x-3 py-5 px-10 disabled:opacity-50 shadow-xl"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{isSaving ? 'COMMITTING DATA...' : 'COMMIT UPDATES'}</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-10 flex items-center">
                <Database className="w-4 h-4 mr-2 text-[#87CEEB]" /> Bio-Data Verification
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#2F4F4F] uppercase tracking-widest">Squad Number</label>
                  <input type="number" defaultValue={player.squadNumber} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border outline-none font-bold focus:border-[#87CEEB]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#2F4F4F] uppercase tracking-widest">Primary Position</label>
                  <select defaultValue={player.position} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border outline-none font-bold focus:border-[#87CEEB] appearance-none">
                    <option value="GK">Goalkeeper (GK)</option>
                    <option value="DF">Defender (DF)</option>
                    <option value="MF">Midfielder (MF)</option>
                    <option value="FW">Forward (FW)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#2F4F4F] uppercase tracking-widest">Verified Age (Medical)</label>
                  <input type="number" defaultValue={player.age} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border outline-none font-bold focus:border-[#87CEEB]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#2F4F4F] uppercase tracking-widest">Height (Metric)</label>
                  <input type="number" step="0.01" defaultValue={player.height} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border outline-none font-bold focus:border-[#87CEEB]" />
                </div>
              </form>
            </section>

            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-10 flex items-center">
                <Award className="w-4 h-4 mr-2 text-amber-500" /> Contractual Eligibility
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-[#87CEEB]/20 transition-all cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-[#2F4F4F]">Academy Scholarship Holder</div>
                    <div className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Valid through July 2026</div>
                  </div>
                  <div className="w-12 h-6 bg-green-500 rounded-full p-1 relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <Shield className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
               <h3 className="text-lg font-black mb-6 uppercase tracking-tight text-[#87CEEB]">ISO Data Integrity</h3>
               <p className="text-xs text-gray-400 leading-relaxed mb-10 font-bold uppercase tracking-tight">
                 Modification of restricted player metrics triggers an audit trail entry (ADM-LOG-04). Ensure physical medical clearance is on file for height/age reconciliation.
               </p>
               <div className="flex items-center space-x-3 text-[10px] font-black text-[#87CEEB] uppercase tracking-widest bg-white/5 p-4 rounded-xl border border-white/5">
                 <ShieldCheck className="w-4 h-4 text-green-500" /> <span>ISO 27001 AUDIT ACTIVE</span>
               </div>
            </div>

            <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-none" />
              <p className="text-[10px] text-amber-800 font-bold uppercase leading-relaxed">
                Bio-data updates will force a background reconciliation for all active professional scout dossiers.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}