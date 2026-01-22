'use client';
import React from 'react';
import { Shield, Users, Activity, Bell, FileSearch, Settings, ChevronRight, UserCheck, TrendingUp, BarChart2, UserCircle, Calendar, Heart, DollarSign, HardDrive, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

interface DashboardStats {
  revenue: {
    total: number;
    advertising: number;
    donations: number;
    patronage: number;
  };
  infrastructure: {
    uptime: string;
    securityAudit: string;
    apiLatency: string;
  };
}

export default function AdminDashboard() {
  const pathname = usePathname();

  const { data: stats, loading } = useGet<DashboardStats>(
    API_ROUTES.ANALYTICS.DASHBOARD
  );

  const navItems = [
    { name: 'Dashboard', path: '/dashboard/admin', icon: <Activity className="w-4 h-4" /> },
    { name: 'User Management', path: '/dashboard/admin/users', icon: <Users className="w-4 h-4" /> },
    { name: 'Scout Verification', path: '/dashboard/admin/scouts', icon: <UserCheck className="w-4 h-4" /> },
    { name: 'Advertiser Verification', path: '/dashboard/admin/advertisers', icon: <Shield className="w-4 h-4" /> },
    { name: 'Roster Management', path: '/dashboard/admin/players', icon: <UserCircle className="w-4 h-4" /> },
    { name: 'Fixtures & Results', path: '/dashboard/admin/leagues', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Patronage Program', path: '/dashboard/admin/patrons', icon: <Heart className="w-4 h-4" /> },
    { name: 'Advertising Rates', path: '/dashboard/admin/ad-plans', icon: <DollarSign className="w-4 h-4" /> },
    { name: 'Audit Trails', path: '/dashboard/admin/audit', icon: <FileSearch className="w-4 h-4" /> },
    { name: 'Notifications', path: '/dashboard/admin/notifications', icon: <Bell className="w-4 h-4" /> },
    { name: 'Infra Health', path: '/dashboard/admin/health', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Data Backups', path: '/dashboard/admin/backups', icon: <HardDrive className="w-4 h-4" /> },
    { name: 'System Settings', path: '/dashboard/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const revenueData = stats?.revenue || {
    total: 0,
    advertising: 0,
    donations: 0,
    patronage: 0,
  };

  const infraData = stats?.infrastructure || {
    uptime: 'Loading...',
    securityAudit: 'Loading...',
    apiLatency: 'Loading...',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-[#2F4F4F] hidden lg:flex flex-col text-white sticky top-0 h-screen">
        <div className="p-8 border-b border-white/5 flex items-center space-x-3">
          <Shield className="w-8 h-8 text-[#87CEEB]" />
          <span className="font-black text-xs tracking-widest uppercase">Admin Command</span>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${pathname === item.path ? 'bg-[#87CEEB] text-[#2F4F4F]' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
            >
              {item.icon} <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5 text-[9px] text-white/20 font-black tracking-widest">
          ISO 27001:2022 SECURE CONSOLE
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="text-[10px] font-black text-[#87CEEB] uppercase tracking-[0.3em] mb-2">Central Infrastructure Console</div>
            <h1 className="text-4xl text-[#2F4F4F]">Arena Operations</h1>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">System Optimal</span>
          </div>
        </header>

        {/* BRD Requirement: DEV-16 Audit Trail */}
        <div className="mb-8 flex items-center gap-2 text-xs text-slate-500 bg-slate-100 p-2 rounded-lg w-fit">
          <FileSearch className="w-3 h-3" />
          <span>All admin actions are immutably logged per ISO 27001:2022 (BR-SEC-03).</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest flex items-center">
                  <BarChart2 className="w-5 h-5 mr-3 text-[#87CEEB]" /> Revenue by Source
                </h2>
                <div className="text-3xl font-black text-[#2F4F4F]">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : formatCurrency(revenueData.total)}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Advertising</div>
                  <div className="text-xl font-bold text-[#2F4F4F]">
                    {loading ? '...' : formatCurrency(revenueData.advertising)}
                  </div>
                  <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: revenueData.total ? `${(revenueData.advertising / revenueData.total) * 100}%` : '0%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Donations</div>
                  <div className="text-xl font-bold text-[#2F4F4F]">
                    {loading ? '...' : formatCurrency(revenueData.donations)}
                  </div>
                  <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: revenueData.total ? `${(revenueData.donations / revenueData.total) * 100}%` : '0%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Patronage</div>
                  <div className="text-xl font-bold text-[#2F4F4F]">
                    {loading ? '...' : formatCurrency(revenueData.patronage)}
                  </div>
                  <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#87CEEB] h-full" style={{ width: revenueData.total ? `${(revenueData.patronage / revenueData.total) * 100}%` : '0%' }} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-10">Infrastructure Health (ADM-17)</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Platform Uptime</div>
                  <div className="text-lg font-black text-[#2F4F4F]">{infraData.uptime}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Security Audit</div>
                  <div className="text-lg font-black text-[#2F4F4F]">{infraData.securityAudit}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">API Latency</div>
                  <div className="text-lg font-black text-[#2F4F4F]">{infraData.apiLatency}</div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-xl">
              <Shield className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
              <h4 className="text-lg mb-4 font-black uppercase tracking-tight">ISO Compliance</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-8">
                Platform metrics verified against ISO 27001 standard. All financial data encrypted at rest.
              </p>
              <Link href="/dashboard/admin/settings" className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-[#2F4F4F] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center block">
                SECURITY CONFIG
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div >
  );
}