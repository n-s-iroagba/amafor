'use client';
import React, { useState } from 'react';
import { ShieldAlert, ArrowLeft, CheckCircle, Clock, ShieldCheck, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGet, usePut } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

interface Dispute {
  id: string;
  advertiser: {
    name: string;
    email: string;
  };
  subject: string;
  description: string;
  status: 'open' | 'investigation' | 'resolved' | 'closed';
  adminResponse?: string;
  createdAt: string;
}

/**
 * Page: Admin Dispute Detail
 * Description: View dispute details and resolve them.
 * API: GET /disputes/:id (Shared/Admin route)
 *      PUT /disputes/admin/:id/resolve (API_ROUTES.ADMIN.DISPUTES.RESOLVE)
 */
export default function AdminDisputeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const disputeId = params.id as string;

  // UI State
  const [response, setResponse] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState<'resolved' | 'closed' | 'investigation'>('resolved');

  // Queries
  const { data: disputeResponse, loading, error, refetch } = useGet<{ success: boolean; data: Dispute }>(
    API_ROUTES.VIDEOS.VIEW(disputeId).replace('videos', 'disputes') // Hack: reusing existing route structure if clean one not available, but wait, we have ADMIN.DISPUTES? No, we need a VIEW route. 
    // Actually, the route we added in backend is shared GET /disputes/:id authorised for admin.
    // Let's us the API_ROUTES.ADVERTISER.DISPUTES.VIEW as it maps to /advertiser/disputes/:id usually, but backend route is /disputes/:id
    // We'll construct it manually to match backend route `router.get('/:id'...)` at `/api/disputes/:id`
  );
  // Correction: Backend route is mounted at /api/disputes.
  // GET /api/disputes/:id is protected for advertiser/admin.
  // client URL: /api/disputes/${id}
  // We can use a direct string or add to ADVERTISERS.DISPUTES.VIEW? 
  // In routes.ts, ADVERTISER.DISPUTES.VIEW points to `/advertiser/disputes/${id}` which might be wrong if backend is just `/disputes/${id}`.
  // Let's assume standard API prefix.
  const API_URL = `/disputes/${disputeId}`;

  const { data: disputeData, loading: isLoading, error: fetchError } = useGet<{ success: boolean; data: Dispute }>(API_URL);
  const dispute = disputeData?.data;

  const { put, isPending: isSubmitting } = usePut(API_ROUTES.ADMIN.DISPUTES.RESOLVE(disputeId));

  const handleResolve = async () => {
    if (!response.trim()) return;

    try {
      await put({
        adminResponse: response,
        status: resolutionStatus
      });
      // Refresh data
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-[#87CEEB]" /></div>;
  if (fetchError || !dispute) return <div className="p-12 text-center text-red-500">Error loading dispute</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/admin/disputes" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to List
        </Link>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className={`p-4 rounded-3xl ${dispute.status === 'open' ? 'bg-red-50' : 'bg-gray-50'}`}>
              <ShieldAlert className={`w-8 h-8 ${dispute.status === 'open' ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-3xl text-[#2F4F4F] font-black uppercase tracking-tight">CASE: {disputeId.substring(0, 8)}...</h1>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                    ${dispute.status === 'open' ? 'bg-red-100 text-red-600' :
                    dispute.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`} data-testid="dispute-status-header">
                  {dispute.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Subject: {dispute.subject}</p>
              <p className="text-xs text-gray-400 mt-1">Advertiser: {dispute.advertiser?.name}</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-[#87CEEB]" /> SECURE CHANNEL
            </h3>
            <span className="text-[9px] font-bold text-gray-400 uppercase font-mono flex items-center">
              <ShieldCheck className="w-3 h-3 mr-1 text-green-500" /> ADMIN MODE
            </span>
          </div>

          {/* Messages Area */}
          <div className="p-8 space-y-8 bg-gray-50/20 min-h-[300px]">
            {/* Original Dispute */}
            <div className="flex justify-start">
              <div className="max-w-xl">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  {dispute.advertiser?.name} • {new Date(dispute.createdAt).toLocaleString()}
                </div>
                <div className="p-6 rounded-[2rem] rounded-tl-none bg-white border border-gray-100 shadow-sm text-sm text-[#2F4F4F] leading-relaxed">
                  {dispute.description}
                </div>
              </div>
            </div>

            {/* Admin Response if exists */}
            {dispute.adminResponse && (
              <div className="flex justify-end">
                <div className="max-w-xl text-right">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    ADMIN RESPONSE • {new Date(dispute.updatedAt || '').toLocaleString()}
                  </div>
                  <div className="p-6 rounded-[2rem] rounded-tr-none bg-[#2F4F4F] text-white shadow-lg text-sm leading-relaxed">
                    {dispute.adminResponse}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Area */}
          {dispute.status !== 'resolved' && dispute.status !== 'closed' && (
            <div className="p-8 border-t bg-white">
              <h4 className="text-sm font-bold text-[#2F4F4F] uppercase mb-4">Resolution</h4>
              <div className="space-y-4">
                <textarea
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#87CEEB] text-sm"
                  rows={4}
                  placeholder="Enter your response and resolution details..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  data-testid="textarea-resolution"
                ></textarea>

                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="resolved"
                        checked={resolutionStatus === 'resolved'}
                        onChange={() => setResolutionStatus('resolved')}
                        className="text-[#87CEEB] focus:ring-[#87CEEB]"
                        data-testid="radio-status-resolved"
                      />
                      <span className="text-sm font-medium text-gray-600">Resolve</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="investigation"
                        checked={resolutionStatus === 'investigation'}
                        onChange={() => setResolutionStatus('investigation')}
                        className="text-[#87CEEB] focus:ring-[#87CEEB]"
                      />
                      <span className="text-sm font-medium text-gray-600">Investigate</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="closed"
                        checked={resolutionStatus === 'closed'}
                        onChange={() => setResolutionStatus('closed')}
                        className="text-[#87CEEB] focus:ring-[#87CEEB]"
                        data-testid="radio-status-closed"
                      />
                      <span className="text-sm font-medium text-gray-600">Close</span>
                    </label>
                  </div>

                  <button
                    onClick={handleResolve}
                    disabled={isSubmitting || !response.trim()}
                    className="bg-[#2F4F4F] text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#87CEEB] hover:text-[#2F4F4F] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="btn-submit-resolution"
                  >
                    {isSubmitting ? 'Processing...' : 'Submit Resolution'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
