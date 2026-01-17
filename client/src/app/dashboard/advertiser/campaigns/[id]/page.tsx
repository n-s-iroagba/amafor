'use client';
import React, { useState } from 'react';
import { ArrowLeft, Megaphone, Play, Pause, BarChart3, TrendingUp, Users, MousePointer2, Download, ShieldCheck, Target, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CampaignDetailPage() {
  const { id } = useParams();
  const [status, setStatus] = useState<'active' | 'paused'>('active');
  const [isExporting, setIsExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const campaign = {
    id: id || 'c1',
    name: 'Summer Kit Launch',
    zone: 'Homepage Banner',
    target: 100000,
    delivered: 45200,
    unique: 38100,
    clicks: 1240,
    spend: 189840,
    budget: 420000,
    startDate: '2024-05-01',
    creative: 'summer_kit_v1.jpg'
  };

  const deliveryPercent = (campaign.delivered / campaign.target) * 100;

  const toggleStatus = () => {
    setStatus(status === 'active' ? 'paused' : 'active');
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {showToast && (
        <div className="fixed top-24 right-8 bg-[#2F4F4F] text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center space-x-3 border-l-4 border-[#87CEEB] animate-in slide-in-from-right-10 duration-500">
          <CheckCircle className="w-5 h-5 text-[#87CEEB]" />
          <span className="text-xs font-black uppercase tracking-widest">Report Prepared & Emailed</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard/advertiser/campaigns" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Campaigns
        </Link>

        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className="bg-[#2F4F4F] p-4 rounded-3xl shadow-xl">
              <Megaphone className="w-8 h-8 text-[#87CEEB]" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-4xl text-[#2F4F4F] tracking-tighter uppercase font-black">{campaign.name}</h1>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  status === 'active' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {status}
                </span>
              </div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{campaign.zone} Campaign</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={toggleStatus}
              className="flex items-center space-x-2 bg-white px-6 py-3 rounded-2xl border text-xs font-black text-[#2F4F4F] hover:border-[#87CEEB] shadow-sm transition-all"
            >
              {status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{status === 'active' ? 'PAUSE CAMPAIGN' : 'RESUME CAMPAIGN'}</span>
            </button>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="sky-button flex items-center space-x-3 text-xs tracking-widest disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{isExporting ? 'PROCESSING...' : 'EXPORT PDF REPORT'}</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100 transition-all hover:shadow-xl">
               <h2 className="text-sm font-black text-gray-400 mb-10 uppercase tracking-[0.2em] flex items-center">
                <TrendingUp className="w-5 h-5 mr-3 text-[#87CEEB]" /> Live Delivery Statistics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Delivered Views</div>
                  <div className="text-3xl font-black text-[#2F4F4F]">{campaign.delivered.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase">of {campaign.target.toLocaleString()} target</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Completion</div>
                  <div className="text-3xl font-black text-[#87CEEB]">{deliveryPercent.toFixed(1)}%</div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-3">
                    <div className="bg-[#87CEEB] h-full transition-all duration-1000" style={{ width: `${deliveryPercent}%` }} />
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ad Spend</div>
                  <div className="text-3xl font-black text-[#2F4F4F]">₦{campaign.spend.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase">from ₦{campaign.budget.toLocaleString()} budget</div>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                 <div>
                    <div className="flex items-center text-[10px] font-black text-gray-400 uppercase mb-2">
                      <Users className="w-3.5 h-3.5 mr-2 text-[#87CEEB]" /> Unique Users
                    </div>
                    <div className="text-xl font-bold">{campaign.unique.toLocaleString()}</div>
                 </div>
                 <div>
                    <div className="flex items-center text-[10px] font-black text-gray-400 uppercase mb-2">
                      <MousePointer2 className="w-3.5 h-3.5 mr-2 text-[#87CEEB]" /> Total Clicks
                    </div>
                    <div className="text-xl font-bold">{campaign.clicks.toLocaleString()}</div>
                 </div>
                 <div>
                    <div className="flex items-center text-[10px] font-black text-gray-400 uppercase mb-2">
                      <BarChart3 className="w-3.5 h-3.5 mr-2 text-[#87CEEB]" /> Avg. CTR
                    </div>
                    <div className="text-xl font-bold">{((campaign.clicks/campaign.delivered)*100).toFixed(2)}%</div>
                 </div>
                 <div>
                    <div className="flex items-center text-[10px] font-black text-gray-400 uppercase mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 mr-2 text-[#87CEEB]" /> CPV
                    </div>
                    <div className="text-xl font-bold">₦4.20</div>
                 </div>
              </div>
            </div>

            <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100">
               <h2 className="text-sm font-black text-gray-400 mb-8 uppercase tracking-[0.2em] flex items-center">
                <Target className="w-5 h-5 mr-3 text-[#87CEEB]" /> Distribution Parameters
              </h2>
              <div className="flex flex-wrap gap-3">
                {['Football News', 'Match Reports', 'Desktop', 'Mobile', 'Lagos Region', 'Enugu Region'].map(t => (
                  <span key={t} className="px-6 py-2 bg-gray-50 text-[#2F4F4F] text-[10px] font-black uppercase tracking-widest rounded-full border border-gray-100">
                    {t}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
             <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden relative group">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Creative Blueprint</h3>
                <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-6 flex items-center justify-center border border-dashed border-gray-300 relative">
                   <img src={`https://picsum.photos/seed/${campaign.id}/1200/900`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">Update File</button>
                   </div>
                </div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-tighter flex justify-between">
                  <span>Filename:</span>
                  <span className="text-[#2F4F4F]">{campaign.creative}</span>
                </div>
             </div>

             <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                <BarChart3 className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
                <h4 className="text-lg mb-4 font-black uppercase tracking-tight text-[#87CEEB]">GA4 Real-time Bridge</h4>
                <p className="text-sm text-gray-400 leading-relaxed mb-8">
                  Commercial data is synchronized with Google Analytics 4 hourly. Next reconciliation cycle: <span className="text-white font-bold">~42 minutes</span>.
                </p>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-[10px] font-bold text-gray-300 tracking-widest flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2 text-green-500" /> ISO 27001 AUDIT ACTIVE
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}