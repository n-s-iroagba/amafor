// app/coaches/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGet } from '@/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import ErrorAlert from '@/components/ErrorAlert';
import { Coach } from '@/types';

export default function CoachDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const {
    data: coach,
    loading,
    error,
  } = useGet<Coach>(API_ROUTES.COACHES.MUTATE(id as string));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700 text-lg font-medium">
          Loading coach details...
        </div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700 text-lg font-medium">Coach not found</div>
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/coaches"
            className="text-sky-600 hover:text-sky-800 flex items-center text-sm sm:text-base"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to coaches
          </Link>
        </div>

        {/* Coach Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-4">
              {coach.imageUrl ? (
                <img
                  src={coach.imageUrl}
                  alt={coach.name}
                  className="h-48 w-48 object-cover rounded-full border-4 border-sky-200"
                />
              ) : (
                <div className="h-48 w-48 flex items-center justify-center rounded-full bg-gray-200 text-gray-400 text-xl">
                  No Image
                </div>
              )}
            </div>

            <div className="md:w-2/3 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-sky-800">
                  {coach.name}
                </h2>
                <p className="text-sky-600 text-sm sm:text-base mb-4">
                  {coach.role}
                </p>

                {coach.bio ? (
                  <div className="text-sky-900 text-sm sm:text-base whitespace-pre-wrap">
                    {coach.bio}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm sm:text-base italic">
                    No biography available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
