'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { Lineup } from '@/features/lineup/types';
import api from '@/shared/lib/axios';
import { Loader2, Trash2 } from 'lucide-react';


interface Fixture {
  id: number;
  leagueId: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  venue: string;
  status: 'scheduled' | 'played' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  league: {
    name: string;
    season: string;
    isFriendly: boolean;
  };
  goals: Goal[];
  matchSummary?: {
    id: number;
    summary: string;
  };
images?: MatchImage[];
  lineup: Lineup[];
}
interface Goal{
  isPenalty:boolean
}

interface MatchImage {
  id: number;
  imageUrl: string;
  caption?: string;
}

export default function FixtureDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState<
    'overview' | 'goals' | 'summary' | 'gallery' | 'lineup'
  >('overview');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { data: fixture, loading, refetch } = useGet<Fixture>(
    API_ROUTES.FIXTURES.VIEW(id as string)
  );

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

  const calculateScore = () => {
    if (!fixture?.goals) return { home: 0, away: 0 };
    const homeGoals = fixture.goals.filter((goal) => !goal.isPenalty).length;
    const awayGoals = fixture.goals.filter((goal) => goal.isPenalty).length;
    return { home: homeGoals, away: awayGoals };
  };

  const handleDelete = async () => {
    if (!fixture) return;

    setIsDeleting(true);
    try {
      await api.delete(API_ROUTES.FIXTURES.DELETE(fixture.id));
      router.push('/sports-admin/fixtures');
      router.refresh();
    } catch (error) {
      console.error('Error deleting fixture:', error);
      alert('Failed to delete fixture. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const confirmDelete = () => {
    if (window.confirm(
      'Are you sure you want to delete this fixture? This action cannot be undone and will remove all associated goals, lineups, and images.'
    )) {
      handleDelete();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700">Loading fixture details...</div>
      </div>
    );
  }

  if (!fixture) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700">Fixture not found</div>
        <Link
          href="/sports-admin/fixtures"
          className="mt-4 text-sky-600 hover:text-sky-800"
        >
          Back to fixtures
        </Link>
      </div>
    );
  }

  const score = calculateScore();

  // Define tabs with their conditions
  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      alwaysShow: true
    },
    {
      key: 'goals',
      label: `Goals (${fixture.goals?.length || 0})`,
      alwaysShow: true
    },
    {
      key: 'lineup',
      label: `Lineup (${fixture.lineup?.length || 0})`,
      alwaysShow: true
    },
    {
      key: 'summary',
      label: 'Match Summary',
       alwaysShow: true
    },
    {
      key: 'gallery',
      label: `Gallery (${fixture.images?.length || 0})`,
       alwaysShow: true
    }
  ];

  // Filter tabs based on conditions
  const visibleTabs = tabs.filter(tab => 
    tab.alwaysShow
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/sports-admin/fixtures"
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
            Back to fixtures
          </Link>
        </div>

        {/* Match card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden mb-6">
          <div className="p-4 sm:p-6 border-b border-sky-200 flex justify-between items-start">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
                Match Details
              </h2>
              <div className="flex items-center mt-2 space-x-2 flex-wrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fixture.status)}`}
                >
                  {fixture.status}
                </span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-800">
                  {fixture.league.name}
                </span>
                {fixture.league.isFriendly && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    Friendly
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Link
                href={`/sports-admin/fixtures/${fixture.id}/edit`}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors text-sm sm:text-base flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
              
              {showDeleteConfirm ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    {isDeleting ? 'Deleting...' : 'Confirm'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Teams and score */}
          {/* <div className="p-6 sm:p-8 bg-sky-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              <Image
                height={50}
                width={50}
                unoptimized
                src={fixture.homeTeamLogo}
                alt={fixture.homeTeam}
                className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
              />
              <h3 className="text-lg sm:text-xl font-bold text-sky-900">
                {fixture.homeTeam}
              </h3>
            </div>
            <div className="text-center">
              {fixture.status === 'played' ? (
                <div className="text-3xl sm:text-4xl font-bold text-sky-900">
                  {score.home} - {score.away}
                </div>
              ) : (
                <div className="text-lg sm:text-xl font-semibold text-sky-700">
                  VS
                </div>
              )}
              <div className="text-sm text-sky-600 mt-1">
                {new Date(fixture.date).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-4 flex-1 justify-end">
                  <Image
                height={50}
                width={50}
                unoptimized
                src={fixture.awayTeamLogo}
                alt={fixture.awayTeam}
                className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
              />
              <h3 className="text-lg sm:text-xl font-bold text-sky-900">
                {fixture.awayTeam}
              </h3>
          
            </div>
          </div> */}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
          <div className="border-b border-sky-200 flex overflow-x-auto">
            {visibleTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-sky-500 hover:text-sky-600 hover:border-sky-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
{/* 
          <div className="p-4 sm:p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-medium text-sky-800">
                  Venue:
                </h3>
                <p className="text-sm text-sky-700 mt-2">{fixture.venue}</p>
              </div>
            )}

            {activeTab === 'goals' && <GoalsList fixture={fixture} />}
            
            {activeTab === 'lineup' && <FixtureLineup fixtureId={Number(id)} />}
            
            {activeTab === 'summary' && (
             (
                <AdminMatchSummary fixtureId={fixture.id} />
              )
            )}
 
            {activeTab === 'gallery' && (
           (
                <MatchImagesList fixtureId={fixture.id} />
              ) 
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}