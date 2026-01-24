'use client';
import React, { useState } from 'react';
import { FileText, Download, Trash2, Search, ArrowLeft, Shield, Eye, Filter, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useGet } from '@/shared/hooks/useApiQuery';


/**
 * Page: Scout Reports List
 * Description: Archive of generated scout reports and dossiers.
 * Requirements: REQ-SCT-04 (Report Management)
 * User Story: US-SCT-004 (Manage Reports)
 * User Journey: UJ-SCT-003 (Report Generation)
 * API: GET /scout/reports (API_ROUTES.SCOUT.REPORTS)
 * Hook: useGet(API_ROUTES.SCOUT.REPORTS)
 */
export default function ScoutReportsPage() {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { data: reportsData, loading, refetch } = useGet<any[]>('/scout/reports');
  const reports = reportsData || [];

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    // In a real implementation, call useDelete hook or API
    // For now we just simulate local removal update after API call
    try {
      await fetch(`/api/scout/reports/${id}`, { method: 'DELETE' });
      refetch();
    } catch (e) {
      console.error(e);
    }
    setIsDeleting(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard/scout" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Portal
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl text-[#2F4F4F] font-black uppercase tracking-tight">Saved Scout Reports</h1>
          <p className="text-gray-500 text-sm mt-2">Access your generated PDF dossiers and physiological performance exports.</p>
        </header>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-8 border border-gray-100 flex flex-wrap items-center gap-8">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
            <input type="text" placeholder="Search by player name or report ID..." className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-1 focus:ring-[#87CEEB] text-sm" />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select className="bg-gray-50 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#2F4F4F] border-none outline-none">
              <option>Most Recent</option>
              <option>By Player</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {reports.map(report => (
            <div key={report.id} className={`bg - white rounded - [2rem] p - 8 border border - gray - 100 flex flex - col md: flex - row items - center justify - between gap - 8 hover: shadow - xl transition - all group ${isDeleting === report.id ? 'opacity-50 grayscale' : ''}`}>
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#2F4F4F] group-hover:bg-[#87CEEB] transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#2F4F4F] uppercase tracking-tight">{report.player}</h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{report.type}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                    <span className="text-[10px] font-black text-[#87CEEB] uppercase tracking-widest">ID: {report.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-12">
                <div className="text-right hidden md:block">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Generated</div>
                  <div className="text-xs font-bold text-[#2F4F4F]">{report.date}</div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-4 bg-gray-50 text-gray-400 hover:text-[#87CEEB] hover:bg-[#87CEEB]/10 rounded-2xl transition-all">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-4 bg-gray-50 text-gray-400 hover:text-[#87CEEB] hover:bg-[#87CEEB]/10 rounded-2xl transition-all">
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    disabled={!!isDeleting}
                    className="p-4 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all disabled:opacity-30"
                  >
                    {isDeleting === report.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
              <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-gray-300 font-black uppercase tracking-widest">No documents found in vault</h3>
              <button onClick={() => window.location.reload()} className="mt-6 text-[#87CEEB] text-[10px] font-black uppercase tracking-widest hover:underline">Re-fetch Records</button>
            </div>
          )}
        </div>

        <div className="mt-12 p-10 bg-[#2F4F4F] rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
          <Shield className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
          <div className="relative z-10">
            <h4 className="text-lg font-black uppercase tracking-tight text-[#87CEEB] mb-2">Secure Document Vault</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-bold uppercase">
              All scouting reports are encrypted with your professional key. Documents are purged 365 days after generation unless archived.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}