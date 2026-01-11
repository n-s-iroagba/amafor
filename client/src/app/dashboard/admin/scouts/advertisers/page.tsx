'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DecommissionedRoute() {
  const router = useRouter();
  useEffect(() => {
    router.push('/dashboard/admin/advertisers');
  }, [router]);
  return null;
}