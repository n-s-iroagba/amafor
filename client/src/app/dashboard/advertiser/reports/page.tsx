'use client';
import React, { useState, useMemo } from 'react';
// Added Megaphone to the lucide-react import list to resolve the "Cannot find name 'Megaphone'" error
import { Calendar, Download, Search, ArrowLeft, BarChart3, FileText, ChevronRight, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
/**
 * Page: Advertiser Reports
 * Description: Historical performance reports and analytics.
 * Requirements: REQ-ADV-05 (Detailed Reports)
 * User Story: US-ADV-006 (View Analytics)
 * User Journey: UJ-ADV-003 (Performance Review)
 * API: GET /ads/reports (API_ROUTES.ADVERTISER.REPORTS)
 * Hook: useGet(API_ROUTES.ADVERTISER.REPORTS)
 */
export default function HistoricalReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const { data: reportData, loading } = useGet<any>(API_ROUTES.ADVERTISER.REPORTS);
  const history = reportData?.campaigns || [];
  const summary = reportData?.summary || { totalSpend: 0, totalViews: 0 };

  const filteredHistory = useMemo(() => {
    return history.filter((item: any) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().includes(searchTerm)
    );
  }, [history, searchTerm]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/advertiser" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest translation-colors" data-testid="link-back-dashboard">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Dashboard
        </Link>

        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl text-[#2F4F4F] mb-2 uppercase tracking-tight">Historical Reports</h1>
            <p className="text-gray-500 text-sm">Analyze and export performance data for all past campaigns.</p>
          </div>
          <button className="sky-button flex items-center space-x-3 text-xs tracking-widest" data-testid="btn-export-reports">
            <Download className="w-4 h-4" />
            <span>EXPORT ALL DATA (CSV)</span>
          </button>
        </header>

        {/* Filters (REQ-ADV-05) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-12 flex flex-wrap items-center gap-8">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by campaign name or ID..."
              className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#87CEEB] text-sm"
              data-testid="input-search-reports"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-gray-50 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#2F4F4F] outline-none border-none focus:ring-2 focus:ring-[#87CEEB]"
              data-testid="select-date-range"
            >
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
              <option>All Time</option>
            </select>
          </div>
        </div>

        {/* Reports Table (REQ-ADV-05) */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading reports...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-[#2F4F4F] text-[#87CEEB]">
                <tr className="text-[10px] font-black uppercase tracking-widest">
                  <th className="px-10 py-6">Campaign</th>
                  <th className="px-10 py-6">Date</th>
                  <th className="px-10 py-6">Total Views</th>
                  <th className="px-10 py-6">Total Spend</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredHistory.map((item: any) => (
                  <tr key={item.id} className="group hover:bg-gray-50 transition-colors" data-testid={`report-row-${item.id}`}>
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gray-100 rounded-xl">
                          <FileText className="w-4 h-4 text-[#2F4F4F]" />
                        </div>
                        <span className="font-bold text-[#2F4F4F] text-lg">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-xs font-bold text-gray-500 uppercase tracking-tighter">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-10 py-8 font-black text-[#2F4F4F]">{item.views}</td>
                    <td className="px-10 py-8 font-mono text-xs font-bold">₦{Number(item.spend).toLocaleString()}</td>
                    <td className="px-10 py-8">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <button className="p-3 hover:bg-[#87CEEB]/10 rounded-xl transition-all group-hover:text-[#87CEEB]">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-10 py-8 text-center text-gray-500">No reports found via API.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary (ADV-05 Enhancement) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-8">
            <div className="bg-[#2F4F4F]/5 p-6 rounded-[2rem]">
              <BarChart3 className="w-10 h-10 text-[#87CEEB]" />
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lifetime Spend</div>
              <div className="text-3xl font-black text-[#2F4F4F]">₦{Number(summary.totalSpend).toLocaleString()}</div>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-8">
            <div className="bg-[#2F4F4F]/5 p-6 rounded-[2rem]">
              <Megaphone className="w-10 h-10 text-[#2F4F4F]" />
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Views Delivered</div>
              <div className="text-3xl font-black text-[#2F4F4F]">{Number(summary.totalViews).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
