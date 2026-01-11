
'use client';
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, ShieldAlert, Globe, ExternalLink, UserCheck, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function ScoutApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState<'approving' | 'rejecting' | null>(null);

  const applicant = {
    id: id,
    name: 'Babatunde Olumide',
    agency: 'Lagos Talent Lab',
    reason: 'Seeking U17 midfielders for European trials in the upcoming summer window.',
    linkedIn: 'linkedin.com/in/btunde',
    location: 'Lagos, Nigeria',
    experience: '12 Years Pro Scouting',
    status: 'Pending Review'
  };

  const handleAction = (type: 'approving' | 'rejecting') => {
    setProcessing(type);
    setTimeout(() => {
      setProcessing(null);
      navigate('/dashboard/admin/scouts');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard/admin/scouts" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Queue
        </Link>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-[2rem] bg-[#2F4F4F] text-[#87CEEB] flex items-center justify-center font-black text-3xl shadow-xl">
              {applicant.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl text-[#2F4F4F] font-black uppercase tracking-tight">{applicant.name}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  {applicant.status}
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{applicant.agency}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
             <button 
               onClick={() => handleAction('rejecting')}
               disabled={!!processing}
               className="bg-white border-2 border-red-100 text-red-500 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all flex items-center disabled:opacity-50"
             >
                {processing === 'rejecting' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                REJECT
             </button>
             <button 
               onClick={() => handleAction('approving')}
               disabled={!!processing}
               className="sky-button flex items-center space-x-3 py-4 px-10 disabled:opacity-50"
             >
                {processing === 'approving' ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                <span>{processing === 'approving' ? 'GRANTING ACCESS...' : 'APPROVE ACCESS'}</span>
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
               <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-10 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-[#87CEEB]" /> Professional Dossier
              </h2>
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-2">Statement of Intent</label>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-gray-100 pl-6">
                    "{applicant.reason}"
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div>
                     <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-2">Experience</label>
                     <div className="font-bold text-[#2F4F4F]">{applicant.experience}</div>
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-2">Location</label>
                     <div className="font-bold text-[#2F4F4F]">{applicant.location}</div>
                   </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
               <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-10 flex items-center">
                <Globe className="w-4 h-4 mr-2 text-[#87CEEB]" /> Verification Links
              </h2>
              <Link to="#" className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all group">
                <div className="flex items-center">
                   <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm mr-4">
                     <Globe className="w-5 h-5 text-blue-500" />
                   </div>
                   <span className="font-bold text-[#2F4F4F]">{applicant.linkedIn}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#87CEEB]" />
              </Link>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
               <ShieldAlert className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
               <h3 className="text-lg font-black mb-6 uppercase tracking-tight text-[#87CEEB]">ISO Review</h3>
               <p className="text-xs text-gray-400 leading-relaxed mb-8">
                 Ensure the applicant agency matches our verified partner list. Approving grants access to restricted player biological data and performance videos.
               </p>
               <div className="flex items-center space-x-3 text-[10px] font-black text-green-500 uppercase tracking-widest">
                 <UserCheck className="w-4 h-4" /> <span>KYC Check Passed</span>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
