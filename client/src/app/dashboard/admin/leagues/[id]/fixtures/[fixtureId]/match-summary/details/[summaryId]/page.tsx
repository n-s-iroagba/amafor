// app/match-summaries/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { API_ROUTES } from '@/config/routes';
import { useGet } from '@/shared/hooks/useApiQuery';
import api from '@/lib/apiUtils';

interface MatchSummary {
  id: number;
  fixtureId: number;
  summary: string;
  createdAt: string;
  updatedAt: string;
  fixture: {
    homeTeam: string;
    awayTeam: string;
    date: string;
    status: string;
    homeTeamLogo: string;
    awayTeamLogo: string;
    venue: string;
  };
}

export default function MatchSummaryDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
   const {
     data:summary ,
     loading: summaryLoading,
     error: summaryError,
     refetch: refetchSummary,
   } = useGet<MatchSummary>(
     API_ROUTES.MATCH_SUMMARY.VIEW(id )
   );

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);




  const handleDelete = async () => {
    try {
     await api.delete(API_ROUTES.MATCH_SUMMARY.VIEW(id));
      router.push(`/sports-admin/fixtures/${summary?.fixtureId}`)
   
    } catch (error) {
      console.error('Error deleting match summary:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'played':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (summaryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700">Loading match summary...</div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700">Match summary not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <Link
            href={`/sports-admin/fixtures/${summary?.fixtureId}`}
            className="text-sky-600 hover:text-sky-800 transition-colors flex items-center text-sm sm:text-base"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
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
            Back to Fixture
          </Link>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-sky-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
                  Match Summary
                </h2>
                <div className="flex items-center mt-2 space-x-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(summary.fixture.status)}`}
                  >
                    {summary.fixture.status}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/sports-admin/match-summary/details/${summary.id}/edit`}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-medium text-sky-800 mb-4">
              Match Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-sky-700 mb-2">
                  Teams
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Image
                                           width={50}
                                           height={50}
                                           unoptimized
                      className="h-8 w-8 rounded-full object-cover mr-2"
                      src={summary.fixture.homeTeamLogo}
                      alt={summary.fixture.homeTeam}
                    />
                    <span className="text-sm font-medium text-sky-900">
                      {summary.fixture.homeTeam}
                    </span>
                  </div>
                  <span className="text-sm text-sky-500">vs</span>
                  <div className="flex items-center">
                    <Image
                        width={50}
                        height={50}
                        unoptimized
                      className="h-8 w-8 rounded-full object-cover mr-2"
                      src={summary.fixture.awayTeamLogo}
                      alt={summary.fixture.awayTeam}
                    />
                    <span className="text-sm font-medium text-sky-900">
                      {summary.fixture.awayTeam}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sky-700 mb-2">
                  Date & Venue
                </label>
                <div className="text-sm text-sky-900">
                  {new Date(summary.fixture.date).toLocaleDateString()} at{' '}
                  {summary.fixture.venue}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sky-700 mb-2">
                Summary
              </label>
              <div className="bg-sky-50 rounded-lg p-4 sm:p-6">
                <p className="text-sm text-sky-900 whitespace-pre-wrap leading-relaxed">
                  {summary.summary}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-sky-200">
            <h3 className="text-lg font-medium text-sky-800 mb-4">Timeline</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sky-700">
                  Created
                </label>
                <p className="mt-1 text-sm text-sky-900">
                  {new Date(summary.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-sky-700">
                  Last Updated
                </label>
                <p className="mt-1 text-sm text-sky-900">
                  {new Date(summary.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-sky-800 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-sky-600 mb-4">
                Are you sure you want to delete this match summary? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-sky-100 text-sky-700 rounded-md hover:bg-sky-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
