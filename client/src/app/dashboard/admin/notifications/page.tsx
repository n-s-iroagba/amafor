'use client';
import React, { useState } from 'react';
import { Bell, Shield, AlertTriangle, CreditCard, UserCheck, CheckCircle, ArrowLeft, MoreHorizontal, Filter, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function SystemNotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const notifications = [
    { id: 'n1', type: 'SECURITY', severity: 'CRITICAL', title: 'Multiple Failed Login Attempts', message: 'User ID: 8829 detected from unauthorized IP 185.x.x.x', time: '12 mins ago' },
    { id: 'n2', type: 'PAYMENT', severity: 'WARNING', title: 'Subscription Settlement Failed', message: 'Patron: Bello Ibrahim (NGN 25,000). Reference: PSK_4402', time: '1 hour ago' },
    { id: 'n3', type: 'USER', severity: 'INFO', title: 'New Scout Application', message: 'Agency: EuroTalent Hub submitted verification request.', time: '3 hours ago' },
    { id: 'n4', type: 'SYSTEM', severity: 'INFO', title: 'Automated Backup Completed', message: 'Snapshot ID: BKP_20240520_UTC. Integrity verified 100%.', time: '5 hours ago' },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'SECURITY': return <Shield className="w-5 h-5 text-red-500" />;
      case 'PAYMENT': return <CreditCard className="w-5 h-5 text-amber-500" />;
      case 'USER': return <UserCheck className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/admin" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Dashboard
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl text-[#2F4F4F] mb-2 uppercase tracking-tight">Notification Command (ADM-13)</h1>
            <p className="text-gray-500 text-sm">Monitor and resolve system-wide alerts, security triggers, and financial signals.</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white px-6 py-4 rounded-2xl border text-[10px] font-black text-[#2F4F4F] hover:bg-gray-50 transition-all uppercase tracking-widest">
              MARK ALL READ
            </button>
            <button className="bg-red-50 px-6 py-4 rounded-2xl text-[10px] font-black text-red-600 hover:bg-red-100 transition-all uppercase tracking-widest flex items-center">
              <Trash2 className="w-3.5 h-3.5 mr-2" /> CLEAR RESOLVED
            </button>
          </div>
        </header>

        {/* Filter Toolbar */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm mb-8 border border-gray-100 flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-1">
            {['ALL', 'SECURITY', 'PAYMENT', 'USER', 'SYSTEM'].map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all ${
                  activeFilter === f ? 'bg-[#2F4F4F] text-[#87CEEB]' : 'bg-gray-50 text-gray-400 hover:text-[#2F4F4F]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
            <input type="text" placeholder="Search alerts..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-1 focus:ring-[#87CEEB] text-sm" />
          </div>
        </div>

        {/* Alerts Stack */}
        <div className="space-y-4">
          {notifications.map(notif => (
            <div key={notif.id} className={`bg-white rounded-[2rem] p-8 shadow-sm border-l-8 transition-all hover:shadow-md cursor-pointer ${
              notif.severity === 'CRITICAL' ? 'border-red-500' : notif.severity === 'WARNING' ? 'border-amber-500' : 'border-blue-500'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-gray-50 rounded-2xl shadow-inner">
                    {getIcon(notif.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                        notif.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {notif.severity}
                      </span>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{notif.time}</span>
                    </div>
                    <h3 className="text-xl font-black text-[#2F4F4F] uppercase tracking-tight">{notif.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mt-2 max-w-2xl">{notif.message}</p>
                  </div>
                </div>
                <button className="p-3 text-gray-300 hover:text-[#2F4F4F] hover:bg-gray-50 rounded-xl transition-all">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-[#2F4F4F] rounded-[3rem] text-white relative overflow-hidden">
          <Shield className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-black uppercase tracking-tight text-[#87CEEB] mb-1">Push Notifications: Active</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Global Admin Alerting Protocol v4.2</p>
            </div>
            <button className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              CONFIGURE WEBHOOKS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
