// app/goals/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDelete, useGet } from '@/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

interface Goal {
  id: number;
  fixtureId: number;
  scorer: string;
  minute: number;
  isPenalty: boolean;
  createdAt: string;
  updatedAt: string;
  fixture: {
    homeTeam: string;
    awayTeam: string;
    date: string;
    homeTeamLogo: string;
    awayTeamLogo: string;
    venue: string;
  };
}

export default function GoalDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const {resourceData:goal ,loading:isLoading} = useGet<any>(API_ROUTES.GOALS.VIEW(id))

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

   const {handleDelete,deleting} = useDelete(API_ROUTES.GOALS.MUTATE(Number(id)))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700">Loading goal details...</div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700">Goal not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <Link
            href="/goals"
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
            Back to goals
          </Link>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-sky-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
                  Goal Details
                </h2>
                <div className="flex items-center mt-2 space-x-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${goal.isPenalty ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}
                  >
                    {goal.isPenalty ? 'Penalty Goal' : 'Regular Goal'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/goals/${goal.id}/edit`}
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

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-sky-800 mb-4">
                Goal Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sky-700">
                    Scorer
                  </label>
                  <p className="mt-1 text-sm text-sky-900">{goal.scorer}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-700">
                    Minute
                  </label>
                  <p className="mt-1 text-sm text-sky-900">{goal.minute}'</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-700">
                    Goal Type
                  </label>
                  <p className="mt-1 text-sm text-sky-900">
                    {goal.isPenalty ? 'Penalty' : 'Regular'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-sky-800 mb-4">
                Fixture Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sky-700">
                    Match
                  </label>
                  <p className="mt-1 text-sm text-sky-900">
                    {goal.fixture.homeTeam} vs {goal.fixture.awayTeam}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-700">
                    Date
                  </label>
                  <p className="mt-1 text-sm text-sky-900">
                    {new Date(goal.fixture.date).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-700">
                    Venue
                  </label>
                  <p className="mt-1 text-sm text-sky-900">
                    {goal.fixture.venue}
                  </p>
                </div>
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
                  {new Date(goal.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-sky-700">
                  Last Updated
                </label>
                <p className="mt-1 text-sm text-sky-900">
                  {new Date(goal.updatedAt).toLocaleDateString()}
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
                Are you sure you want to delete this goal? This action cannot be
                undone.
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
                {deleting?'Deleting':'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
