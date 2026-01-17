
'use client';
import React, { useState } from 'react';
import { User, Shield, Lock, ArrowLeft, Save, Mail, Trash2, ShieldAlert, Key, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function UserPermissionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const permissionGroups = [
    { title: 'Core Access', permissions: ['System Dashboard', 'Profile Management', 'Audit Trail Viewing'] },
    { title: 'Sports Operations', permissions: ['Roster Editing', 'Match Event Logging', 'Player Bio Verification'] },
    { title: 'Commercial Suite', permissions: ['Ad Rate Configuration', 'Campaign Approval', 'Revenue Dashboard'] },
    { title: 'Security & Infra', permissions: ['User Role Assignment', 'Manual Database Backups', 'Compliance Overrides'] },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard/admin/users" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to User List
        </Link>

        {saved && (
          <div className="mb-8 p-4 bg-green-500 text-white rounded-2xl flex items-center justify-center space-x-3 font-black text-xs uppercase tracking-widest animate-in slide-in-from-top-4 duration-500">
            <CheckCircle className="w-4 h-4" />
            <span>Permissions Updated & Logged (ADM-AUD-201)</span>
          </div>
        )}

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-[2rem] bg-[#2F4F4F] flex items-center justify-center text-[#87CEEB] font-black text-3xl shadow-xl">
              {id?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl text-[#2F4F4F] font-black uppercase tracking-tight">Marcus Scout ({id})</h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <Mail className="w-3 h-3 mr-1.5" /> marcus@protalent.com
                </div>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-[10px] font-black text-[#87CEEB] uppercase tracking-widest">Global Scout Role</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
             <button className="px-6 py-4 bg-white border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center">
                <Trash2 className="w-4 h-4 mr-2" /> DEACTIVATE USER
             </button>
             <button 
               onClick={handleSave}
               disabled={isSaving}
               className="sky-button flex items-center space-x-3 py-4 px-10 disabled:opacity-50"
             >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                <span>{isSaving ? 'UPDATING...' : 'SAVE PERMISSIONS'}</span>
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100">
               <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-10 flex items-center">
                <Lock className="w-4 h-4 mr-3 text-[#87CEEB]" /> Granular System Permissions
              </h2>
              
              <div className="space-y-12">
                {permissionGroups.map((group, i) => (
                  <div key={i} className="space-y-6">
                    <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{group.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.permissions.map((perm, pi) => (
                        <label key={pi} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all">
                          <span className="text-xs font-bold text-[#2F4F4F]">{perm}</span>
                          <input type="checkbox" defaultChecked={i === 0} className="w-5 h-5 rounded border-gray-300 text-[#87CEEB] focus:ring-[#87CEEB]" />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
               <ShieldAlert className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
               <h3 className="text-lg font-black mb-6 uppercase tracking-tight text-red-400">Security Guard</h3>
               <p className="text-xs text-gray-400 leading-relaxed mb-8 uppercase font-bold">
                 Role changes trigger a password reset for the target user and log an entry in the system audit trail (ADM-02).
               </p>
               <button className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-[#2F4F4F] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center">
                 <Key className="w-4 h-4 mr-2" /> FORCE PWD RESET
               </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
