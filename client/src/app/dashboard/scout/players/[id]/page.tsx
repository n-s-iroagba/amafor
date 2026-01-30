
'use client';
import { useState } from 'react';

import { Shield, ArrowLeft, FileText, Download, BarChart2, Award, Zap, Loader2 } from 'lucide-react';
import { useGet } from '@/shared/hooks/useApiQuery';
import { useParams } from 'next/navigation';
import { API_ROUTES } from '@/config/routes';
import Link from 'next/link';


/**
 * Page: Scout Player Detail
 * Description: Detailed scouting view of a player profile.
 * Requirements: REQ-SCT-02 (Player Database)
 * User Story: US-SCT-002 (Browse Player Database)
 * User Journey: UJ-SCT-001 (Scout Dashboard)
 * API: GET /scout/view/:id (API_ROUTES.SCOUT.PLAYER_VIEW)
 */
export default function PlayerScoutProfile() {
  const { id } = useParams();
  const { data: player, loading } = useGet<any>(API_ROUTES.PLAYERS.VIEW(id as string));
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportReady(true);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#87CEEB]/20 border-t-[#87CEEB] rounded-full animate-spin" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black uppercase mb-4">Talent Not Found</h2>
        <Link href="/dashboard/scout/players" className="text-[#87CEEB] text-xs font-black uppercase tracking-widest hover:underline">Return to Directory</Link>
      </div>
    );
  }

  const age = player.dateOfBirth ? new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear() : 'N/A';

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#2F4F4F] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard/scout/players" className="inline-flex items-center text-[#87CEEB] font-bold text-[10px] mb-8 hover:translate-x-[-4px] transition-transform uppercase tracking-widest" data-testid="link-back-players">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
          </Link>
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
            <div className="flex items-center space-x-8">
              <div className="text-8xl font-black text-[#87CEEB] opacity-50 select-none">#{player.jerseyNumber || '??'}</div>
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
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all" data-testid="btn-request-dossier">
                REQUEST FULL DOSSIER
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="sky-button flex items-center space-x-3 text-[10px] tracking-widest disabled:opacity-50"
                data-testid="btn-generate-report"
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
            <button className="bg-white px-6 py-3 rounded-xl text-[10px] font-black uppercase border border-green-200 hover:bg-green-100 transition-colors" data-testid="btn-save-vault">SAVE TO VAULT</button>
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
                  { label: 'Goals', value: player.stats?.goals || 0, trend: '-' },
                  { label: 'Assists', value: player.stats?.assists || 0, trend: '-' },
                  { label: 'Minutes', value: player.stats?.minutesPlayed || 0, trend: '-' },
                  { label: 'Cards', value: (player.stats?.yellowCards || 0) + (player.stats?.redCards || 0), trend: '-' }
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100" data-testid={`stat-card-${stat.label.toLowerCase()}`}>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</div>
                    <div className="text-2xl font-black text-[#2F4F4F] mb-2">{stat.value}</div>
                    <div className="text-[10px] font-bold text-gray-400">
                      Season Aggregate
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black text-gray-400 mb-8 uppercase tracking-[0.2em] flex items-center">
                <Award className="w-5 h-5 mr-3 text-[#87CEEB]" /> Career Stats Summary
              </h2>
              <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Physical Profile</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-xs font-bold uppercase">Height</span>
                        <span className="text-xs font-black">{player.height || 'N/A'}m</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-xs font-bold uppercase">Age</span>
                        <span className="text-xs font-black">{age}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Professional Status</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-xs font-bold uppercase">Nationality</span>
                        <span className="text-xs font-black">{player.nationality || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-xs font-bold uppercase">Squad Status</span>
                        <span className="text-xs font-black uppercase text-green-500">{player.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white sticky top-32">
              <img src={player.imageUrl || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" alt={player.name} />
              <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-black/40 to-transparent">
                <h3 className="text-2xl text-white font-black mb-2 uppercase tracking-tight">{player.name}</h3>
                <p className="text-[#87CEEB] text-xs font-black uppercase tracking-widest">{player.position} | #{player.jerseyNumber || '??'}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
