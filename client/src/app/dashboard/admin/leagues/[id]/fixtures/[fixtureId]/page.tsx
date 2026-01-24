'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGet, useDelete } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { Lineup } from '@/features/lineup/types';
import { Loader2, Trash2, ArrowLeft, Calendar, MapPin, Trophy, Edit3 } from 'lucide-react';
import Image from 'next/image';
import LineupList from '@/features/lineup/components/LineupList';
import LineupForm from '@/features/lineup/components/LineupForm';
import { Fixture, FixtureStatus } from '@/types';

interface Goal {
  id: string;
  scorer: string;
  isPenalty: boolean;
}
export interface FixtureDetail extends Fixture {
  goals: Goal[];
  league: {
    name: string;
    season: string;
    isFriendly: boolean;
  };
  images?: FixtureImage[];
}

interface FixtureImage {
  id: string;
  imageUrl: string;
  caption?: string;
}


/**
 * Page: Fixture Detail
 * Description: Comprehensive view of a match fixture including goals, lineup, and summary.
 * Requirements: REQ-ADM-08 (Fixture Management)
 * User Story: US-ADM-010 (Fixture Detail)
 * User Journey: UJ-ADM-005 (Competition Setup)
 * API: GET /fixtures/:id (API_ROUTES.FIXTURES.VIEW)
 * Hook: useGet(API_ROUTES.FIXTURES.VIEW)
 */
export default function FixtureDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fixtureId = params.fixtureId as string;
  const leagueId = params.id as string;

  const [activeTab, setActiveTab] = useState<
    'overview' | 'goals' | 'summary' | 'gallery' | 'lineup'
  >('overview');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Note: API_ROUTES.FIXTURES.VIEW uses /fixtures/one/${id}
  const { data: fixture, loading, refetch } = useGet<FixtureDetail>(
    API_ROUTES.FIXTURES.VIEW(fixtureId)
  );

  const { delete: deleteFixture, isPending: isDeleting } = useDelete(
    (id) => API_ROUTES.FIXTURES.DELETE(Number(id))
  );

  const { data: lineup, loading: lineupLoading } = useGet<Lineup[]>(
    fixture ? API_ROUTES.LINEUP.BY_FIXTURE(fixture.id) : ''
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

    try {
      await deleteFixture(fixture.id);
      router.push(`/dashboard/admin/leagues/${leagueId}/fixtures`);
      router.refresh();
    } catch (error) {
      console.error('Error deleting fixture:', error);
      alert('Failed to delete fixture. Please try again.');
    } finally {
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

  // Lineup Handlers
  const [editingPlayer, setEditingPlayer] = useState<Lineup | null>(null);
  const handleEdit = (player: Lineup) => setEditingPlayer(player);
  const handleDeleteLineup = (player: Lineup) => { /* Implement delete logic if needed or pass to component */ };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sky-700 font-medium">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading fixture details...
        </div>
      </div>
    );
  }

  if (!fixture) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex flex-col items-center justify-center">
        <div className="text-sky-700 font-medium mb-4">Fixture not found</div>
        <Link
          href={`/dashboard/admin/leagues/${leagueId}/fixtures`}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
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
      label: `Lineup (${lineup?.length || 0})`,
      alwaysShow: true
    },
    {
      key: 'summary',
      label: 'Fixture Summary',
      alwaysShow: true
    },
    {
      key: 'gallery',
      label: `Gallery (${fixture.images?.length || 0})`,
      alwaysShow: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <div className="mb-4 sm:mb-6">
          <Link
            href={`/dashboard/admin/leagues/${leagueId}/fixtures`}
            className="text-sky-600 hover:text-sky-800 transition-colors flex items-center text-sm sm:text-base group"
          >
            <ArrowLeft className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" />
            Back to fixtures
          </Link>
        </div>

        {/* Fixture card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden mb-6">
          <div className="p-4 sm:p-6 border-b border-sky-200 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
                Fixture Details
              </h2>
              <div className="flex items-center mt-2 space-x-2 flex-wrap gap-y-2">
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
                href={`/dashboard/admin/leagues/${leagueId}/fixtures/${fixture.id}/edit`}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors text-sm sm:text-base flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
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
          <div className="p-6 sm:p-8 bg-sky-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center gap-2 flex-1">
              {fixture.homeTeamLogo && (
                <Image
                  height={80}
                  width={80}
                  unoptimized
                  src={fixture.homeTeamLogo}
                  alt={fixture.homeTeam}
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                />
              )}
              <h3 className="text-lg sm:text-xl font-bold text-sky-900 text-center">
                {fixture.homeTeam}
              </h3>
            </div>

            <div className="text-center px-4">
              {fixture.status === FixtureStatus.COMPLETED ? (
                <div className="text-3xl sm:text-4xl ont-bold text-sky-900 mb-2">
                  {score.home} - {score.away}
                </div>
              ) : (
                <div className="text-xl sm:text-2xl font-bold text-sky-400 mb-2">
                  VS
                </div>
              )}
              <div className="flex flex-col items-center gap-1 text-sm text-sky-700">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(fixture.matchDate).toLocaleString()}
                </div>
                {fixture.venue && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {fixture.venue}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 flex-1">
              {fixture.awayTeamLogo && (
                <Image
                  height={80}
                  width={80}
                  unoptimized
                  src={fixture.awayTeamLogo}
                  alt={fixture.awayTeam}
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                />
              )}
              <h3 className="text-lg sm:text-xl font-bold text-sky-900 text-center">
                {fixture.awayTeam}
              </h3>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden min-h-[400px]">
          <div className="border-b border-sky-200 flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.key
                  ? 'border-sky-500 text-sky-600 bg-sky-50'
                  : 'border-transparent text-sky-500 hover:text-sky-600 hover:bg-sky-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-sky-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> Venue Details
                  </h3>
                  <p className="text-sky-800">{fixture.venue || 'No venue specified'}</p>
                </div>
                <div className="bg-sky-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Match Info
                  </h3>
                  <p className="text-sky-800">League: {fixture.league.name} ({fixture.league.season})</p>
                  <p className="text-sky-800 mt-2">Status: <span className="capitalize">{fixture.status}</span></p>
                </div>
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>Goals management coming soon</p>
              </div>
            )}

            {activeTab === 'lineup' && (
              <div>
                {lineup && fixture && (
                  <div className="space-y-6">
                    <LineupList
                      lineup={lineup}
                      fixture={fixture}
                      onEdit={handleEdit}
                      onDelete={handleDeleteLineup}
                    />
                    {editingPlayer && (
                      <div className="mt-8 pt-8 border-t border-gray-100">
                        <h3 className="font-bold text-lg mb-4">Edit Player</h3>
                        <LineupForm fixtureId={fixture.id} activeForm="edit" />
                      </div>
                    )}
                  </div>
                )}
                {(!lineup || lineup.length === 0) && (
                  <div className="max-w-xl mx-auto">
                    <LineupForm fixtureId={fixture?.id} activeForm="bulk" />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'summary' && (
              <div className="text-center py-12 text-gray-500">
                <Edit3 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>Match summary management coming soon</p>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="text-center py-12 text-gray-500">
                <Image
                  width={48}
                  height={48}
                  src="/placeholder.png"
                  alt=""
                  className="w-12 h-12 mx-auto opacity-20 mb-3"
                  unoptimized
                />
                <p>Gallery management coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}