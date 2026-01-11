'use client';
import React, { useState } from 'react';
import { Database, Shield, Download, RefreshCw, History, ArrowLeft, HardDrive, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function BackupManagementPage() {
  const [isBackingUp, setIsBackingUp] = useState(false);

  const triggerBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => setIsBackingUp(false), 3000);
  };

  const backups = [
    { id: 'BK-99201', date: '2024-05-20 04:00', size: '1.24 GB', type: 'AUTOMATED', status: 'SUCCESS' },
    { id: 'BK-99198', date: '2024-05-19 16:42', size: '1.21 GB', type: 'MANUAL', status: 'SUCCESS' },
    { id: 'BK-99195', date: '2024-05-19 04:00', size: '1.19 GB', type: 'AUTOMATED', status: 'SUCCESS' },
    { id: 'BK-99190', date: '2024-05-18 04:00', size: '1.18 GB', type: 'AUTOMATED', status: 'SUCCESS' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/admin" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Central Command
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-[#2F4F4F] p-3 rounded-2xl shadow-xl">
                <Database className="w-8 h-8 text-[#87CEEB]" />
              </div>
              <h1 className="text-4xl text-[#2F4F4F] uppercase tracking-tighter font-black">DATA RESILIENCE (ADM-12)</h1>
            </div>
            <p className="text-gray-500 text-sm">Manage immutable database snapshots. Certified disaster recovery path for the Gladiators ecosystem.</p>
          </div>
          <button 
            onClick={triggerBackup}
            disabled={isBackingUp}
            className="sky-button flex items-center space-x-3 py-5 px-10 text-xs tracking-widest disabled:opacity-50 group"
          >
            <RefreshCw className={`w-5 h-5 ${isBackingUp ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
            <span>{isBackingUp ? 'SYNCHRONIZING SNAPSHOT...' : 'TRIGGER MANUAL BACKUP'}</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest">Snapshot History</h3>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Retention: 30 Days</span>
              </div>
              <table className="w-full text-left">
                <thead className="bg-[#2F4F4F] text-[#87CEEB]">
                  <tr className="text-[9px] font-black uppercase tracking-widest">
                    <th className="px-8 py-4">Snapshot ID</th>
                    <th className="px-8 py-4">Creation Date</th>
                    <th className="px-8 py-4">Size</th>
                    <th className="px-8 py-4">Type</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-mono text-[11px]">
                  {backups.map(bk => (
                    <tr key={bk.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 font-bold text-[#2F4F4F]">{bk.id}</td>
                      <td className="px-8 py-6 text-gray-400">{bk.date}</td>
                      <td className="px-8 py-6 font-black text-[#2F4F4F]">{bk.size}</td>
                      <td className="px-8 py-6">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                          bk.type === 'MANUAL' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {bk.type}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-gray-300 hover:text-[#87CEEB] transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
              <Shield className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
              <h4 className="text-xl font-black uppercase tracking-tight mb-6 text-[#87CEEB]">Recovery Matrix</h4>
              <ul className="space-y-6 relative z-10">
                <li className="flex items-start">
                  <Clock className="w-5 h-5 mr-4 text-[#87CEEB] flex-none" />
                  <p className="text-[11px] text-gray-400 font-bold uppercase leading-relaxed">
                    Point-in-time recovery (PITR) available for the last <span className="text-white">72 hours</span>.
                  </p>
                </li>
                <li className="flex items-start">
                  <HardDrive className="w-5 h-5 mr-4 text-[#87CEEB] flex-none" />
                  <p className="text-[11px] text-gray-400 font-bold uppercase leading-relaxed">
                    Cross-region replication active: <span className="text-white">Lagos A -> Nairobi B</span>.
                  </p>
                </li>
              </ul>
              <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                INITIATE ROLLBACK (SECURE)
              </button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 text-center">
               <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle className="w-8 h-8 text-green-500" />
               </div>
               <h4 className="text-sm font-black text-[#2F4F4F] uppercase tracking-tight mb-2">Redundancy Verified</h4>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6 leading-relaxed">
                 Mirror node AG-ARENA-SEC-01 reports 100% data parity.
               </p>
               <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-full" />
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
