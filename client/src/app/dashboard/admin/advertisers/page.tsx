'use client';
import React from 'react';
import { Briefcase, ArrowLeft, ExternalLink, ShieldAlert, BadgeCheck, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

interface Advertiser {
  id: string;
  company: string;
  contact: string;
  email: string;
  status: string;
  industry: string;
  website: string;
}


/**
 * Page: Advertiser Verification Queue
 * Description: Admin list of pending advertiser applications for review.
 * Requirements: REQ-ADM-08 (Advertiser Verification)
 * User Story: US-ADM-008 (Verify Advertisers)
 * User Journey: UJ-ADM-004 (Commercial Ops)
 * API: GET /users/pending-advertisers (API_ROUTES.USERS.PENDING_ADVERTISERS)
 * Hook: useGet(API_ROUTES.USERS.PENDING_ADVERTISERS)
 */
export default function AdvertiserVerificationQueue() {
  const { data: queue, loading } = useGet<Advertiser[]>(
    API_ROUTES.USERS.PENDING_ADVERTISERS)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/admin" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Central Command
        </Link>

        <header className="mb-12">
          <div className="flex items-center space-x-4 mb-2">
            <div className="bg-[#2F4F4F] p-3 rounded-2xl">
              <Briefcase className="w-6 h-6 text-[#87CEEB]" />
            </div>
            <h1 className="text-4xl text-[#2F4F4F] uppercase tracking-tight">Advertiser Verification (ADM-08)</h1>
          </div>
          <p className="text-gray-500 text-sm">Review corporate partnership requests. Validate CAC registration and platform suitability.</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : !queue || queue.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 border border-gray-100 shadow-sm text-center">
            <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h3 className="text-xl font-black text-gray-400 uppercase tracking-tight mb-2">No Pending Reviews</h3>
            <p className="text-gray-400 text-sm">All advertiser applications have been processed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {queue.map(item => (
              <div key={item.id} className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-12 transition-all hover:shadow-2xl group" data-testid="advertiser-app-card">
                <div className="flex-1 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 rounded-[2rem] bg-[#87CEEB]/10 flex items-center justify-center text-[#2F4F4F] font-black text-3xl shadow-inner group-hover:bg-[#2F4F4F] group-hover:text-[#87CEEB] transition-colors">
                        {item.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-[#2F4F4F] uppercase tracking-tight">{item.company}</h3>
                        <div className="flex items-center text-sm text-[#87CEEB] font-black uppercase tracking-widest">
                          {item.industry} Sector
                        </div>
                      </div>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100">
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-gray-50">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Company Representative</h4>
                        <p className="font-bold text-[#2F4F4F]">{item.contact}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Digital Presence</h4>
                        <Link href={`https://${item.website}`} className="flex items-center text-xs font-bold text-[#2F4F4F] hover:text-[#87CEEB] transition-colors underline decoration-[#87CEEB] underline-offset-4">
                          <ExternalLink className="w-4 h-4 mr-2" /> {item.website}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-80 flex flex-col justify-center space-y-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-8 lg:pt-0 lg:pl-12">
                  <Link href={`/dashboard/admin/advertisers/${item.id}`} className="w-full py-5 bg-[#2F4F4F] text-[#87CEEB] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center hover:bg-[#87CEEB] hover:text-[#2F4F4F] transition-all shadow-lg" data-testid="link-view-ad-dossier">
                    REVIEW PARTNERSHIP <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-4 bg-green-50 text-green-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all">AUTHORIZE</button>
                    <button className="py-4 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">DENY</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}