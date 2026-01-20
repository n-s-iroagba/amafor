
'use client';
import { useState } from 'react';

import { Shield, ArrowLeft, FileText, Download, BarChart2, Award, Zap, Loader2, Link } from 'lucide-react';
import { useGet } from '@/shared/hooks/useApiQuery';
import { useParams } from 'next/navigation';


export default function ScoutPlayerDetail() {
  const { data: players } = useGet('')
  const { id } = useParams();
  const player = players.find(p => p.id === id) || players[0];
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportReady(true);
    }, 2000);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#2F4F4F] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard/scout/players" className="inline-flex items-center text-[#87CEEB] font-bold text-[10px] mb-8 hover:translate-x-[-4px] transition-transform uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
          </Link>
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
            <div className="flex items-center space-x-8">
              <div className="text-8xl font-black text-[#87CEEB] opacity-50 select-none">#{player.jerseyNumber}</div>
              <div>
                <h1 className="text-5xl md:text-7xl mb-2 tracking-tighter">{player.name}</h1>
                <div className="flex items-center space-x-4">
                  <span className="bg-[#87CEEB] text-[#2F4F4F] px-4 py-1 rounded font-black text-xs uppercase tracking-widest">{player.position}</span>
                  <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest space-x-2">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    <span>VERIFIED PERFORMANCE DATA</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                REQUEST FULL DOSSIER
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="sky-button flex items-center space-x-3 text-[10px] tracking-widest disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{isGenerating ? 'ANALYZING METRICS...' : reportReady ? 'DOWNLOAD READY' : 'GENERATE SCOUT REPORT'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {reportReady && (
          <div className="mb-12 p-6 bg-green-50 border border-green-100 rounded-[2rem] flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500 rounded-xl text-white"><FileText className="w-6 h-6" /></div>
              <div>
                <h4 className="font-black text-[#2F4F4F] uppercase text-sm">Performance Dossier Generated</h4>
                <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Signed with professional key: scout_v4_auth</p>
              </div>
            </div>
            <button className="bg-white px-6 py-3 rounded-xl text-[10px] font-black uppercase border border-green-200 hover:bg-green-100 transition-colors">SAVE TO VAULT</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-sm font-black text-gray-400 mb-8 uppercase tracking-[0.2em] flex items-center">
                <BarChart2 className="w-5 h-5 mr-3 text-[#87CEEB]" /> Verified Performance Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Fixture Fitness', value: '94%', trend: '+2%' },
                  { label: 'Passing Accuracy', value: '82%', trend: '-1%' },
                  { label: 'Top Speed', value: '33.2 km/h', trend: '+0.4' },
                  { label: 'Tackles Won', value: '68%', trend: '+5%' }
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</div>
                    <div className="text-2xl font-black text-[#2F4F4F] mb-2">{stat.value}</div>
                    <div className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.trend} <span className="text-gray-400 ml-1">v. Avg</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black text-gray-400 mb-8 uppercase tracking-[0.2em] flex items-center">
                <Award className="w-5 h-5 mr-3 text-[#87CEEB]" /> Career Highlights
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'National League Debut', date: 'March 2024', desc: 'Played full 90 mins, provided 1 assist.' },
                  { title: 'MOTM Award v. Lagos City', date: 'Feb 2024', desc: 'Highest rated player on pitch (8.4/10).' },
                  { title: 'Academy Graduate', date: 'Jan 2024', desc: 'Promoted to first team after 3 years.' }
                ].map((item, i) => (
                  <div key={i} className="flex space-x-6 group">
                    <div className="flex-none w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-[#87CEEB] transition-colors">
                      <Zap className="w-6 h-6 text-[#2F4F4F]" />
                    </div>
                    <div className="flex-1 pb-6 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[#2F4F4F] uppercase tracking-tight">{item.title}</h4>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{item.date}</span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white sticky top-32 relative">
              <img src={player.imageUrl} className="w-full h-full object-cover" alt={player.name} />
              <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-black/40 to-transparent">
                <h3 className="text-2xl text-white font-black mb-2 uppercase tracking-tight">{player.name}</h3>
                <p className="text-[#87CEEB] text-xs font-black uppercase tracking-widest">{player.position} | #{player.jerseyNumber}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
