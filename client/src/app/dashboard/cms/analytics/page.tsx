'use client';
import React from 'react';
import { BarChart3, TrendingUp, Users, Clock, Globe, ArrowLeft, Download, Calendar, Filter } from 'lucide-react';
import Link from 'next/link';

export default function CMSAnalyticsPage() {
  const stats = [
    { label: 'Total Read Time', value: '45.2k Hours', trend: '+12%', icon: <Clock className="w-5 h-5" /> },
    { label: 'Avg. Completion', value: '68%', trend: '+4%', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Unique Readers', value: '892k', trend: '+18%', icon: <Users className="w-5 h-5" /> },
    { label: 'Global Reach', value: '142 Countries', trend: '+2', icon: <Globe className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard/cms" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Dashboard
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl text-[#2F4F4F] mb-2 uppercase tracking-tight font-black">EDITORIAL ANALYTICS</h1>
            <p className="text-gray-500 text-sm">Deep-dive engagement metrics for the Gladiators digital feed.</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-white px-6 py-4 rounded-2xl border text-[10px] font-black text-[#2F4F4F] hover:border-[#87CEEB] transition-all uppercase tracking-widest flex items-center">
              <Calendar className="w-4 h-4 mr-2" /> Custom Range
            </button>
            <button className="sky-button flex items-center space-x-3 py-4 text-[10px] tracking-widest">
              <Download className="w-4 h-4" />
              <span>EXPORT PDF REPORT</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-xl text-[#2F4F4F]">{stat.icon}</div>
                <div className="text-[10px] font-black text-green-500 uppercase">{stat.trend}</div>
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-2xl font-black text-[#2F4F4F]">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-12 flex items-center">
                <BarChart3 className="w-4 h-4 mr-3 text-[#87CEEB]" /> Views Over Time (Last 30 Days)
              </h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {[30, 45, 25, 60, 80, 55, 70, 90, 40, 50, 65, 30, 90, 40, 55, 70, 35, 60, 45, 80, 55, 70, 40, 50, 65, 30, 90, 40, 55, 70].map((h, i) => (
                  <div key={i} className="flex-1 bg-gray-100 rounded-t-lg hover:bg-[#87CEEB] transition-colors cursor-pointer group relative" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2F4F4F] text-white text-[8px] px-2 py-1 rounded font-mono">
                      {h}k
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                <span>May 01</span>
                <span>May 15</span>
                <span>Today</span>
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] p-10 rounded-[3rem] text-white">
              <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-[#87CEEB]">Top Performing Tags</h3>
              <div className="space-y-4">
                {[
                  { tag: 'Match Reports', share: '42%', color: 'bg-blue-500' },
                  { tag: 'Player Spotlight', share: '28%', color: 'bg-purple-500' },
                  { tag: 'Academy News', share: '18%', color: 'bg-green-500' },
                  { tag: 'Club Updates', share: '12%', color: 'bg-amber-500' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span>{item.tag}</span>
                      <span>{item.share}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full`} style={{ width: item.share }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-8">Audience Origin</h3>
              <div className="space-y-4">
                {['Lagos, NG', 'London, UK', 'Abuja, NG', 'Johannesburg, ZA'].map((loc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <span className="text-xs font-bold text-[#2F4F4F]">{loc}</span>
                    <span className="text-[10px] font-black text-[#87CEEB]">{40 - i * 8}%</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}