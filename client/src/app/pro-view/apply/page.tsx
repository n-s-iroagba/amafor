'use client';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Shield, Briefcase, Mail, Globe, MessageSquare, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { API_ROUTES } from '@/config/routes';
import { usePost } from '@/shared/hooks/useApiQuery';
import { Footer } from '@/shared/components/Footer';
import { Header } from '@/shared/components/Header';

/**
 * Page: Pro View Application
 * Description: Application form for professional scouts to request access.
 * Requirements: REQ-SCT-01 (Application Form)
 * User Story: US-SCT-001 (Apply for Access)
 * User Journey: UJ-SCT-001 (Scout Registration)
 * API: POST /scout/applications (API_ROUTES.SCOUT.APPLY)
 * Hook: usePost(API_ROUTES.SCOUT.APPLY)
 */

export default function ProViewApplication() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    socialUrl: '',
    reason: '',
  });

  const { post, isPending: loading, isSuccess: success, error } = usePost(API_ROUTES.SCOUT.APPLY);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await post({
      name: formData.fullName,
      email: formData.email,
      organization: formData.organization,
      socialUrl: formData.socialUrl,
      reason: formData.reason
    });
  };

  if (success) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-24 bg-slate-50">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 to-indigo-500" />

              <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle className="w-12 h-12 text-emerald-500" />
              </div>

              <h1 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight">Application Transmitted</h1>
              <p className="text-slate-600 mb-10 text-lg leading-relaxed">
                Your application has been submitted. Thank you for applying for Pro View access. Your credentials are now{' '}
                <span className="font-black text-slate-900 px-2 py-1 bg-sky-100 rounded-lg">Under Verification</span>.
              </p>

              <div className="bg-slate-900 text-white p-8 mb-10 rounded-3xl text-left shadow-2xl">
                <h3 className="font-black text-sky-400 uppercase tracking-widest text-xs mb-6 flex items-center">
                  <Shield className="w-4 h-4 mr-2" /> Next Operations
                </h3>
                <ul className="space-y-4 text-sm font-bold">
                  <li className="flex gap-4 items-start">
                    <span className="text-sky-400">01</span>
                    <span className="text-slate-300">Identity verification within 24-48 standard business hours.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-sky-400">02</span>
                    <span className="text-slate-300">Email notification containing the final access protocol.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-sky-400">03</span>
                    <span className="text-slate-300">Direct biometric and performance log integration for approved profiles.</span>
                  </li>
                </ul>
              </div>

              <div className="text-slate-400 text-sm font-bold mb-10">
                Confirmation protocol dispatched to:<br />
                <span className="text-sky-500 font-black">{formData.email}</span>
              </div>

              <Link
                href="/"
                className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-900 px-10 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest active:scale-95 duration-200"
              >
                Terminate Session
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-24 bg-slate-50 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-sky-400/5 -skew-x-12 transform origin-top-right pointer-events-none" />

        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <Link
            href="/pro-view"
            className="inline-flex items-center gap-3 text-slate-400 hover:text-sky-500 mb-12 font-black text-[10px] uppercase tracking-[0.2em] transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Intelligence Info
          </Link>

          <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-900" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div>
                <h1 className="text-4xl font-black text-slate-900 mb-3 uppercase tracking-tight">Pro access protocol</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Credentials verification required for biometric data</p>
              </div>
              <div className="hidden md:flex w-20 h-20 bg-slate-50 rounded-3xl items-center justify-center border border-slate-100 italic font-black text-slate-200 text-3xl">
                AGFC
              </div>
            </div>

            {error && (
              <div className="mb-10 p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-600 font-bold text-sm">
                <Shield className="w-6 h-6 flex-shrink-0" />
                <p>Security Alert: {typeof error === 'string' ? error : 'Failed to transmit application. Please verify connection.'}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <Shield className="w-3.5 h-3.5 mr-2 text-sky-400" /> Full Name
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="IDENTIFIED OPERATOR"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-sky-400 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-200"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-2 text-sky-400" /> Professional Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="OPERATOR@AGENCY.PRO"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-sky-400 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <Briefcase className="w-3.5 h-3.5 mr-2 text-sky-400" /> Organization
                  </label>
                  <input
                    name="organization"
                    type="text"
                    placeholder="SQUAD/INSTITUTION"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-sky-400 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-200"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <Globe className="w-3.5 h-3.5 mr-2 text-sky-400" /> Profile URL
                  </label>
                  <input
                    name="socialUrl"
                    type="url"
                    placeholder="HTTPS://LINKEDIN.COM/IN/..."
                    value={formData.socialUrl}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-sky-400 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <MessageSquare className="w-3.5 h-3.5 mr-2 text-sky-400" /> Intent / Mission Briefing
                </label>
                <textarea
                  name="reason"
                  placeholder="OBJECTIVE FOR BIOMETRIC ACCESS..."
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-sky-400 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-200 min-h-[160px] resize-none"
                  required
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || !formData.fullName || !formData.email || !formData.organization || !formData.socialUrl || !formData.reason}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-300 text-white px-10 py-5 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 active:scale-[0.98] duration-200 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>


          <div className="mt-12 text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest opacity-50">
            Encrypted Transmission Secure &copy; AGFC Protocol 2025
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
