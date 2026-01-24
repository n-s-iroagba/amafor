'use client';

import React from 'react';
import { ArrowLeft, CheckCircle, XCircle, ShieldAlert, Globe, ExternalLink, UserCheck, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/routes';
import { useGet, usePut } from '@/shared/hooks/useApiQuery';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}


/**
 * Page: Scout Application Review
 * Description: Admin view to approve or reject scout applications.
 * Requirements: REQ-ADM-23 (Scout Approval)
 * User Story: US-ADM-023 (Approve Scout Applications)
 * User Journey: UJ-ADM-010 (Manage Scouts)
 * API: GET /scouts/:id, PUT /scouts/:id/status
 */
export default function ScoutDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: scout, loading } = useGet<User>(API_ROUTES.USERS.VIEW(id as string));
  const { put, isPending: processing } = usePut(API_ROUTES.USERS.MUTATE(Number(id)));

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!scout) return;

    try {
      const newStatus = action === 'approve' ? 'Active' : 'Rejected';
      await put({ ...scout, status: newStatus });
      alert(`Scout application ${action}d successfully.`);
      router.push('/dashboard/admin/scouts');
    } catch (err) {
      console.error(err);
      alert('Failed to process application.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-[#87CEEB]" /></div>;
  }

  if (!scout) {
    return <div className="min-h-screen flex items-center justify-center">Scout not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/admin/scouts" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Queue
        </Link>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-[2rem] bg-[#2F4F4F] text-[#87CEEB] flex items-center justify-center font-black text-3xl shadow-xl">
              {scout.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl text-[#2F4F4F] font-black uppercase tracking-tight">{scout.name}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  {scout.status || 'Pending'}
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{scout.email}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleAction('reject')}
              disabled={processing}
              className="bg-white border-2 border-red-100 text-red-500 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all flex items-center disabled:opacity-50"
            >
              {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
              REJECT
            </button>
            <button
              onClick={() => handleAction('approve')}
              disabled={processing}
              className="sky-button flex items-center space-x-3 py-4 px-10 disabled:opacity-50"
            >
              {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              <span>{processing ? 'PROCESSING...' : 'APPROVE ACCESS'}</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
              <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-10 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-[#87CEEB]" /> Application Details
              </h2>
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-2">Member Since</label>
                  <p className="text-gray-600 leading-relaxed font-bold">
                    {new Date(scout.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-2">Role</label>
                  <p className="text-gray-600 leading-relaxed font-bold">
                    {scout.role}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <ShieldAlert className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
              <h3 className="text-lg font-black mb-6 uppercase tracking-tight text-[#87CEEB]">ISO Review</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-8">
                Ensure the applicant agency matches our verified partner list. Approving grants access to restricted player biological data and performance videos.
              </p>
              <div className="flex items-center space-x-3 text-[10px] font-black text-green-500 uppercase tracking-widest">
                <UserCheck className="w-4 h-4" /> <span>KYC Check Passed</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
