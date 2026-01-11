'use client';
import React from 'react';
import { ShieldAlert, Search, Filter, ArrowLeft, MessageSquare, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdvertiserDisputeListPage() {
  const disputes = [
    { id: 'AG-DIS-882', subject: 'View Discrepancy (Summer Kit)', status: 'Investigation', opened: 'May 18, 2024', lastUpdate: '2h ago' },
    { id: 'AG-DIS-401', subject: 'Payment Verification Error', status: 'Resolved', opened: 'April 12, 2024', lastUpdate: '1 month ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard/advertiser" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Dashboard
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl text-[#2F4F4F] mb-2 uppercase tracking-tight font-black">Support & Disputes</h1>
            <p className="text-gray-500 text-sm">Review status and chat history for campaign discrepancy reports.</p>
          </div>
          <button className="sky-button flex items-center space-x-3 py-4">
            <AlertCircle className="w-5 h-5" />
            <span>OPEN NEW DISPUTE</span>
          </button>
        </header>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-8 border border-gray-100 flex flex-wrap items-center gap-8">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search by case ID or subject..." className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#87CEEB] text-sm" />
          </div>
          <div className="flex items-center space-x-3">
             <Filter className="w-4 h-4 text-gray-400" />
             <select className="bg-gray-50 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#2F4F4F] border-none outline-none">
                <option>All Disputes</option>
                <option>Active</option>
                <option>Resolved</option>
             </select>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#2F4F4F] text-[#87CEEB]">
              <tr className="text-[10px] font-black uppercase tracking-widest">
                <th className="px-10 py-6">Case Identity</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6">Opened On</th>
                <th className="px-10 py-6">Last Activity</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {disputes.map(d => (
                <tr key={d.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-10 py-8">
                    <div>
                      <div className="font-bold text-[#2F4F4F] text-lg mb-1 group-hover:text-[#87CEEB] transition-colors">{d.subject}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{d.id}</div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      d.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-xs font-bold text-gray-500 uppercase">{d.opened}</td>
                  <td className="px-10 py-8">
                    <div className="flex items-center text-xs font-black text-[#2F4F4F]">
                      <Clock className="w-3.5 h-3.5 mr-2 text-[#87CEEB]" /> {d.lastUpdate}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <Link href={`/dashboard/advertiser/disputes/${d.id}`} className="p-3 hover:bg-[#87CEEB]/10 rounded-xl transition-all inline-block group-hover:text-[#87CEEB]">
                      <MessageSquare className="w-5 h-5" />
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