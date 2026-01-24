'use client';
import React, { useState } from 'react';
import { Shield, FileSearch, Download, Filter, Calendar, Clock, User, Activity, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useGet, usePost } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  details?: string;
}

interface AuditStats {
  totalLogs: number;
  todayLogs: number;
  avgLogsPerDay: number;
}


/**
 * Page: Audit Trail
 * Description: Immutable log of all administrative and sensitive actions for security compliance.
 * Requirements: REQ-ADM-05 (Audit Logging)
 * User Story: US-ADM-005 (View Audit Logs)
 * User Journey: UJ-ADM-004 (Compliance Review)
 * API: GET /system/audit (API_ROUTES.AUDIT.LIST), POST /system/audit/export (API_ROUTES.AUDIT.EXPORT)
 * Hook: useGet(API_ROUTES.AUDIT.LIST), usePost(API_ROUTES.AUDIT.EXPORT)
 */
export default function AuditTrailDashboard() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [exporting, setExporting] = useState(false);

  const { data: response, loading: logsLoading } = useGet<any>(
    API_ROUTES.AUDIT.LIST
  );

  const logs: AuditLog[] = response?.data || [];

  const { post: exportLogs } = usePost<{ dateFrom: string; dateTo: string; format: string }, Blob>(
    API_ROUTES.AUDIT.EXPORT
  );

  // Calculate stats from logs
  const totalLogs = logs?.length || 0;
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs?.filter((log: AuditLog) => log.timestamp.startsWith(today)).length || 0;
  const avgLogsPerDay = totalLogs > 0 ? Math.round(totalLogs / 30) : 0;

  const stats = [
    { label: 'Total Log Entries', value: totalLogs.toLocaleString(), icon: <Activity className="w-4 h-4" /> },
    { label: 'Today\'s Actions', value: todayLogs.toLocaleString(), icon: <Calendar className="w-4 h-4" /> },
    { label: 'Avg/Day (30d)', value: avgLogsPerDay.toLocaleString(), icon: <Clock className="w-4 h-4" /> },
  ];

  const handleExport = async () => {
    if (!dateFrom || !dateTo) {
      alert('Please select date range');
      return;
    }

    setExporting(true);
    try {
      const blob = await exportLogs({ dateFrom, dateTo, format: 'csv' });
      if (blob) {
        const url = window.URL.createObjectURL(blob as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${dateFrom}-to-${dateTo}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <Link href="/dashboard/admin" className="text-[10px] font-black text-[#87CEEB] uppercase tracking-[0.3em] mb-2 block hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl text-[#2F4F4F] flex items-center gap-4">
            <FileSearch className="w-10 h-10 text-[#87CEEB]" />
            Audit Trail System
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm outline-none"
              placeholder="From"
            />
            <span className="text-gray-300">→</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm outline-none"
              placeholder="To"
            />
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="sky-button flex items-center gap-2 py-3 disabled:opacity-50"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            EXPORT AUDIT BUNDLE
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#2F4F4F] text-[#87CEEB] rounded-xl">{stat.icon}</div>
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-3xl font-black text-[#2F4F4F]">
              {logsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest">Recent Audit Entries</h2>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#2F4F4F]">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>
        {logsLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-4 text-gray-400">Loading audit logs...</p>
          </div>
        ) : logs && logs.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4">Timestamp</th>
                <th className="px-8 py-4">Action</th>
                <th className="px-8 py-4">Entity</th>
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.slice(0, 20).map(log => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 text-sm text-gray-500 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-[#87CEEB]/10 text-[#2F4F4F] rounded-full text-[10px] font-black uppercase">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm text-gray-700">
                    {log.entityType} <span className="text-gray-400">#{log.entityId}</span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{log.userName || log.userId}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm font-mono text-gray-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <FileSearch className="w-12 h-12 mx-auto mb-4 text-gray-200" />
            <p>No audit logs found</p>
          </div>
        )}
      </div>

      {/* ISO Compliance Note */}
      <div className="mt-8 flex items-center gap-2 text-xs text-slate-500 bg-slate-100 p-4 rounded-lg">
        <Shield className="w-4 h-4" />
        <span>All audit entries are immutably stored per ISO 27001:2022 and NDPR compliance requirements (BR-SEC-03). Logs retained for 7 years.</span>
      </div>
    </div>
  );
}
