
'use client';
import React, { useState } from 'react';
import { Trophy, Clock, ArrowLeft, Save, Plus, Trash2, ShieldCheck, User, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MOCK_FIXTURES } from '../../../../constants';

export default function MatchEventEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fixture = MOCK_FIXTURES.find(f => f.id === id) || MOCK_FIXTURES[0];
  const [isSaving, setIsSaving] = useState(false);
  const [events, setEvents] = useState([
    { id: Date.now() + 1, type: 'GOAL', minute: '24', player: 'K. Amadi', team: 'HOME' },
    { id: Date.now() + 2, type: 'YELLOW', minute: '42', player: 'C. Okafor', team: 'HOME' },
  ]);

  const addEvent = () => {
    const newEvent = {
      id: Date.now(),
      type: 'SUB',
      minute: '60',
      player: 'Unassigned',
      team: 'HOME'
    };
    setEvents([...events, newEvent]);
  };

  const removeEvent = (eventId: number) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const handleFinalize = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate('/dashboard/admin/fixtures');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/dashboard/admin/fixtures" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Fixtures
        </Link>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className="bg-[#2F4F4F] p-4 rounded-3xl shadow-xl">
              <Trophy className="w-8 h-8 text-[#87CEEB]" />
            </div>
            <div>
              <h1 className="text-3xl text-[#2F4F4F] font-black uppercase tracking-tight">{fixture.homeTeam} VS {fixture.awayTeam}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-[10px] font-black text-[#87CEEB] uppercase tracking-widest">{fixture.competition}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Match ID: {fixture.id}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleFinalize}
            disabled={isSaving}
            className="sky-button flex items-center space-x-3 py-5 px-10 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{isSaving ? 'UPLOADING DATA...' : 'FINALIZE MATCH REPORT'}</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 text-center">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10">Official Scoreline</h2>
              <div className="flex items-center justify-center space-x-12">
                <div>
                  <div className="text-sm font-black text-[#2F4F4F] uppercase mb-4 truncate w-32">{fixture.homeTeam}</div>
                  <input type="number" defaultValue={fixture.homeScore || 0} className="w-24 h-24 bg-gray-50 border-4 border-gray-100 rounded-[2rem] text-center text-5xl font-black focus:border-[#87CEEB] outline-none" />
                </div>
                <div className="text-4xl font-black text-gray-200 mt-8">-</div>
                <div>
                  <div className="text-sm font-black text-[#2F4F4F] uppercase mb-4 truncate w-32">{fixture.awayTeam}</div>
                  <input type="number" defaultValue={fixture.awayScore || 0} className="w-24 h-24 bg-gray-50 border-4 border-gray-100 rounded-[2rem] text-center text-5xl font-black focus:border-[#87CEEB] outline-none" />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-[#87CEEB]" /> Match Event Timeline
                </h2>
                <button 
                  onClick={addEvent}
                  className="text-[10px] font-black text-[#87CEEB] uppercase tracking-widest flex items-center hover:underline"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add New Event
                </button>
              </div>
              
              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl group border border-transparent hover:border-gray-200 transition-all">
                    <div className="flex items-center space-x-6">
                      <div className="font-mono text-xl font-black text-[#87CEEB]">{event.minute}'</div>
                      <div>
                        <div className="text-xs font-black text-[#2F4F4F] uppercase tracking-widest">{event.type}</div>
                        <div className="text-sm font-bold text-gray-500">{event.player} ({event.team})</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeEvent(event.id)}
                      className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
               <ShieldCheck className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
               <h3 className="text-lg font-black mb-6 uppercase tracking-tight text-[#87CEEB]">Validation</h3>
               <p className="text-xs text-gray-400 leading-relaxed mb-8">
                 Once finalized, match data is pushed to GA4, the Scout Portal, and public league standings.
               </p>
               <div className="flex items-center space-x-3 text-[10px] font-black text-green-500 uppercase tracking-widest">
                 <ShieldCheck className="w-4 h-4" /> <span>ISO Verified Input</span>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
