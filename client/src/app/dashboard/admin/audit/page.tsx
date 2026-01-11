'use client';
import React from 'react';
import { Shield, FileSearch, Download, ArrowLeft, Clock, User, HardDrive, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function AuditLogPage() {
  const logs = [
    { id: 'l1', timestamp: '2024-05-20 14:02:11', user: 'ADM-RO-04', action: 'PLAYER_BIO_UPDATE', target: 'PLAYER#p1', ip: '192.168.1.42', status: 'Success' },
    { id: 'l2', timestamp: '2024-05-20 13:55:04', user: 'SYSTEM', action: 'API_KEY_ROTATION', target: 'GLOBAL_SEC', ip: 'internal', status: 'Success' },
    { id: 'l3', timestamp: '2024-05-20 13:42:59', user: 'CMS-ENG-02', action: 'ARTICLE_PUBLISHED', target: 'NEWS#a2', ip: '10.0.0.84', status: 'Success' },
    { id: 'l4', timestamp: '2024-05-20 12:15:33', user: 'ANON_USER', action: 'LOGIN_FAILURE', target: 'USER#u1', ip: '45.12.3.91', status: 'Warning' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/admin" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Central Command
        </Link>

        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className="bg-[#2F4F4F] p-4 rounded-3xl">
              <Terminal className="w-8 h-8 text-[#87CEEB]" />
            </div>
            <div>
              <h1 className="text-4xl text-[#2F4F4F] mb-2 uppercase tracking-tight">Security Audit Logs (ADM-11)</h1>
              <p className="text-gray-500 text-sm">Immutable records of all platform state changes. Verified ISO 27001 compliance.</p>
            </div>
          </div>
          <button className="sky-button flex items-center space-x-3 text-xs tracking-widest">
            <Download className="w-4 h-4" />
            <span>EXPORT AUDIT BUNDLE</span>
          </button>
        </header>

        {/* Audit Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Today\'s Events', value: '1,402', icon: <Terminal className="w-4 h-4" /> },
            { label: 'Security Flags', value: '2', icon: <Shield className="w-4 h-4" /> },
            { label: 'Admin Ops', value: '42', icon: <User className="w-4 h-4" /> },
            { label: 'DB Integrity', value: '100%', icon: <HardDrive className="w-4 h-4" /> }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-gray-50 rounded-xl text-[#2F4F4F]">{stat.icon}</div>
              <div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
                <div className="text-xl font-black text-[#2F4F4F]">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Logs Table */}
        <div className="bg-[#2F4F4F] rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
            <h3 className="text-xs font-black text-[#87CEEB] uppercase tracking-widest">Live Event Stream</h3>
            <div className="flex space-x-4">
              <input type="text" placeholder="Filter by User ID or IP..." className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white outline-none focus:border-[#87CEEB] w-64" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-black/10">
                  <th className="px-10 py-6">Timestamp (UTC)</th>
                  <th className="px-10 py-6">Actor Entity</th>
                  <th className="px-10 py-6">Operation Action</th>
                  <th className="px-10 py-6">Resource ID</th>
                  <th className="px-10 py-6">IP Origin</th>
                  <th className="px-10 py-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                {logs.map(log => (
                  <tr key={log.id} className="text-white/70 hover:bg-white/5 transition-colors">
                    <td className="px-10 py-6 whitespace-nowrap"><Clock className="w-3.5 h-3.5 inline mr-2 text-[#87CEEB]" /> {log.timestamp}</td>
                    <td className="px-10 py-6">{log.user}</td>
                    <td className="px-10 py-6 font-bold text-[#87CEEB]">{log.action}</td>
                    <td className="px-10 py-6 text-gray-500">{log.target}</td>
                    <td className="px-10 py-6">{log.ip}</td>
                    <td className="px-10 py-6">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                        log.status === 'Success' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-start">
          <Shield className="w-8 h-8 text-blue-500 mr-6 flex-none" />
          <div>
            <h4 className="text-sm font-black text-blue-800 uppercase mb-2 tracking-tight">Data Integrity Notice</h4>
            <p className="text-xs text-blue-600 leading-relaxed">
              These logs are signed cryptographically and mirrored to an off-site secure repository every 60 seconds. Any attempt to modify these records will trigger a system-wide security lockdown and notify the IT Security Lead (ADM-ITS-01).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
