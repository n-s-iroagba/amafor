'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_USER } from '../constants';
import { Shield } from 'lucide-react';

export default function DashboardRouter() {
  const router = useRouter();

  useEffect(() => {
    // In a real app, we check the actual session. Here we use the mock user.
    const timer = setTimeout(() => {
      switch(MOCK_USER.userType) {
        case 'super_admin':
        case 'admin':
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
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

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
