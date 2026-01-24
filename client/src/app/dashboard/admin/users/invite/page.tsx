'use client';

import React, { useState } from 'react';
import { UserPlus, ArrowLeft, Mail, Shield, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/routes';
import { usePost } from '@/shared/hooks/useApiQuery';

export default function InviteUserPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User');

  const { post, isPending } = usePost(API_ROUTES.USERS.CREATE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await post({ email, role, dateOfBirth: new Date(), confirmed_email: true, name: email.split('@')[0], password: 'Password123!' });
      alert(`Invitation sent to ${email}`);
      router.push('/dashboard/admin/users');
    } catch (err) {
      console.error(err);
      alert('Failed to send invitation');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/admin/users" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Directory
        </Link>

        <header className="mb-12">
          <div className="bg-[#2F4F4F] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
            <UserPlus className="w-8 h-8 text-[#87CEEB]" />
          </div>
          <h1 className="text-4xl text-[#2F4F4F] font-black uppercase tracking-tight">System Invitation</h1>
          <p className="text-gray-500 text-sm mt-2">Grant role-based access to club officials and media managers.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100 space-y-8">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest">Official Email Address</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="official@gladiators.ng"
                className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border outline-none focus:border-[#87CEEB] font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest">Assign System Role</label>
            <div className="grid grid-cols-2 gap-4">
              {['Admin', 'Scout', 'Advertiser', 'User'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-4 border-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${role === r ? 'border-[#87CEEB] text-[#2F4F4F] bg-sky-50' : 'border-gray-100 text-gray-400 hover:border-[#87CEEB] hover:text-[#2F4F4F]'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-start space-x-4">
              <Shield className="w-6 h-6 text-blue-500 flex-none" />
              <p className="text-[10px] text-blue-600 font-bold uppercase leading-relaxed">
                Invitation links expire in 24 hours. All new system users must complete identity verification as per ISO 27001 protocol ADM-SEC-01.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full sky-button py-5 uppercase tracking-[0.2em] flex items-center justify-center disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-3" />}
            <span className="ml-3">{isPending ? 'SENDING...' : 'GENERATE SECURE LINK'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}