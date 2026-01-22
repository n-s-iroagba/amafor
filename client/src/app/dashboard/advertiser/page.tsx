'use client';
import React from 'react';
import { LayoutDashboard, Megaphone, PlusCircle, TrendingUp, Users, MousePointer2, ChevronRight, BarChart3, AlertCircle, MessageSquare, Loader2, Shield } from 'lucide-react';
import Link from 'next/link';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { useAuthContext } from '@/shared/hooks/useAuthContext';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  delivered: number;
  target: number;
  spend: number;
}

interface Dispute {
  id: string;
  subject: string;
  status: 'open' | 'resolved' | 'pending';
  date: string;
}

interface AdvertiserStats {
  activeCampaigns: number;
  totalImpressions: number;
  uniqueViews: number;
  avgCpv: number;
}

export default function AdvertiserDashboard() {
  const { user, loading: authLoading } = useAuthContext();

  const { data: campaigns, loading: campaignsLoading } = useGet<Campaign[]>(
    API_ROUTES.ADVERTISER.CAMPAIGNS.LIST
  );

  const { data: disputes, loading: disputesLoading } = useGet<Dispute[]>(
    API_ROUTES.ADVERTISER.DISPUTES.LIST
  );

  const loading = authLoading || campaignsLoading || disputesLoading;

  // Calculate stats from campaigns
  const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
  const totalImpressions = campaigns?.reduce((sum, c) => sum + c.delivered, 0) || 0;
  const totalSpend = campaigns?.reduce((sum, c) => sum + c.spend, 0) || 0;
  const avgCpv = totalImpressions > 0 ? totalSpend / totalImpressions : 0;

  const stats = [
    { label: 'Active Campaigns', value: activeCampaigns.toString(), icon: <Megaphone className="w-5 h-5" />, color: 'bg-blue-500' },
    { label: 'Total Impressions', value: `${(totalImpressions / 1000).toFixed(1)}K`, icon: <Users className="w-5 h-5" />, color: 'bg-purple-500' },
    { label: 'Unique Views', value: `${(totalImpressions * 0.7 / 1000).toFixed(1)}K`, icon: <MousePointer2 className="w-5 h-5" />, color: 'bg-green-500' },
    { label: 'Avg. CPV', value: `₦${avgCpv.toFixed(2)}`, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-[#87CEEB]' },
  ];

  const recentCampaigns = campaigns?.slice(0, 3) || [];
  const openDisputes = disputes?.filter(d => d.status === 'open') || [];

  // Show pending verification if not approved
  if (user && !user.isApproved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded-r shadow-sm max-w-xl">
          <div className="flex flex-col items-center text-center">
            <Shield className="h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-yellow-800 mb-2">Account Pending Verification</h3>
            <p className="text-yellow-700">
              Your advertiser access is currently awaiting manual approval by our Commercial Manager.
              Standard review time is 2 business days. You will receive an email notification once approved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-20 bg-[#2F4F4F] hidden lg:flex flex-col items-center py-8 space-y-8">
        <div className="bg-[#87CEEB] p-2 rounded-lg">
          <LayoutDashboard className="w-6 h-6 text-[#2F4F4F]" />
        </div>
        <div className="space-y-6">
          <Link href="/dashboard/advertiser/campaigns" className="p-3 text-white/50 hover:text-white block"><Megaphone className="w-6 h-6" /></Link>
          <Link href="/dashboard/advertiser/reports" className="p-3 text-white/50 hover:text-white block"><BarChart3 className="w-6 h-6" /></Link>
          <Link href="/dashboard/advertiser/disputes" className="p-3 text-white/50 hover:text-white block"><AlertCircle className="w-6 h-6" /></Link>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="text-[10px] font-black text-[#87CEEB] uppercase tracking-[0.3em] mb-2">Advertiser Self-Service Portal</div>
            <h1 className="text-4xl text-[#2F4F4F]">{user?.firstName}'s Dashboard</h1>
          </div>
          <Link href="/dashboard/advertiser/campaigns/new" className="sky-button flex items-center space-x-3 py-4">
            <PlusCircle className="w-5 h-5" />
            <span>CREATE NEW CAMPAIGN</span>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl text-white ${stat.color}`}>{stat.icon}</div>
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : <TrendingUp className="w-4 h-4 text-green-500" />}
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-2xl font-black text-[#2F4F4F]">{loading ? '...' : stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest">Active Campaigns</h2>
                <Link href="/dashboard/advertiser/campaigns" className="text-xs font-bold text-[#87CEEB] hover:underline">View All</Link>
              </div>
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                {campaignsLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                  </div>
                ) : recentCampaigns.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">No campaigns yet</div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-8 py-4">Campaign Name</th>
                        <th className="px-8 py-4">Progress</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">Spend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentCampaigns.map(c => (
                        <tr key={c.id} className="group hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-6">
                            <Link href={`/dashboard/advertiser/campaigns/${c.id}`} className="font-bold text-[#2F4F4F] group-hover:text-[#87CEEB]">{c.name}</Link>
                          </td>
                          <td className="px-8 py-6">
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-2">
                              <div
                                className="bg-[#87CEEB] h-full"
                                style={{ width: `${(c.delivered / c.target) * 100}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">{c.delivered.toLocaleString()} / {c.target.toLocaleString()} Views</div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${c.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                              }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 font-mono text-xs font-bold">₦{c.spend.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest">Active Disputes</h2>
                <Link href="/dashboard/advertiser/disputes" className="text-xs font-bold text-[#87CEEB] hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {disputesLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                  </div>
                ) : openDisputes.length === 0 ? (
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center text-gray-400">No open disputes</div>
                ) : (
                  openDisputes.map(d => (
                    <div key={d.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-red-50 rounded-xl text-red-500">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#2F4F4F] uppercase">{d.id}: {d.subject}</div>
                          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Opened: {d.date}</div>
                        </div>
                      </div>
                      <Link href={`/dashboard/advertiser/disputes/${d.id}`} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <MessageSquare className="w-5 h-5 text-[#87CEEB]" />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <Megaphone className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight text-[#87CEEB]">Optimization Tips</h3>
              <div className="space-y-6 relative z-10">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <h4 className="text-[10px] font-black text-[#87CEEB] mb-2 uppercase tracking-widest">Video Engagement</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">Mid-article video ads have 3x higher CTR when placed in "Fixture Report" tags.</p>
                </div>
              </div>
              <button className="w-full mt-8 py-4 bg-[#87CEEB] text-[#2F4F4F] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                DOWNLOAD SPECS GUIDE
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}