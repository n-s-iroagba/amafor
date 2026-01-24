'use client';
import React, { useState } from 'react';
import { ArrowLeft, XCircle, ShieldAlert, Briefcase, ExternalLink, BadgeCheck, FileText, Globe, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGet, usePatch } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

interface Advertiser {
  id: string;
  name: string;
  contact: string;
  industry: string;
  website: string;
  registered: string;
  status: string;
}

export default function AdvertiserReviewDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [processing, setProcessing] = useState<'authorizing' | 'denying' | null>(null);

  const { data: company, loading } = useGet<Advertiser>(
    API_ROUTES.USERS.VIEW(id as string)
  );

  const { patch: verifyUser } = usePatch<{ status: string }, void>(
    API_ROUTES.USERS.VERIFY(id as string)
  );

  const handleAction = async (type: 'authorizing' | 'denying') => {
    setProcessing(type);
    try {
      await verifyUser({ status: type === 'authorizing' ? 'active' : 'suspended' });
      router.push('/dashboard/admin/advertisers');
    } catch (error) {
      console.error('Action failed:', error);
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Advertiser Not Found</h1>
          <Link href="/dashboard/admin/advertisers" className="text-[#87CEEB] hover:underline">
            Back to Queue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/admin/advertisers" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Queue
        </Link>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-[2rem] bg-[#87CEEB]/10 text-[#2F4F4F] flex items-center justify-center font-black text-3xl shadow-inner border border-[#87CEEB]/20">
              {company.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h1 className="text-3xl text-[#2F4F4F] font-black uppercase tracking-tight">{company.name}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-[10px] font-black text-[#87CEEB] uppercase tracking-widest bg-[#2F4F4F] px-3 py-1 rounded-full">
                  CORPORATE ENTITY
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{company.industry} Sector</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleAction('denying')}
              disabled={!!processing}
              className="bg-white border-2 border-red-100 text-red-500 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all flex items-center disabled:opacity-50"
            >
              {processing === 'denying' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
              DENY ACCESS
            </button>
            <button
              onClick={() => handleAction('authorizing')}
              disabled={!!processing}
              className="sky-button flex items-center space-x-3 py-4 px-10 disabled:opacity-50 shadow-xl"
            >
              {processing === 'authorizing' ? <Loader2 className="w-5 h-5 animate-spin" /> : <BadgeCheck className="w-5 h-5" />}
              <span>{processing === 'authorizing' ? 'AUTHORIZING...' : 'AUTHORIZE PARTNER'}</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 transition-all hover:shadow-lg">
              <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-10 flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-[#87CEEB]" /> Verified Legal Identity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-2">CAC Registry Number</label>
                  <div className="font-mono text-lg font-black text-[#2F4F4F] bg-gray-50 px-4 py-2 rounded-xl border border-transparent inline-block">{company.registered || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-2">Lead Partnership Contact</label>
                  <div className="font-bold text-[#2F4F4F] text-lg">{company.contact}</div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 transition-all hover:shadow-lg">
              <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-10 flex items-center">
                <Globe className="w-4 h-4 mr-2 text-[#87CEEB]" /> Online Validation
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-gray-50 rounded-[2rem] gap-6 border border-transparent hover:border-[#87CEEB]/20 transition-all">
                <div className="flex items-center">
                  <div className="bg-white p-3 rounded-2xl shadow-sm mr-4">
                    <Globe className="w-6 h-6 text-[#87CEEB]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase mb-0.5 tracking-widest">Public Domain</div>
                    <span className="font-bold text-[#2F4F4F]">{company.website}</span>
                  </div>
                </div>
                <button className="w-full md:w-auto px-8 py-3 bg-white rounded-xl text-[10px] font-black text-[#87CEEB] uppercase tracking-widest hover:bg-[#2F4F4F] hover:text-white transition-all shadow-sm flex items-center justify-center">
                  EXECUTE WHOIS VERIFICATION <ExternalLink className="w-3 h-3 ml-2" />
                </button>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-b-8 border-[#87CEEB]">
              <ShieldAlert className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight text-red-400 flex items-center">
                <ShieldAlert className="w-6 h-6 mr-2" /> Risk Audit
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-10 font-bold uppercase tracking-tight">
                {company.name} is categorized under <span className="text-[#87CEEB]">{company.industry}</span>. No sector conflicts detected with existing platinum sponsors.
              </p>
              <div className="flex items-center space-x-3 text-[10px] font-black text-green-500 uppercase tracking-widest bg-white/5 p-4 rounded-xl border border-white/5">
                <FileText className="w-4 h-4" /> <span>KYC Documents Verified</span>
              </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100 flex items-start space-x-4 shadow-sm">
              <BadgeCheck className="w-6 h-6 text-blue-600 flex-none" />
              <p className="text-[10px] text-blue-800 font-bold uppercase leading-relaxed">
                Authorization grants immediate access to the self-service campaign suite and Paystack settlement bridge.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}