// app/league-stats/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

interface ClubLeagueStats {
  id: number;
  leagueId: number;
  position: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  wins: number;
  draws: number;
  losses: number;
  createdAt: string;
  updatedAt: string;
  league: {
    name: string;
    season: string;
    isFriendly: boolean;
  };
}

export default function LeagueStatsDetail() {
  const router = useRouter();
  const params = useParams();
  const leagueId = params.id as string;
  const statsId = params.statsId as string;

  const {
    data: stats,
    loading,
    error,
    refetch,
  } = useGet<ClubLeagueStats>(
    statsId ? API_ROUTES.LEAGUE_STATS.VIEW(statsId) : ''
  );


  const calculateGoalDifference = (goalsFor: number, goalsAgainst: number) => {
    return goalsFor - goalsAgainst;
  };

  const calculateFixtureesPlayed = (
    wins: number,
    draws: number,
    losses: number
  ) => {
    return wins + draws + losses;
  };

  const calculateWinPercentage = (wins: number, totalFixturees: number) => {
    if (totalFixturees === 0) return 0;
    return Math.round((wins / totalFixturees) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700">Loading league statistics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700">League statistics not found</div>
      </div>
    );
  }

  const totalFixturees = calculateFixtureesPlayed(
    stats.wins,
    stats.draws,
    stats.losses
  );
  const goalDifference = calculateGoalDifference(
    stats.goalsFor,
    stats.goalsAgainst
  );
  const winPercentage = calculateWinPercentage(stats.wins, totalFixturees);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <Link
            href={`/dashboard/admin/leagues/${leagueId}`}
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
            Back to league
          </Link>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-sky-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
                  League Statistics
                </h2>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-800">
                    {stats.league.name} - {stats.league.season}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${stats.league.isFriendly ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}
                  >
                    {stats.league.isFriendly ? 'Friendly' : 'Competitive'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/dashboard/admin/leagues/${leagueId}/league-statstics/${stats.id}/edit`}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-medium text-sky-800 mb-6">
              League Standings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-sky-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-sky-800">
                  {stats.position}
                </div>
                <div className="text-sm text-sky-600">Position</div>
              </div>
              <div className="bg-sky-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-sky-800">
                  {stats.points}
                </div>
                <div className="text-sm text-sky-600">Points</div>
              </div>
              <div className="bg-sky-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-sky-800">
                  {goalDifference}
                </div>
                <div className="text-sm text-sky-600">Goal Difference</div>
              </div>
              <div className="bg-sky-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-sky-800">
                  {winPercentage}%
                </div>
                <div className="text-sm text-sky-600">Win Percentage</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-md font-medium text-sky-800 mb-4">Goals</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-sky-700">Goals For</span>
                    <span className="text-sm font-semibold text-sky-900">
                      {stats.goalsFor}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-sky-700">Goals Against</span>
                    <span className="text-sm font-semibold text-sky-900">
                      {stats.goalsAgainst}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-sky-200 pt-2">
                    <span className="text-sm font-medium text-sky-800">
                      Goal Difference
                    </span>
                    <span
                      className={`text-sm font-bold ${goalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {goalDifference >= 0 ? '+' : ''}
                      {goalDifference}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-sky-800 mb-4">
                  Fixture Record
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-sky-700">Wins</span>
                    <span className="text-sm font-semibold text-green-600">
                      {stats.wins}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-sky-700">Draws</span>
                    <span className="text-sm font-semibold text-yellow-600">
                      {stats.draws}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-sky-700">Losses</span>
                    <span className="text-sm font-semibold text-red-600">
                      {stats.losses}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-sky-200 pt-2">
                    <span className="text-sm font-medium text-sky-800">
                      Total Fixturees
                    </span>
                    <span className="text-sm font-bold text-sky-900">
                      {totalFixturees}
                    </span>
                  </div>
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
                  {new Date(stats.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-sky-700">
                  Last Updated
                </label>
                <p className="mt-1 text-sm text-sky-900">
                  {new Date(stats.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
