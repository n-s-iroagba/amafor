'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Loader2 } from 'lucide-react';
import { useAuthContext } from '@/shared/hooks/useAuthContext';

export default function DashboardRouter() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Not authenticated, redirect to login
      router.push('/auth/login');
      return;
    }

    // Route based on user type
    const timer = setTimeout(() => {
      switch (user.userType) {
        case 'super_admin':
        case 'sports_admin':
        case 'data_steward':
        case 'commercial_manager':
        case 'it_security':
          router.push('/dashboard/admin');
          break;
        case 'scout':
          router.push('/dashboard/scout');
          break;
        case 'advertiser':
          router.push('/dashboard/advertiser');
          break;
        case 'media_manager':
          router.push('/dashboard/cms');
          break;
        default:
          router.push('/dashboard/fan');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [router, user, loading]);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <div className="bg-[#2F4F4F] p-8 rounded-[3rem] shadow-2xl mb-8">
          <Loader2 className="w-16 h-16 text-[#87CEEB] animate-spin" />
        </div>
        <h2 className="text-2xl font-black text-[#2F4F4F] uppercase tracking-tighter mb-2">Loading Session</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="h-[80vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="bg-[#2F4F4F] p-8 rounded-[3rem] shadow-2xl animate-bounce mb-8">
        <Shield className="w-16 h-16 text-[#87CEEB]" />
      </div>
      <h2 className="text-2xl font-black text-[#2F4F4F] uppercase tracking-tighter mb-2">Authenticating Arena Session</h2>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Establishing secure role-based bridge...</p>
    </div>
  );
}
