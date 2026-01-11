'use client';
import React, { useState } from 'react';
import { Image as ImageIcon, Video, Search, Filter, Plus, Trash2, MoreVertical, ArrowLeft, HardDrive, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MediaLibraryPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [assets, setAssets] = useState([
    { id: 'm1', name: 'stadium_hero.jpg', type: 'IMAGE', size: '2.4 MB', date: 'May 19, 2024' },
    { id: 'm2', name: 'u17_training_session.mp4', type: 'VIDEO', size: '45.8 MB', date: 'May 18, 2024' },
    { id: 'm3', name: 'kelechi_portrait.png', type: 'IMAGE', size: '1.1 MB', date: 'May 15, 2024' },
  ]);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newAsset = { id: `m${Date.now()}`, name: 'new_asset_upload.jpg', type: 'IMAGE', size: '1.8 MB', date: 'Just now' };
      setAssets([newAsset, ...assets]);
      setIsUploading(false);
    }, 2000);
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link to="/dashboard/cms" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to CMS
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl text-[#2F4F4F] mb-2 uppercase tracking-tight font-black">Media Assets (CMS-05)</h1>
            <p className="text-gray-500 text-sm">Centralized repository for all platform visual and video content.</p>
          </div>
          <button 
            onClick={handleUpload}
            disabled={isUploading}
            className="sky-button flex items-center space-x-3 py-4 disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            <span>{isUploading ? 'SYNCHRONIZING CDN...' : 'UPLOAD NEW ASSET'}</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Storage Usage</h3>
              <div className="space-y-4">
                 <div className="flex justify-between text-xs font-bold text-[#2F4F4F]">
                   <span>Used</span>
                   <span>{(assets.length * 1.4).toFixed(1)} GB / 50 GB</span>
                 </div>
                 <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#87CEEB] h-full transition-all duration-1000" style={{ width: `${(assets.length * 1.4 / 50) * 100}%` }} />
                 </div>
              </div>
            </div>
            <div className="bg-[#2F4F4F] text-white p-8 rounded-[2.5rem] relative overflow-hidden">
               <HardDrive className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5" />
               <h4 className="text-sm font-black text-[#87CEEB] mb-2 uppercase tracking-widest">CDN Status</h4>
               <p className="text-[10px] text-gray-400 uppercase font-bold">Edge nodes active across Lagos and London.</p>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-wrap items-center gap-6">
               <div className="flex-1 min-w-[200px] relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                 <input type="text" placeholder="Search filename..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl outline-none text-sm font-bold" />
               </div>
               <div className="flex items-center space-x-2">
                 {['ALL', 'IMAGES', 'VIDEOS'].map(f => (
                   <button key={f} className="px-4 py-2 text-[9px] font-black text-gray-400 hover:text-[#2F4F4F] uppercase tracking-widest">{f}</button>
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {assets.map(asset => (
                <div key={asset.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden group hover:shadow-xl transition-all">
                  <div className="aspect-square bg-gray-100 relative flex items-center justify-center">
                    {asset.type === 'IMAGE' ? <ImageIcon className="w-8 h-8 text-gray-300" /> : <Video className="w-8 h-8 text-gray-300" />}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => deleteAsset(asset.id)} className="p-2 bg-white rounded-lg shadow-lg text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-black text-[#2F4F4F] truncate mb-1 uppercase">{asset.name}</div>
                    <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                      <span>{asset.size}</span>
                      <span>{asset.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}