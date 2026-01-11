'use client';
import React, { useState } from 'react';
// Added PlusCircle to the lucide-react import list
import { Save, Eye, Send, ArrowLeft, Image as ImageIcon, Type, Link as LinkIcon, Hash, Globe, ShieldCheck, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewArticlePage() {
  const [status, setStatus] = useState('Draft');

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#2F4F4F] text-white py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/dashboard/cms" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">Create New Article (CMS-02)</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{status} Mode</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-6 py-2.5 rounded-xl border border-white/20 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center">
              <Eye className="w-4 h-4 mr-2" /> Preview
            </button>
            <button className="sky-button flex items-center space-x-2 py-2.5">
              <Send className="w-4 h-4" />
              <span>PUBLISH ARTICLE</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Editor */}
          <div className="lg:col-span-3 space-y-8">
            <input 
              type="text" 
              placeholder="Enter Article Title..." 
              className="w-full text-5xl font-black text-[#2F4F4F] placeholder:text-gray-100 outline-none border-b border-transparent focus:border-gray-100 pb-4 transition-all"
            />
            
            {/* Toolbar Simulation */}
            <div className="flex items-center space-x-1 p-2 bg-gray-50 rounded-2xl border border-gray-100">
              {[Type, ImageIcon, LinkIcon, Hash].map((Icon, i) => (
                <button key={i} className="p-3 hover:bg-[#87CEEB] hover:text-[#2F4F4F] rounded-xl text-gray-400 transition-all">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
              <div className="h-6 w-px bg-gray-200 mx-2" />
              <button className="px-4 py-2 text-[10px] font-black text-gray-400 hover:text-[#2F4F4F]">BOLD</button>
              <button className="px-4 py-2 text-[10px] font-black text-gray-400 hover:text-[#2F4F4F]">ITALIC</button>
            </div>

            <textarea 
              placeholder="Start writing the story of the Gladiators..."
              className="w-full h-[600px] text-lg text-gray-600 leading-relaxed outline-none border-none bg-white resize-none"
            />
          </div>

          {/* Sidebar Config */}
          <aside className="space-y-8">
            <section className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                <Globe className="w-4 h-4 mr-2" /> Distribution & SEO
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-[9px] font-black text-[#2F4F4F] uppercase tracking-widest mb-2">Category</label>
                  <select className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none focus:border-[#87CEEB]">
                    <option>Match Report</option>
                    <option>Academy Update</option>
                    <option>Player Spotlight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-[#2F4F4F] uppercase tracking-widest mb-2">Featured Image</label>
                  <div className="aspect-video bg-white border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center flex-col group cursor-pointer hover:border-[#87CEEB] transition-all">
                    <PlusCircle className="w-6 h-6 text-gray-300 group-hover:text-[#87CEEB] mb-2" />
                    <span className="text-[9px] font-black text-gray-400 uppercase">Upload Media</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#2F4F4F] text-white p-8 rounded-[2rem]">
               <h3 className="text-[10px] font-black text-[#87CEEB] uppercase tracking-widest mb-6 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2" /> Version Control
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-400 font-bold uppercase">Last Saved</span>
                  <span className="font-mono">12:42:01</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-400 font-bold uppercase">Editor</span>
                  <span className="font-mono">M-MANAGER-01</span>
                </div>
                <button className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                  VIEW HISTORY (3)
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
