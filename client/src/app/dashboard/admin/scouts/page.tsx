'use client';

import React from 'react';
import { UserCheck, ShieldCheck, ChevronRight, Loader2, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { API_ROUTES } from '@/config/routes';
import { useGet } from '@/shared/hooks/useApiQuery';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}


/**
 * Page: Scout Verification Queue
 * Description: Admin review of professional scout access applications.
 * Requirements: REQ-ADM-03 (Scout Verification)
 * User Story: US-ADM-003 (Verify Scouts)
 * User Journey: UJ-ADM-006 (Talent ID)
 * API: GET /users (API_ROUTES.USERS.LIST - filtered by role)
 * Hook: useGet(API_ROUTES.USERS.LIST)
 */
export default function ScoutVerificationQueue() {
  const { data: usersData, loading } = useGet<User[]>(API_ROUTES.USERS.LIST);

  const applications = Array.isArray(usersData)
    ? usersData.filter(u => u.role === 'Scout')
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/admin" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Dashboard
        </Link>

        <header className="mb-12">
          <div className="flex items-center space-x-4 mb-2">
            <UserCheck className="w-6 h-6 text-[#87CEEB]" />
            <h1 className="text-4xl text-[#2F4F4F] uppercase tracking-tight">Scout Verification Queue (ADM-03)</h1>
          </div>
          <p className="text-gray-500 text-sm">Review applications for professional scout access. All approvals are logged for ISO compliance.</p>
        </header>

        {loading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin w-8 h-8 text-[#87CEEB] mx-auto" /></div>
        ) : (
          <div className="space-y-6">
            {applications.map(app => (
              <div key={app.id} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-12 transition-all hover:shadow-xl group">
                <div className="flex-1 space-y-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center text-[#2F4F4F] font-black text-3xl shadow-inner border border-gray-100 group-hover:bg-[#87CEEB]/10 transition-colors">
                      {app.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#2F4F4F] uppercase tracking-tight">{app.name}</h3>
                      <div className="flex items-center text-sm text-[#87CEEB] font-black uppercase tracking-widest">
                        {app.email}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Status</h4>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${app.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                        {app.status || 'Pending'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Applied Date</h4>
                      <p className="text-sm text-gray-500 font-bold">{new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:w-80 flex flex-col justify-center space-y-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-8 lg:pt-0 lg:pl-12">
                  <Link href={`/dashboard/admin/scouts/${app.id}`} className="w-full py-4 bg-[#2F4F4F] text-[#87CEEB] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center hover:bg-[#87CEEB] hover:text-[#2F4F4F] transition-all">
                    VIEW DOSSIER <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}

            {applications.length === 0 && (
              <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                <ShieldCheck className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <h3 className="text-xl text-gray-300 font-black uppercase tracking-widest">Queue is currently clear</h3>
                <button onClick={() => window.location.reload()} className="mt-8 text-[#87CEEB] font-black text-[10px] uppercase tracking-widest hover:underline">Refresh List</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}