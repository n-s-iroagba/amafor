
'use client';
import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, Shield, Video, Clock, MessageSquare, Plus, Download, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';


// Changed params to optional to resolve TS error in index.tsx

/**
 * Page: Scout Match Analysis
 * Description: Detailed view of a match for scouting purposes.
 * Requirements: REQ-SCT-03 (Match Analysis)
 * User Story: US-SCT-003 (View Match Analysis)
 * User Journey: UJ-SCT-001 (Scout Dashboard)
 * API: GET /scout/matches/:id (API_ROUTES.FIXTURES.VIEW + Analysis Data)
 */
export default function MatchAnalysisPage({ params }: { params?: { id: string } }) {
  const urlParams = useParams();
  const matchId = params?.id || (urlParams.id as string);

  const { data: video, loading } = useGet<any>(API_ROUTES.VIDEOS.VIEW(matchId));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');

  const logs = [
    { time: '12:04', player: 'K. Amadi (#9)', event: 'Shot on Goal (Target)', note: 'Excellent movement off the ball.' },
    { time: '28:45', player: 'C. Okafor (#8)', event: 'Key Pass', note: 'Split defense with low driven ball.' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a2e2e] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#87CEEB]/20 border-t-[#87CEEB] rounded-full animate-spin" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-[#1a2e2e] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-black uppercase mb-4">Archive Not Found</h2>
        <Link href="/dashboard/scout/matches" className="text-[#87CEEB] text-xs font-black uppercase tracking-widest hover:underline">Return to Library</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2e2e] text-white">
      <div className="max-w-[1800px] mx-auto p-4 lg:p-8 flex flex-col h-screen">

        <header className="flex items-center justify-between mb-8 flex-none">
          <div className="flex items-center space-x-6">
            <Link href="/dashboard/scout/matches" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all" data-testid="link-back-matches">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">{video.title}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-[10px] font-black text-[#87CEEB] uppercase tracking-widest">ISO 27001 PROTECTED STREAM</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">1080P | 60FPS</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-[#87CEEB] text-[#2F4F4F] px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all" data-testid="btn-download-clips">
              DOWNLOAD CLIPS
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
          {/* Main Player Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 bg-black rounded-[2rem] overflow-hidden relative group">
              <img src={video.thumbnail || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80"} className="w-full h-full object-cover opacity-60" alt={video.title} />
              <div className="absolute inset-0 flex items-center justify-center">
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-24 h-24 bg-[#87CEEB] rounded-full flex items-center justify-center text-[#2F4F4F] shadow-2xl hover:scale-110 transition-transform" data-testid="btn-play-pause">
                  {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-2" />}
                </button>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center space-x-6 mb-4">
                  <span className="font-mono text-2xl font-black text-[#87CEEB]">{currentTime}</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden relative group/seek">
                    <div className="absolute left-0 top-0 h-full bg-[#87CEEB]" style={{ width: '0%' }} />
                    <div className="absolute left-[0%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl opacity-0 group-hover/seek:opacity-100 transition-opacity" />
                  </div>
                  <span className="font-mono text-gray-500">{video.duration || '00:00'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-8">
                    <SkipBack className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" data-testid="btn-skip-back" />
                    <SkipForward className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" data-testid="btn-skip-forward" />
                    <BarChart2 className="w-6 h-6 text-[#87CEEB] cursor-pointer" data-testid="btn-view-stats" />
                  </div>
                  <div className="flex items-center space-x-4">
                    <Video className="w-5 h-5 text-gray-500" />
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Sidebar */}
          <aside className="w-full lg:w-96 flex flex-col gap-6">
            <div className="bg-white/5 rounded-[2.5rem] p-8 flex-1 flex flex-col overflow-hidden">
              <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center text-[#87CEEB]">
                <Clock className="w-4 h-4 mr-3" /> Scout Event Log
              </h3>
              <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-[#87CEEB] font-mono">{log.time}</span>
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{log.event}</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 group-hover:bg-white/10 transition-all">
                      <div className="text-xs font-bold mb-1">{log.player}</div>
                      <p className="text-[10px] text-gray-400 leading-relaxed">{log.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 bg-white/10 hover:bg-[#87CEEB] hover:text-[#2F4F4F] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center" data-testid="btn-tag-timestamp">
                <Plus className="w-4 h-4 mr-2" /> TAG CURRENT TIMESTAMP
              </button>
            </div>

            <div className="bg-white/5 rounded-[2.5rem] p-8">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center">
                <MessageSquare className="w-4 h-4 mr-3 text-blue-400" /> Analyst Notes
              </h3>
              <textarea
                placeholder="Enter tactical observations..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold outline-none focus:border-[#87CEEB] h-32 resize-none"
                data-testid="textarea-analyst-notes"
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
