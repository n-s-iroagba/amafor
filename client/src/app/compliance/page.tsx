import React from 'react';
import { Shield, Lock, FileCheck, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CompliancePage() {
  const standards = [
    { title: 'ISO 27001:2022', desc: 'International standard for information security management systems (ISMS).', status: 'Certified' },
    { title: 'NDPR Compliance', desc: 'Adherence to Nigerian Data Protection Regulation for all fan and player data.', status: 'Verified' },
    { title: 'WCAG 2.1 AA', desc: 'Accessibility standards for inclusive digital fan experiences.', status: 'Compliant' },
  ];

  return (
    <div className="bg-white min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-20">
          <div className="bg-[#87CEEB]/10 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Shield className="w-12 h-12 text-[#2F4F4F]" />
          </div>
          <h1 className="text-5xl text-[#2F4F4F] uppercase font-black tracking-tighter mb-4">Security Standards</h1>
          <p className="text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">The Amafor Gladiators Digital Ecosystem operates under strict professional data integrity protocols.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {standards.map((s, i) => (
            <div key={i} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mb-4" />
              <h3 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-2">{s.title}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <section className="bg-[#2F4F4F] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
          <Lock className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5" />
          <h2 className="text-2xl font-black uppercase tracking-tight mb-8 text-[#87CEEB]">Data Integrity Log (ADM-11)</h2>
          <div className="space-y-6 relative z-10">
            <p className="text-sm text-gray-400 leading-relaxed">
              Every interaction within the Pro View Scout Portal and the CMS Command is logged cryptographically. These records are immutable and subject to quarterly independent audits to ensure the protection of player bio-data and financial transactions.
            </p>
            <div className="pt-6 border-t border-white/10 flex flex-wrap gap-4">
              <div className="flex items-center text-[10px] font-black text-[#87CEEB] tracking-widest uppercase">
                <ShieldAlert className="w-4 h-4 mr-2" /> 256-Bit SSL Encryption
              </div>
              <div className="flex items-center text-[10px] font-black text-[#87CEEB] tracking-widest uppercase">
                <FileCheck className="w-4 h-4 mr-2" /> Daily Security Snapshots
              </div>
            </div>
          </div>
        </section>

        <div className="mt-20 text-center">
          <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em] mb-8">System ID: AG-ISMS-PRD-2024</p>
          <Link href="/" className="inline-flex items-center text-xs font-black text-[#2F4F4F] hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
            Return to Arena <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}