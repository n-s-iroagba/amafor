
'use client';
import React from 'react';
import { ShieldAlert, ArrowLeft, Send, Paperclip, MessageSquare, Clock, ShieldCheck, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';


// Changed params to optional to resolve TS error in index.tsx

/**
 * Page: Dispute Detail (Advertiser)
 * Description: View status and history of a billing dispute.
 * Requirements: REQ-ADV-07 (Dispute Resolution)
 * User Story: US-ADV-007 (Manage Disputes)
 * User Journey: UJ-ADV-002 (Manage Ad Campaigns)
 * API: GET /advertiser/disputes/:id (API_ROUTES.ADVERTISER.DISPUTES.VIEW)
 */
export default function DisputeDetailPage({ params }: { params?: { id: string } }) {
  const urlParams = useParams();
  const disputeId = params?.id || urlParams.id;

  const messages = [
    { sender: 'Fatima (Advertiser)', text: 'We noticed a 12% discrepancy between GA4 reporting and the platform internal dashboard for the Summer Kit campaign.', time: 'May 18, 10:24 AM' },
    { sender: 'Admin Console', text: 'Case logged. Our technical team is synchronizing the GA4 event buffers now. This usually takes 2-4 hours.', time: 'May 18, 11:05 AM' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/advertiser" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Dashboard
        </Link>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className="bg-red-50 p-4 rounded-3xl">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-3xl text-[#2F4F4F] font-black uppercase tracking-tight">CASE: {disputeId}</h1>
                <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">UNDER INVESTIGATION</span>
              </div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Subject: View Discrepancy (Summer Kit)</p>
            </div>
          </div>
          <button className="bg-white border-2 border-green-100 text-green-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-50 transition-all flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" /> RESOLVE CASE
          </button>
        </header>

        <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col h-[600px]">
          <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-[#87CEEB]" /> SECURE CHANNEL (ADM-DIS-01)
            </h3>
            <span className="text-[9px] font-bold text-gray-400 uppercase font-mono flex items-center">
              <ShieldCheck className="w-3 h-3 mr-1 text-green-500" /> ISO 27001 AUDIT ACTIVE
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-gray-50/20">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender.includes('Admin') ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-md ${msg.sender.includes('Admin') ? '' : 'text-right'}`}>
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    {msg.sender} • {msg.time}
                  </div>
                  <div className={`p-6 rounded-[2rem] text-sm leading-relaxed ${msg.sender.includes('Admin')
                      ? 'bg-[#2F4F4F] text-white rounded-tl-none'
                      : 'bg-[#87CEEB] text-[#2F4F4F] rounded-tr-none shadow-lg shadow-[#87CEEB]/20 font-bold'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 border-t bg-white">
            <div className="relative flex items-center gap-4">
              <button className="p-4 bg-gray-50 text-gray-400 hover:text-[#2F4F4F] rounded-2xl transition-all">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder="Provide details or upload evidence..."
                className="flex-1 bg-gray-50 px-8 py-5 rounded-[2rem] border-none outline-none focus:ring-2 focus:ring-[#87CEEB] text-sm font-bold"
              />
              <button className="bg-[#2F4F4F] text-[#87CEEB] p-5 rounded-full hover:bg-[#87CEEB] hover:text-[#2F4F4F] transition-all shadow-xl">
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em] flex items-center justify-center">
                <Clock className="w-3 h-3 mr-2" /> Average response time: 4 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
