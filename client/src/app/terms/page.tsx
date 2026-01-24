import React from 'react';
import { FileText, Scale, Gavel, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';


/**
 * Page: Terms of Service
 * Description: Legal terms and conditions for platform usage.
 * Requirements: REQ-UTL-02 (Legal Pages)
 * User Story: US-UTL-002 (View Terms)
 * User Journey: UJ-UTL-003 (Legal Review)
 * API: None (Static)
 */
export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-[3.5rem] p-12 md:p-20 shadow-sm border border-gray-100">
        <Link href="/" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-12 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back Home
        </Link>

        <header className="mb-16">
          <div className="bg-[#2F4F4F] w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
            <Scale className="w-8 h-8 text-[#87CEEB]" />
          </div>
          <h1 className="text-4xl text-[#2F4F4F] uppercase font-black tracking-tighter">Terms of Service</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">v1.2 Master Agreement</p>
        </header>

        <div className="space-y-12 text-gray-600 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-black text-[#2F4F4F] uppercase mb-4 tracking-tight flex items-center">
              <FileText className="w-5 h-5 mr-3 text-[#87CEEB]" /> 1. User Conduct
            </h2>
            <p>
              Welcome to Gladiators Arena . Users must provide accurate identification during registration. Any attempt to scrape player data or bypass security protocols will result in permanent account termination and legal action where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2F4F4F] uppercase mb-4 tracking-tight flex items-center">
              <Gavel className="w-5 h-5 mr-3 text-[#87CEEB]" /> 2. Commercial Terms
            </h2>
            <p className="mb-4">For our commercial partners and advertisers:</p>
            <ul className="space-y-3 list-disc pl-5 font-bold text-xs uppercase text-[#2F4F4F]/70">
              <li>Ad rates are subject to 30-day notice for adjustments.</li>
              <li>Campaign delivery is verified via GA4 integration.</li>
              <li>Disputes must be raised through the internal dashboard within 14 days of the event.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2F4F4F] uppercase mb-4 tracking-tight flex items-center">
              <ShieldCheck className="w-5 h-5 mr-3 text-[#87CEEB]" /> 3. Patronage Agreement
            </h2>
            <p>
              Patronage tiers are recurring digital commitments. Recognition on the Supporter Wall is a gesture of appreciation and does not grant equity or ownership in the club.
            </p>
          </section>
        </div>

        <footer className="mt-20 pt-10 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-relaxed">
            By entering the Arena, you agree to these terms under the jurisdiction of Nigerian Law.
          </p>
        </footer>
      </div>
    </div>
  );
}
