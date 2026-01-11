'use client';
import React, { useState } from 'react';
import { Save, Eye, ArrowLeft, Image as ImageIcon, Type, Link as LinkIcon, Hash, Globe, ShieldCheck, PlusCircle, Loader2, CheckCircle, Clock } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MOCK_ARTICLES } from '../../../../constants';

export default function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = MOCK_ARTICLES.find(a => a.id === id) || MOCK_ARTICLES[0];
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [title, setTitle] = useState(article.title);
  const [status, setStatus] = useState('Published');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {showToast && (
        <div className="fixed top-24 right-8 bg-[#2F4F4F] text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center space-x-3 border-l-4 border-[#87CEEB] animate-in slide-in-from-right-10 duration-500">
          <CheckCircle className="w-5 h-5 text-[#87CEEB]" />
          <span className="text-xs font-black uppercase tracking-widest">Article Revision Logged (CMS-V4)</span>
        </div>
      )}

      <header className="bg-[#2F4F4F] text-white py-6 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button onClick={() => navigate('/dashboard/cms/articles')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">Edit Article: {article.id}</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{status} Mode</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-6 py-2.5 rounded-xl border border-white/20 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center">
              <Eye className="w-4 h-4 mr-2" /> Live Preview
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="sky-button flex items-center space-x-2 py-2.5 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'SYNCING VERSION...' : 'COMMIT UPDATES'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 space-y-8">
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-5xl font-black text-[#2F4F4F] placeholder:text-gray-100 outline-none border-b border-transparent focus:border-gray-100 pb-4 transition-all"
            />
            
            <div className="flex items-center space-x-1 p-2 bg-gray-50 rounded-2xl border border-gray-100 sticky top-32 z-40 backdrop-blur-md bg-white/80">
              {[Type, ImageIcon, LinkIcon, Hash].map((Icon, i) => (
                <button key={i} className="p-3 hover:bg-[#87CEEB] hover:text-[#2F4F4F] rounded-xl text-gray-400 transition-all">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
              <div className="h-6 w-px bg-gray-200 mx-2" />
              <button className="px-4 py-2 text-[10px] font-black text-gray-400 hover:text-[#2F4F4F]">BOLD</button>
              <button className="px-4 py-2 text-[10px] font-black text-gray-400 hover:text-[#2F4F4F]">ITALIC</button>
              <button className="px-4 py-2 text-[10px] font-black text-gray-400 hover:text-[#2F4F4F]">H1</button>
            </div>

            <textarea 
              defaultValue={article.excerpt + "\n\n" + (article.content || "Continue the story here...")}
              className="w-full h-[600px] text-lg text-gray-600 leading-relaxed outline-none border-none bg-white resize-none font-medium"
            />
          </div>

          <aside className="space-y-8">
            <section className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                <Globe className="w-4 h-4 mr-2" /> Canonical Metadata
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-[9px] font-black text-[#2F4F4F] uppercase tracking-widest mb-2">Category Channel</label>
                  <select defaultValue={article.tags[0]} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none focus:border-[#87CEEB] appearance-none">
                    <option value="match_report">Match Report</option>
                    <option value="academy_update">Academy Update</option>
                    <option value="player_spotlight">Player Spotlight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-[#2F4F4F] uppercase tracking-widest mb-2">Primary Cover</label>
                  <div className="aspect-video bg-white border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center flex-col group cursor-pointer hover:border-[#87CEEB] transition-all relative overflow-hidden shadow-inner">
                    <img src={article.featuredImage} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform" />
                    <PlusCircle className="w-6 h-6 text-gray-400 group-hover:text-[#87CEEB] mb-2 relative z-10" />
                    <span className="text-[9px] font-black text-gray-400 uppercase relative z-10 group-hover:text-[#2F4F4F]">Replace Asset</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#2F4F4F] text-white p-8 rounded-[2rem] relative overflow-hidden shadow-xl">
               <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5" />
               <h3 className="text-[10px] font-black text-[#87CEEB] uppercase tracking-widest mb-6 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2" /> Forensic Audit
              </h3>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-400 font-bold uppercase tracking-tighter">Current Revision</span>
                  <span className="font-mono text-[#87CEEB]">v4.1.2</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-400 font-bold uppercase tracking-tighter">Sync ID</span>
                  <span className="font-mono">{article.id}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] pt-4 border-t border-white/10">
                   <div className="flex items-center text-gray-300">
                     <Clock className="w-3 h-3 mr-1.5" /> <span className="font-bold uppercase tracking-widest">Auto-saved</span>
                   </div>
                   <span className="font-mono">12:44 PM</span>
                </div>
                <button className="w-full mt-4 py-3 bg-white/10 hover:bg-white text-white hover:text-[#2F4F4F] rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                  RESTORE PREVIOUS (3)
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}