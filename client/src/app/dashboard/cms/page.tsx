'use client';
import React from 'react';
import { FileText, Eye, Share2, TrendingUp, PlusCircle, Edit3, BarChart3, Clock, ChevronRight, Shield, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { MOCK_ARTICLES } from '../../../constants';

export default function CMSDashboard() {
  const stats = [
    { label: 'Published Articles', value: '42', icon: <FileText className="w-5 h-5" />, color: 'bg-emerald-500' },
    { label: 'Total Read Time', value: '184k Min', icon: <Clock className="w-5 h-5" />, color: 'bg-blue-500' },
    { label: 'Avg. Engagement', value: '4.8m', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-purple-500' },
    { label: 'Pending Drafts', value: '7', icon: <Edit3 className="w-5 h-5" />, color: 'bg-amber-500' },
  ];

  const contentPerformance = MOCK_ARTICLES.map(a => ({
    ...a,
    views: Math.floor(Math.random() * 5000) + 1000,
    shares: Math.floor(Math.random() * 200) + 50
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-20 bg-[#2F4F4F] hidden lg:flex flex-col items-center py-8 space-y-8">
        <div className="bg-[#87CEEB] p-2 rounded-lg"><FileText className="w-6 h-6 text-[#2F4F4F]" /></div>
        <div className="space-y-6">
          <Link href="/dashboard/cms/articles" className="p-3 text-white/50 hover:text-white block" title="Articles"><Edit3 className="w-6 h-6" /></Link>
          <Link href="/dashboard/cms/media" className="p-3 text-white/50 hover:text-white block" title="Media Library"><ImageIcon className="w-6 h-6" /></Link>
          <Link href="/dashboard/cms/analytics" className="p-3 text-white/50 hover:text-white block" title="Analytics"><BarChart3 className="w-6 h-6" /></Link>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="text-[10px] font-black text-[#87CEEB] uppercase tracking-[0.3em] mb-2">Media Management Suite</div>
            <h1 className="text-4xl text-[#2F4F4F]">Content Command</h1>
          </div>
          <Link href="/dashboard/cms/articles/new" className="sky-button flex items-center space-x-3 py-4">
            <PlusCircle className="w-5 h-5" />
            <span>CREATE ARTICLE</span>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl text-white ${stat.color}`}>{stat.icon}</div>
                <div className="text-[10px] font-bold text-green-500">+12%</div>
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-2xl font-black text-[#2F4F4F]">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest">Article Performance (CMS-04)</h2>
              <Link href="/dashboard/cms/articles" className="text-xs font-bold text-[#87CEEB] hover:underline">View All</Link>
            </div>
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-8 py-4">Article Title</th>
                    <th className="px-8 py-4">Views</th>
                    <th className="px-8 py-4">Shares</th>
                    <th className="px-8 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {contentPerformance.map(article => (
                    <tr key={article.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-[#2F4F4F] truncate max-w-xs">{article.title}</div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Published {new Date(article.publishedAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-3 h-3 text-[#87CEEB]" />
                          <span className="font-bold text-sm">{article.views.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2">
                          <Share2 className="w-3 h-3 text-purple-400" />
                          <span className="font-bold text-sm">{article.shares}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Live</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <Shield className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
              <h3 className="text-xl mb-6 font-black tracking-tight uppercase">Media Storage</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-8">
                Manage your cloud storage for videos and hero images in the centralized library.
              </p>
              <Link href="/dashboard/cms/media" className="w-full py-4 bg-[#87CEEB] text-[#2F4F4F] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center">
                OPEN MEDIA LIBRARY <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Editorial Queue</h4>
              <div className="space-y-4">
                {[
                  { title: 'Training Camp Update', time: '2h ago' },
                  { title: 'New Scout Interview', time: '5h ago' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-[#2F4F4F]">{item.title}</span>
                    <span className="text-[9px] text-gray-400 font-black">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}