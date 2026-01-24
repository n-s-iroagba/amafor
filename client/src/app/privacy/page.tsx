import React from 'react';
import { Lock, EyeOff, ShieldCheck, Database, ArrowLeft } from 'lucide-react';
import Link from 'next/link';


/**
 * Page: Privacy Policy
 * Description: Legal privacy policy outlining data collection and usage.
 * Requirements: REQ-UTL-02 (Legal Pages)
 * User Story: US-UTL-002 (View Privacy Policy)
 * User Journey: UJ-UTL-003 (Legal Review)
 * API: None (Static)
 */
export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-[3.5rem] p-12 md:p-20 shadow-sm border border-gray-100">
        <Link href="/" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-12 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back Home
        </Link>

        <header className="mb-16">
          <div className="bg-[#2F4F4F] w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
            <EyeOff className="w-8 h-8 text-[#87CEEB]" />
          </div>
          <h1 className="text-4xl text-[#2F4F4F] uppercase font-black tracking-tighter">Privacy Policy</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Effective Date: May 20, 2024</p>
        </header>

        <div className="space-y-12 text-gray-600 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-black text-[#2F4F4F] uppercase mb-4 tracking-tight flex items-center">
              <Database className="w-5 h-5 mr-3 text-[#87CEEB]" /> 1. Data Classification
            </h2>
            <p className="mb-4">We categorize data into three distinct tiers per our ISO 27001 framework:</p>
            <ul className="space-y-3 list-disc pl-5 font-bold text-xs uppercase text-[#2F4F4F]/70">
              <li><span className="text-[#2F4F4F] font-black">Public:</span> Fixture results, public news, squad lists.</li>
              <li><span className="text-[#2F4F4F] font-black">Confidential:</span> Fan profile details, email addresses, transaction history.</li>
              <li><span className="text-[#2F4F4F] font-black">Restricted:</span> Player biological data, physiological metrics, scout evaluation reports.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2F4F4F] uppercase mb-4 tracking-tight flex items-center">
              <ShieldCheck className="w-5 h-5 mr-3 text-[#87CEEB]" /> 2. Information Usage
            </h2>
            <p>
              Fan data is used strictly for platform personalization, patronage management, and opt-in marketing. Player data is utilized solely for professional scouting pathways and club development analytics. We do not sell data to third-party brokers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2F4F4F] uppercase mb-4 tracking-tight flex items-center">
              <Lock className="w-5 h-5 mr-3 text-[#87CEEB]" /> 3. Security Controls
            </h2>
            <p>
              Our ecosystem uses 256-bit AES encryption for all data at rest and TLS 1.3 for data in transit. Financial settlements are handled via Paystack's PCI-DSS compliant infrastructure, ensuring we never store your card details on our local servers.
            </p>
          </section>
        </div>

        <footer className="mt-20 pt-10 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-relaxed">
            For data deletion requests or privacy inquiries, please contact our Data Protection Officer at dpo@gladiators.ng
          </p>
        </footer>
      </div>
    </div>
  );
}