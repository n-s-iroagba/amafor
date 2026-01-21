'use client';
import React from 'react';
import { Megaphone, PlusCircle, ArrowLeft, Search, Filter, ChevronRight, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function AdvertiserCampaignsPage() {
  const campaigns = [
    { id: 'c1', name: 'Summer Kit Launch', status: 'active', zone: 'homepage_banner', delivered: 45200, target: 100000, spend: '₦189,840' },
    { id: 'c2', name: 'Academy Scholarship Drive', status: 'paused', zone: 'mid_article', delivered: 12400, target: 50000, spend: '₦52,080' },
    { id: 'c3', name: 'Q1 Partnership Drive', status: 'completed', zone: 'sidebar', delivered: 100000, target: 100000, spend: '₦350,000' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard/advertiser" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Overview
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl text-[#2F4F4F] mb-2 uppercase tracking-tight font-black">MY CAMPAIGNS</h1>
            <p className="text-gray-500 text-sm">Manage your commercial presence across the Gladiators ecosystem.</p>

            {/* BRD Requirement: DEV-08 Ad View Definition */}
            <div className="mt-4 flex items-center text-[10px] text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg w-fit">
              <span className="font-bold mr-1">NOTE:</span>
              Views are verified per BR-AD-07: ≥50% visible, ≥1 second duration, unique user/24h.
            </div>
          </div>
          <Link href="/dashboard/advertiser/campaigns/new" className="sky-button flex items-center space-x-3 py-4">
            <PlusCircle className="w-5 h-5" />
            <span>START NEW CAMPAIGN</span>
          </Link>
        </header>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-12 flex flex-wrap items-center gap-8 border border-gray-100">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search campaigns..." className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#87CEEB] text-sm" />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select className="bg-gray-50 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#2F4F4F] border-none outline-none">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Paused</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#2F4F4F] text-[#87CEEB]">
              <tr className="text-[10px] font-black uppercase tracking-widest">
                <th className="px-10 py-6">Campaign Info</th>
                <th className="px-10 py-6">Ad Zone</th>
                <th className="px-10 py-6">Delivery Progress</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Spend</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map(c => (
                <tr key={c.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-50 rounded-xl text-[#2F4F4F]">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[#2F4F4F] text-lg">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">{c.zone}</td>
                  <td className="px-10 py-8">
                    <div className="w-48">
                      <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase mb-2">
                        <span>{((c.delivered / c.target) * 100).toFixed(0)}%</span>
                        <span>{c.delivered.toLocaleString()} / {c.target.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#87CEEB] h-full" style={{ width: `${(c.delivered / c.target) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${c.status === 'active' ? 'bg-green-100 text-green-600' :
                        c.status === 'paused' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right font-mono font-bold text-[#2F4F4F]">{c.spend}</td>
                  <td className="px-10 py-8 text-right">
                    <Link href={`/dashboard/advertiser/campaigns/${c.id}`} className="p-3 hover:bg-[#87CEEB]/10 rounded-xl transition-all inline-block">
                      <BarChart3 className="w-5 h-5 text-gray-300 hover:text-[#87CEEB]" />
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