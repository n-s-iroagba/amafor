'use client';
import React from 'react';
import { LayoutDashboard, Megaphone, PlusCircle, TrendingUp, Users, MousePointer2, ChevronRight, BarChart3, AlertCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function AdvertiserDashboard() {
  const stats = [
    { label: 'Active Campaigns', value: '3', icon: <Megaphone className="w-5 h-5" />, color: 'bg-blue-500' },
    { label: 'Total Impressions', value: '124.5K', icon: <Users className="w-5 h-5" />, color: 'bg-purple-500' },
    { label: 'Unique Views', value: '88.2K', icon: <MousePointer2 className="w-5 h-5" />, color: 'bg-green-500' },
    { label: 'Avg. CPV', value: '₦4.20', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-[#87CEEB]' },
  ];

  const recentCampaigns = [
    { id: 'c1', name: 'Summer Kit Launch', status: 'active', delivered: '45,200', target: '100,000', spend: '₦189,840' },
    { id: 'c2', name: 'Academy Scholarship Drive', status: 'paused', delivered: '12,400', target: '50,000', spend: '₦52,080' },
  ];

  const disputes = [
    { id: 'AG-DIS-882', subject: 'View Discrepancy', status: 'open', date: '2024-05-18' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-20 bg-[#2F4F4F] hidden lg:flex flex-col items-center py-8 space-y-8">
        <div className="bg-[#87CEEB] p-2 rounded-lg">
          <LayoutDashboard className="w-6 h-6 text-[#2F4F4F]" />
        </div>
        <div className="space-y-6">
          <Link href="/dashboard/advertiser/campaigns" className="p-3 text-white/50 hover:text-white block"><Megaphone className="w-6 h-6" /></Link>
          <Link href="/dashboard/advertiser/reports" className="p-3 text-white/50 hover:text-white block"><BarChart3 className="w-6 h-6" /></Link>
          <Link href="/dashboard/advertiser/disputes" className="p-3 text-white/50 hover:text-white block"><AlertCircle className="w-6 h-6" /></Link>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="text-[10px] font-black text-[#87CEEB] uppercase tracking-[0.3em] mb-2">Advertiser Self-Service Portal</div>
            <h1 className="text-4xl text-[#2F4F4F]">Fatima's Dashboard</h1>
          </div>
          <Link href="/dashboard/advertiser/campaigns/new" className="sky-button flex items-center space-x-3 py-4">
            <PlusCircle className="w-5 h-5" />
            <span>CREATE NEW CAMPAIGN</span>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl text-white ${stat.color}`}>{stat.icon}</div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-2xl font-black text-[#2F4F4F]">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest">Active Campaigns</h2>
                <Link href="/dashboard/advertiser/campaigns" className="text-xs font-bold text-[#87CEEB] hover:underline">View All</Link>
              </div>
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-8 py-4">Campaign Name</th>
                      <th className="px-8 py-4">Progress</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentCampaigns.map(c => (
                      <tr key={c.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6">
                          <Link href={`/dashboard/advertiser/campaigns/${c.id}`} className="font-bold text-[#2F4F4F] group-hover:text-[#87CEEB]">{c.name}</Link>
                        </td>
                        <td className="px-8 py-6">
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-2">
                            <div 
                              className="bg-[#87CEEB] h-full" 
                              style={{ width: `${(parseInt(c.delivered.replace(',','')) / parseInt(c.target.replace(',',''))) * 100}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{c.delivered} / {c.target} Views</div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            c.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-mono text-xs font-bold">{c.spend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest">Active Disputes</h2>
                <Link href="/dashboard/advertiser/disputes" className="text-xs font-bold text-[#87CEEB] hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {disputes.map(d => (
                  <div key={d.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-red-50 rounded-xl text-red-500">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#2F4F4F] uppercase">{d.id}: {d.subject}</div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Opened: {d.date}</div>
                      </div>
                    </div>
                    <Link href={`/dashboard/advertiser/disputes/${d.id}`} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <MessageSquare className="w-5 h-5 text-[#87CEEB]" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <Megaphone className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight text-[#87CEEB]">Optimization Tips</h3>
              <div className="space-y-6 relative z-10">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <h4 className="text-[10px] font-black text-[#87CEEB] mb-2 uppercase tracking-widest">Video Engagement</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">Mid-article video ads have 3x higher CTR when placed in "Match Report" tags.</p>
                </div>
              </div>
              <button className="w-full mt-8 py-4 bg-[#87CEEB] text-[#2F4F4F] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                DOWNLOAD SPECS GUIDE
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}