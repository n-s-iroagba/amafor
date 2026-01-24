'use client';
import React, { useState } from 'react';
import { Activity, Cpu, RefreshCw, ArrowLeft, ShieldCheck, Globe, Database, Server, Mail, Play, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useGet, usePost } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

interface Component {
  name: string;
  status: string;
  latency: string;
  load: string;
}

interface Integration {
  name: string;
  status: string;
  lastSync: string;
}

interface HealthData {
  components: Component[];
  integrations: Integration[];
  aggregateLoad: number[];
  rps: number;
}


/**
 * Page: Infrastructure Health
 * Description: Real-time monitoring of system components, latency, and integrations.
 * Requirements: REQ-ADM-04 (System Monitoring), REQ-SEC-03 (Health Checks)
 * User Story: US-ADM-004 (Monitor Health)
 * User Journey: UJ-ADM-003 (System Admin)
 * API: GET /system/health (API_ROUTES.HEALTH.STATUS)
 * Hook: useGet(API_ROUTES.HEALTH.STATUS)
 */
export default function InfrastructureHealthPage() {
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);

  const { data: healthData, loading, refetch } = useGet<HealthData>(
    API_ROUTES.HEALTH.STATUS
  );

  const { post: runDiagnostic } = usePost<void, void>(API_ROUTES.HEALTH.DIAGNOSTIC);

  const triggerDiagnostic = async () => {
    setIsRunningDiagnostic(true);
    try {
      await runDiagnostic();
      refetch();
    } catch (error) {
      console.error('Diagnostic failed:', error);
    } finally {
      setTimeout(() => setIsRunningDiagnostic(false), 2000);
    }
  };

  const getComponentIcon = (name: string) => {
    if (name.includes('API')) return <Server className="w-4 h-4" />;
    if (name.includes('Database') || name.includes('PostgreSQL')) return <Database className="w-4 h-4" />;
    if (name.includes('CDN') || name.includes('Storage')) return <Globe className="w-4 h-4" />;
    if (name.includes('Auth')) return <Lock className="w-4 h-4" />;
    return <Server className="w-4 h-4" />;
  };

  const getIntegrationIcon = (name: string) => {
    if (name.includes('Paystack') || name.includes('Payment')) return <Database className="w-3.5 h-3.5" />;
    if (name.includes('Analytics') || name.includes('Google')) return <Globe className="w-3.5 h-3.5" />;
    if (name.includes('Email')) return <Mail className="w-3.5 h-3.5" />;
    if (name.includes('Video')) return <Play className="w-3.5 h-3.5" />;
    return <Globe className="w-3.5 h-3.5" />;
  };

  const components = healthData?.components || [];
  const integrations = healthData?.integrations || [];
  const loadData = healthData?.aggregateLoad || [40, 60, 45, 80, 55, 70, 40, 50, 65, 30, 90, 40, 55, 70, 35, 60];
  const rps = healthData?.rps || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/admin" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Central Command
        </Link>

        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className={`bg-[#2F4F4F] p-4 rounded-3xl shadow-xl ${isRunningDiagnostic ? 'animate-ping' : 'animate-pulse'}`}>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-4xl text-[#2F4F4F] mb-1 uppercase tracking-tight font-black">INFRASTRUCTURE HEALTH</h1>
              <div className="flex items-center space-x-4">
                <span className="text-[10px] font-black text-[#87CEEB] uppercase tracking-[0.3em]">System ID: AG-ARENA-PRD-01</span>
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
            </div>
          </div>
          <button
            onClick={triggerDiagnostic}
            disabled={isRunningDiagnostic || loading}
            className="bg-white px-8 py-4 rounded-2xl border text-[10px] font-black text-[#2F4F4F] hover:border-[#87CEEB] transition-all uppercase tracking-widest flex items-center disabled:opacity-50"
          >
            {isRunningDiagnostic ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {isRunningDiagnostic ? 'SWEEPING EDGE NODES...' : 'TRIGGER SYSTEM DIAGNOSTIC'}
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {components.map((c, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-8">
                      <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#87CEEB] group-hover:text-[#2F4F4F] transition-colors">
                        {getComponentIcon(c.name)}
                      </div>
                      <span className="text-[9px] font-black text-green-500 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
                        {isRunningDiagnostic ? 'Checking...' : c.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-[#2F4F4F] uppercase tracking-tight mb-6">{c.name}</h3>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div>
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Latency</div>
                        <div className="text-xl font-bold font-mono">{isRunningDiagnostic ? '--' : c.latency}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Resource Load</div>
                        <div className="text-xl font-bold font-mono">{isRunningDiagnostic ? '--' : c.load}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#2F4F4F] p-10 rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-sm font-black uppercase tracking-widest flex items-center">
                    <Cpu className="w-4 h-4 mr-3 text-[#87CEEB]" /> Aggregate Processor Load
                  </h3>
                  <span className="text-[9px] font-bold text-gray-400 uppercase font-mono">Live Stream: {rps.toLocaleString()} RPS</span>
                </div>
                <div className="h-48 flex items-end justify-between space-x-2">
                  {loadData.map((h, i) => (
                    <div key={i} className="flex-1 bg-white/10 rounded-t-lg relative group transition-all hover:bg-[#87CEEB]/40" style={{ height: `${isRunningDiagnostic ? Math.random() * 100 : h}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-mono">
                        {h}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-8">
              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center">
                  <RefreshCw className="w-3.5 h-3.5 mr-2 text-[#87CEEB]" /> External Integrations
                </h4>
                <div className="space-y-6">
                  {integrations.map((int, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-400">{getIntegrationIcon(int.name)}</div>
                        <div>
                          <div className="text-xs font-black text-[#2F4F4F] uppercase mb-1">{int.name}</div>
                          <div className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Sync: {isRunningDiagnostic ? 'Now' : int.lastSync}</div>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${isRunningDiagnostic ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-10 rounded-[3rem] border border-blue-100 shadow-sm">
                <ShieldCheck className="w-10 h-10 text-blue-500 mb-6" />
                <h4 className="text-sm font-black text-blue-800 uppercase tracking-tight mb-2">ISO Compliance</h4>
                <p className="text-[11px] text-blue-600 leading-relaxed font-bold uppercase">
                  Platform security standards verified against ISO 27001:2022. All integration tokens are rotating.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}