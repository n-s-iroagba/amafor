'use client';
import React from 'react';
import { MOCK_PATRONS } from '../../../../constants';
import { Heart, Star, Award, Shield, Plus, Filter, Search, ArrowLeft, Download, UserPlus, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function PatronAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/admin" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Central Command
        </Link>

        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <div className="bg-[#2F4F4F] p-3 rounded-2xl">
                <Heart className="w-6 h-6 text-[#87CEEB]" />
              </div>
              <h1 className="text-4xl text-[#2F4F4F] uppercase tracking-tight">Patronage Program (ADM-10)</h1>
            </div>
            <p className="text-gray-500 text-sm">Oversee all club patrons, manage wall recognition, and record offline legacy donations.</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-white px-6 py-4 rounded-2xl border text-[10px] font-black text-[#2F4F4F] hover:border-[#87CEEB] transition-all uppercase tracking-widest">
              FINANCIAL RECONCILIATION
            </button>
            <button className="sky-button flex items-center space-x-2 py-4">
              <UserPlus className="w-5 h-5" />
              <span>ADD MANUAL PATRON</span>
            </button>
          </div>
        </header>

        {/* Tier Distribution Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Legends', count: 12, color: 'bg-[#2F4F4F]', text: 'text-[#87CEEB]' },
            { label: 'Advocates', count: 42, color: 'bg-[#87CEEB]', text: 'text-[#2F4F4F]' },
            { label: 'Patrons', count: 84, color: 'bg-white', text: 'text-[#2F4F4F]' },
            { label: 'Donors', count: 412, color: 'bg-gray-100', text: 'text-gray-500' }
          ].map((tier, i) => (
            <div key={i} className={`${tier.color} p-8 rounded-[2.5rem] shadow-sm border border-gray-100`}>
              <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${tier.text}`}>{tier.label}</div>
              <div className={`text-4xl font-black ${tier.text}`}>{tier.count}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-12 flex flex-wrap items-center gap-8 border border-gray-100">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search by name, company, or message..." className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#87CEEB] text-sm" />
          </div>
          <div className="flex items-center space-x-3">
             <Filter className="w-4 h-4 text-gray-400" />
             <select className="bg-gray-50 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#2F4F4F] border-none outline-none">
                <option>Active Patrons</option>
                <option>Pending Verification</option>
                <option>Historical</option>
             </select>
          </div>
        </div>

        {/* Patrons Table */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#2F4F4F] text-[#87CEEB]">
              <tr className="text-[10px] font-black uppercase tracking-widest">
                <th className="px-10 py-6">Entity Identity</th>
                <th className="px-10 py-6">Tier Level</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6">Recognition</th>
                <th className="px-10 py-6 text-right">Commitment</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_PATRONS.map(patron => (
                <tr key={patron.id} className="group hover:bg-gray-50 transition-colors text-sm">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#87CEEB]/20">
                        <img src={patron.isCorporate ? patron.logoUrl : patron.portraitUrl} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-black text-[#2F4F4F] uppercase tracking-tight">{patron.name}</div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase">{patron.isCorporate ? 'Corporate Entity' : 'Individual'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-2">
                      <Star className="w-3.5 h-3.5 text-[#87CEEB]" />
                      <span className="font-black uppercase tracking-widest text-[10px] text-[#2F4F4F]">{patron.tier}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest">Active</span>
                  </td>
                  <td className="px-10 py-8 text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {patron.displayName}
                  </td>
                  <td className="px-10 py-8 text-right font-black text-[#2F4F4F]">
                    ₦{patron.tier === 'Legend' ? '50,000' : '25,000'}/mo
                  </td>
                  <td className="px-10 py-8 text-right">
                    <Link href={`/dashboard/admin/patrons/${patron.id}`} className="p-3 text-gray-300 hover:text-[#87CEEB] hover:bg-[#87CEEB]/10 rounded-xl transition-all inline-block">
                      <Edit2 className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}