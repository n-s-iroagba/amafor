'use client';
import React, { useState } from 'react';
import { UserCheck, XCircle, CheckCircle, Info, ArrowLeft, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ScoutVerificationQueue() {
  const [applications, setApplications] = useState([
    { id: 'app1', name: 'Babatunde Olumide', agency: 'Lagos Talent Lab', reason: 'Seeking U17 midfielders for European trials.', linkedIn: 'linkedin.com/in/btunde', date: '2024-05-19' },
    { id: 'app2', name: 'Sarah Connor', agency: 'Global Football Agency', reason: 'Interested in academy defensive stats.', linkedIn: 'linkedin.com/in/sconnor', date: '2024-05-18' },
  ]);

  const handleAction = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard/admin" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Dashboard
        </Link>

        <header className="mb-12">
          <div className="flex items-center space-x-4 mb-2">
            <UserCheck className="w-6 h-6 text-[#87CEEB]" />
            <h1 className="text-4xl text-[#2F4F4F] uppercase tracking-tight">Scout Verification Queue (ADM-03)</h1>
          </div>
          <p className="text-gray-500 text-sm">Review applications for professional scout access. All approvals are logged for ISO compliance.</p>
        </header>

        <div className="space-y-6">
          {applications.map(app => (
            <div key={app.id} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-12 transition-all hover:shadow-xl group">
              <div className="flex-1 space-y-8">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center text-[#2F4F4F] font-black text-3xl shadow-inner border border-gray-100 group-hover:bg-[#87CEEB]/10 transition-colors">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#2F4F4F] uppercase tracking-tight">{app.name}</h3>
                    <div className="flex items-center text-sm text-[#87CEEB] font-black uppercase tracking-widest">
                      {app.agency}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Professional Bio / Reason</h4>
                    <p className="text-sm text-gray-500 leading-relaxed italic border-l-4 border-gray-100 pl-4 line-clamp-2">"{app.reason}"</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Verification Links</h4>
                    <a href="#" className="flex items-center text-xs font-bold text-[#2F4F4F] hover:text-[#87CEEB] transition-colors">
                      <ExternalLink className="w-4 h-4 mr-2" /> {app.linkedIn}
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:w-80 flex flex-col justify-center space-y-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-8 lg:pt-0 lg:pl-12">
                <Link to={`/dashboard/admin/scouts/${app.id}`} className="w-full py-4 bg-[#2F4F4F] text-[#87CEEB] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center hover:bg-[#87CEEB] hover:text-[#2F4F4F] transition-all">
                  VIEW FULL DOSSIER <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => handleAction(app.id)} className="py-4 bg-green-50 text-green-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all">APPROVE</button>
                   <button onClick={() => handleAction(app.id)} className="py-4 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">REJECT</button>
                </div>
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
               <ShieldCheck className="w-16 h-16 text-gray-200 mx-auto mb-6" />
               <h3 className="text-xl text-gray-300 font-black uppercase tracking-widest">Queue is currently clear</h3>
               <button onClick={() => window.location.reload()} className="mt-8 text-[#87CEEB] font-black text-[10px] uppercase tracking-widest hover:underline">Refresh List</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}