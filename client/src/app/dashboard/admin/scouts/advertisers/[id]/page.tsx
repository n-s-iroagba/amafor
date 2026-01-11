'use client';
import React from 'react';
import { ArrowLeft, CheckCircle, XCircle, ShieldAlert, Briefcase, ExternalLink, BadgeCheck, FileText, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AdvertiserReviewDetail({ params }: { params: { id: string } }) {
  const company = {
    id: params.id,
    name: 'Zenith Sports Retail',
    contact: 'Ifeanyi Okafor',
    industry: 'Retail / Apparel',
    website: 'zenithsports.ng',
    registered: 'CAC-2023-9921',
    status: 'Pending Review'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/admin/scouts/advertisers" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Queue
        </Link>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-[2rem] bg-[#87CEEB]/10 text-[#2F4F4F] flex items-center justify-center font-black text-3xl shadow-inner border border-[#87CEEB]/20">
              {company.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl text-[#2F4F4F] font-black uppercase tracking-tight">{company.name}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-[10px] font-black text-[#87CEEB] uppercase tracking-widest bg-[#2F4F4F] px-3 py-1 rounded-full">
                  CORPORATE ENTITY
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{company.industry}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
             <button className="bg-white border-2 border-red-100 text-red-500 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all flex items-center">
                <XCircle className="w-4 h-4 mr-2" /> DENY
             </button>
             <button className="sky-button flex items-center space-x-3 py-4 px-10">
                <BadgeCheck className="w-5 h-5" />
                <span>AUTHORIZE</span>
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
               <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-10 flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-[#87CEEB]" /> Legal Registration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div>
                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-2">CAC Number</label>
                    <div className="font-mono text-lg font-black text-[#2F4F4F]">{company.registered}</div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-2">Lead Contact</label>
                    <div className="font-bold text-[#2F4F4F]">{company.contact}</div>
                 </div>
              </div>
            </section>

            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
               <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-10 flex items-center">
                <Globe className="w-4 h-4 mr-2 text-[#87CEEB]" /> Digital Domain
              </h2>
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                 <div className="flex items-center">
                    <Globe className="w-5 h-5 text-[#87CEEB] mr-4" />
                    <span className="font-bold text-[#2F4F4F]">{company.website}</span>
                 </div>
                 <button className="text-[10px] font-black text-[#87CEEB] uppercase tracking-widest hover:underline flex items-center">
                    VERIFY DOMAIN <ExternalLink className="w-3 h-3 ml-1.5" />
                 </button>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
               <ShieldAlert className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
               <h3 className="text-lg font-black mb-6 uppercase tracking-tight text-red-400">Risk Assessment</h3>
               <p className="text-xs text-gray-400 leading-relaxed mb-8 uppercase font-bold">
                 Audit current campaigns for sector conflicts. Zenith is registered in Retail (Approved Category).
               </p>
               <div className="flex items-center space-x-3 text-[10px] font-black text-green-500 uppercase tracking-widest">
                 <FileText className="w-4 h-4" /> <span>Documents Verified</span>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}