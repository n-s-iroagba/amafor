'use client';

import React, { useState } from 'react';
import { Settings, Lock, Save, ArrowLeft, RefreshCw, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { API_ROUTES } from '@/config/routes';
import { useGet, usePut } from '@/shared/hooks/useApiQuery';

interface SystemStatus {
  maintenanceMode: boolean;
  scoutRegistration: boolean;
  rateLimit: number;
  sessionTimeout: number;
}


/**
 * Page: System Settings
 * Description: Configuration of global platform settings including maintenance mode and security thresholds.
 * Requirements: REQ-ADM-06 (System Configuration)
 * User Story: US-ADM-006 (Platform Settings)
 * User Journey: UJ-ADM-003 (System Config)
 * API: GET/PUT /api/admin/system-status (API_ROUTES.ADMIN.SYSTEM_STATUS)
 * Hook: useGet(API_ROUTES.ADMIN.SYSTEM_STATUS), usePut(API_ROUTES.ADMIN.SYSTEM_STATUS)
 */
export default function PlatformSettingsPage() {
  const { data: status, loading, refetch } = useGet<SystemStatus>(API_ROUTES.ADMIN.SYSTEM_STATUS);
  const { put, isPending: isSaving } = usePut(API_ROUTES.ADMIN.SYSTEM_STATUS);

  const [localStatus, setLocalStatus] = useState<SystemStatus>({
    maintenanceMode: false,
    scoutRegistration: true,
    rateLimit: 300,
    sessionTimeout: 60,
  });

  React.useEffect(() => {
    if (status) {
      setLocalStatus(status);
    }
  }, [status]);

  const handleToggle = (key: keyof SystemStatus) => {
    setLocalStatus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key: keyof SystemStatus, value: number) => {
    setLocalStatus(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await put(localStatus);
      alert('System settings updated successfully.');
      refetch();
    } catch (error) {
      console.error(error);
      alert('Failed to update settings.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-[#87CEEB]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/dashboard/admin" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Central Command
        </Link>

        <header className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-[#2F4F4F] p-3 rounded-2xl shadow-xl">
              <Settings className="w-8 h-8 text-[#87CEEB]" />
            </div>
            <h1 className="text-4xl text-[#2F4F4F] uppercase tracking-tighter font-black">System Config (ADM-16)</h1>
          </div>
          <p className="text-gray-500 text-sm">Global ecosystem parameters. High-level changes are mirrored to the security audit trail.</p>
        </header>

        <div className="space-y-6">
          {/* Operations Section */}
          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-10 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-[#87CEEB]" /> Operational Controls
            </h3>

            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div className="max-w-md">
                  <h4 className="text-lg font-black text-[#2F4F4F] uppercase tracking-tight">Maintenance Mode</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-bold uppercase mt-1">Restrict public access while performing core infrastructure updates.</p>
                </div>
                <button
                  onClick={() => handleToggle('maintenanceMode')}
                  className={`w-16 h-8 rounded-full p-1 transition-all duration-500 ${localStatus.maintenanceMode ? 'bg-[#87CEEB]' : 'bg-gray-200'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 transform ${localStatus.maintenanceMode ? 'translate-x-8' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-10">
                <div className="max-w-md">
                  <h4 className="text-lg font-black text-[#2F4F4F] uppercase tracking-tight">Scout Self-Registration</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-bold uppercase mt-1">Enable or disable the public onboarding path for professional scouts.</p>
                </div>
                <button
                  onClick={() => handleToggle('scoutRegistration')}
                  className={`w-16 h-8 rounded-full p-1 transition-all duration-500 ${localStatus.scoutRegistration ? 'bg-[#87CEEB]' : 'bg-gray-200'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 transform ${localStatus.scoutRegistration ? 'translate-x-8' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-10 flex items-center">
              <Lock className="w-4 h-4 mr-2 text-red-500" /> Security Thresholds
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Rate Limit (Req/Min)</label>
                <input
                  type="number"
                  value={localStatus.rateLimit}
                  onChange={(e) => handleChange('rateLimit', parseInt(e.target.value))}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-black text-lg focus:ring-2 focus:ring-[#87CEEB] outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Session Timeout (Mins)</label>
                <input
                  type="number"
                  value={localStatus.sessionTimeout}
                  onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-black text-lg focus:ring-2 focus:ring-[#87CEEB] outline-none"
                />
              </div>
            </div>
          </section>

          {/* Integration Section */}
          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-10 flex items-center">
              <RefreshCw className="w-4 h-4 mr-2 text-green-500" /> External API Endpoints
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Paystack_Logo.png" className="h-4 object-contain opacity-50 grayscale" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest">Paystack Gateway</div>
                    <div className="text-[9px] font-bold text-gray-400 font-mono">LIVE_KEY_8820...</div>
                  </div>
                </div>
                <button className="text-[9px] font-black text-[#87CEEB] uppercase tracking-widest hover:underline">Rotate Key</button>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-8">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="sky-button px-12 py-5 text-sm uppercase tracking-[0.2em] flex items-center group shadow-2xl shadow-[#87CEEB]/20 disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              {isSaving ? 'SAVING...' : 'COMMIT CHANGES'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
