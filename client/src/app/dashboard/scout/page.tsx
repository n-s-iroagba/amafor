'use client';
import React from 'react';
import { Shield, Search, Film, UserSearch, Clock, ChevronRight, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { useAuthContext } from '@/shared/hooks/useAuthContext';

interface RecentView {
  id: string;
  name: string;
  position: string;
  age: number;
  imageUrl: string;
}


/**
 * Page: Scout Dashboard Overview
 * Description: Central hub for authenticated scouts showing assigned matches and recent views.
 * Requirements: REQ-SCT-03 (Scout Dashboard)
 * User Story: US-SCT-003 (View Assignments)
 * User Journey: UJ-SCT-002 (Scouting Workflow)
 * API: GET /scout/recent-views (API_ROUTES.SCOUT.RECENT_VIEWS)
 * Hook: useGet(API_ROUTES.SCOUT.RECENT_VIEWS)
 */
export default function ScoutDashboard() {
  const { user, loading: authLoading } = useAuthContext();

  const { data: recentlyViewed, loading: viewsLoading } = useGet<RecentView[]>(
    API_ROUTES.SCOUT.RECENT_VIEWS,
    { enabled: user?.isApproved }
  );

  const loading = authLoading;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mini Sidebar for Dashboard */}
      <aside className="w-20 bg-[#2F4F4F] hidden lg:flex flex-col items-center py-8 space-y-8">
        <Shield className="w-8 h-8 text-[#87CEEB]" />
        <div className="space-y-6">
          <Link href="/dashboard/scout" className="p-3 bg-[#87CEEB] rounded-xl block text-[#2F4F4F]" data-testid="sidebar-link-scout-home"><UserSearch className="w-6 h-6" /></Link>
          <Link href="/dashboard/scout/reports" className="p-3 text-white/50 hover:text-white block" data-testid="sidebar-link-scout-reports"><FileText className="w-6 h-6" /></Link>
          <Link href="/dashboard/scout/matches" className="p-3 text-white/50 hover:text-white block" data-testid="sidebar-link-scout-matches"><Film className="w-6 h-6" /></Link>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="text-[10px] font-black text-[#87CEEB] uppercase tracking-[0.3em] mb-2">Authenticated Scout Portal</div>
            <h1 className="text-4xl text-[#2F4F4F]">
              Welcome, {loading ? '...' : user?.firstName || 'Scout'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </header>

        {/* BRD Requirement: DEV-01 Manual Approval */}
        {user && !user.isApproved ? (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded-r shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex-shrink-0 mb-4">
                <Shield className="h-12 w-12 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-800 mb-2">Account Pending Verification</h3>
                <p className="text-yellow-700 max-w-xl mx-auto">
                  Your scout access is currently awaiting manual approval by our Commercial Manager.
                  Standard review time is 2 business days. You will receive an email notification once approved.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Quick Actions */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
              <Link href="/dashboard/scout/players" className="group bg-[#2F4F4F] p-10 rounded-[2.5rem] text-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden" data-testid="link-quick-players">
                <Shield className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
                <div className="bg-[#87CEEB] w-12 h-12 rounded-xl flex items-center justify-center mb-8">
                  <Search className="w-6 h-6 text-[#2F4F4F]" />
                </div>
                <h3 className="text-2xl mb-2">Player Directory</h3>
                <p className="text-gray-400 text-sm mb-6">Access verified performance metrics and historical data.</p>
                <div className="flex items-center text-[#87CEEB] text-xs font-black tracking-widest uppercase">
                  Browse Talent <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link href="/dashboard/scout/reports" className="group bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all" data-testid="link-quick-reports">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center mb-8">
                  <FileText className="w-6 h-6 text-[#2F4F4F]" />
                </div>
                <h3 className="text-2xl mb-2 text-[#2F4F4F]">Saved Reports</h3>
                <p className="text-gray-500 text-sm mb-6">View and download your generated scout dossiers.</p>
                <div className="flex items-center text-[#2F4F4F] text-xs font-black tracking-widest uppercase">
                  Open Vault <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link href="/dashboard/scout/matches" className="group bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all md:col-span-2" data-testid="link-quick-matches">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center mb-8">
                  <Film className="w-6 h-6 text-[#2F4F4F]" />
                </div>
                <h3 className="text-2xl mb-2 text-[#2F4F4F]">Fixture Archives</h3>
                <p className="text-gray-500 text-sm mb-6">Full fixture footage available 30 minutes post-whistle for tactical analysis.</p>
                <div className="flex items-center text-[#2F4F4F] text-xs font-black tracking-widest uppercase">
                  Open Library <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Recently Viewed */}
            <section className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest">Recently Viewed</h2>
                <Clock className="w-4 h-4 text-gray-300" />
              </div>
              <div className="space-y-6">
                {viewsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : !recentlyViewed || recentlyViewed.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No recently viewed players</p>
                ) : (
                  recentlyViewed.map(player => (
                    <Link key={player.id} href={`/dashboard/scout/players/${player.id}`} className="flex items-center space-x-4 group" data-testid={`recent-view-item-${player.id}`}>
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-none">
                        <img src={player.imageUrl} className="w-full h-full object-cover" alt={player.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#2F4F4F] truncate group-hover:text-[#87CEEB] transition-colors">{player.name}</h4>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{player.position} | {player.age} Yrs</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-[#87CEEB]" />
                    </Link>
                  ))
                )}
              </div>
              <button className="w-full mt-10 py-4 bg-gray-50 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#87CEEB] hover:text-[#2F4F4F] transition-all" data-testid="btn-view-search-history">
                View Search History
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}