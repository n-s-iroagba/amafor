'use client';
import React from 'react';
import { ShieldAlert, ArrowLeft, MessageSquare, ShieldCheck, Clock, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGet } from '@/shared/hooks/useApiQuery';
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
    updatedAt: string;
}

/**
 * Page: Advertiser Dispute Detail
 * Description: View dispute status and admin response.
 * API: GET /disputes/:id (API_ROUTES.ADVERTISER.DISPUTES.VIEW)
 */
export default function AdvertiserDisputeDetailPage() {
    const params = useParams();
    const disputeId = params.id as string;

    // Construct URL manually or use the route helper if it works correctly with client-side params
    // API_ROUTES.ADVERTISER.DISPUTES.VIEW(id) -> /disputes/:id
    const { data: response, loading, error } = useGet<{ success: boolean; data: Dispute }>(
        API_ROUTES.ADVERTISER.DISPUTES.VIEW(disputeId)
    );

    const dispute = response?.data;

    if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-[#87CEEB]" /></div>;
    if (error || !dispute) return <div className="p-12 text-center text-red-500"><AlertCircle className="w-8 h-8 mx-auto mb-2" />Error loading dispute</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href="/dashboard/advertiser/disputes" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
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
                                        dispute.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                    {dispute.status}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Subject: {dispute.subject}</p>
                        </div>
                    </div>
                </header>

                <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
                        <h3 className="text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest flex items-center">
                            <MessageSquare className="w-4 h-4 mr-2 text-[#87CEEB]" /> SECURE CHANNEL
                        </h3>
                    </div>

                    {/* Messages Area */}
                    <div className="p-8 space-y-8 bg-gray-50/20 min-h-[300px]">
                        {/* Original Dispute */}
                        <div className="flex justify-start">
                            <div className="max-w-xl">
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                    YOU • {new Date(dispute.createdAt).toLocaleString()}
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
                                        ADMIN RESPONSE • {new Date(dispute.updatedAt).toLocaleString()}
                                    </div>
                                    <div className="p-6 rounded-[2rem] rounded-tr-none bg-[#2F4F4F] text-white shadow-lg text-sm leading-relaxed">
                                        {dispute.adminResponse}
                                    </div>
                                </div>
                            </div>
                        )}

                        {!dispute.adminResponse && (
                            <div className="flex justify-center mt-12">
                                <p className="text-[#2F4F4F] text-xs font-bold uppercase tracking-[0.2em] flex items-center opacity-50">
                                    <Clock className="w-4 h-4 mr-2" /> Awaiting Admin Response
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
