'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Trophy,
  Plus,
  Filter,
  Clock,
  ChevronDown,
  Eye,
} from 'lucide-react';

import { API_ROUTES } from '@/config/routes';
import { FixtureStatus, Fixture } from '@/features/fixture/types';
import { useGet } from '@/shared/hooks/useApiQuery';
interface PaginatedData<T> {
  data: T;
  pagination: any;
}

interface League {
  id: string;
  name: string;
  season: string;
  isFriendly: boolean;
  createdAt: string;
  updatedAt: string;
}



type TabType = 'all' | FixtureStatus;

import { useParams } from 'next/navigation';


/**
 * Page: Fixtures List
 * Description: Management of match fixtures for a specific league.
 * Requirements: REQ-ADM-08 (Fixture Management)
 * User Story: US-ADM-009 (Manage Fixtures)
 * User Journey: UJ-ADM-005 (Competition Setup)
 * API: GET /fixtures (API_ROUTES.FIXTURES.LIST or BY_LEAGUE)
 * Hook: useGet(API_ROUTES.FIXTURES.LIST)
 */
export default function FixturesList() {
  const router = useRouter();
  const params = useParams();
  const leagueId = params.id as string;

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedLeague, setSelectedLeague] = useState<string>(leagueId || 'all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: paginatedFixtures,
    loading: isLoading,
    error,
    refetch,
  } = useGet<PaginatedData<Fixture[]>>(
    selectedLeague === 'all'
      ? API_ROUTES.FIXTURES.LIST
      : API_ROUTES.FIXTURES.BY_LEAGUE(selectedLeague)
  );

  const { data: leagues, loading: leaguesLoading } = useGet<League[]>(
    `${API_ROUTES.LEAGUES.LIST}/all`
  );



  const fixtures = paginatedFixtures?.data;

  // ✅ helper: map leagueId → league
  const getLeagueForFixture = (fixture: Fixture) =>
    leagues?.find((l) => l.id === fixture.leagueId);

  const getStatusColor = (status: FixtureStatus) => {
    switch (status) {
      case FixtureStatus.WON:
        return 'bg-green-100 text-green-800 border-green-200';
      case FixtureStatus.LOST:
        return 'bg-red-100 text-red-800 border-red-200';
      case FixtureStatus.DRAW:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case FixtureStatus.PLAYING:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case FixtureStatus.SCHEDULED:
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case FixtureStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: FixtureStatus) => {
    switch (status) {
      case FixtureStatus.COMPLETED:
        return <Clock className="w-3 h-3" />;
      case FixtureStatus.SCHEDULED:
        return <Calendar className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const groupFixturesByStatus = (fixtures: Fixture[]) => {
    const initialAccumulator = Object.values(FixtureStatus).reduce(
      (acc, status) => {
        acc[status] = [];
        return acc;
      },
      {} as Record<FixtureStatus, Fixture[]>
    );

    return fixtures.reduce((acc, fixture) => {
      acc[fixture.status].push(fixture);
      return acc;
    }, initialAccumulator);
  };

  const getFilteredFixtures = () => {
    if (!fixtures) return [];

    let filtered = fixtures;

    if (activeTab !== 'all') {
      filtered = filtered.filter((fixture) => fixture.status === activeTab);
    }

    if (selectedLeague !== 'all') {
      filtered = filtered.filter(
        (fixture) => fixture.leagueId.toString() === selectedLeague
      );
    }

    if (selectedSeason !== 'all') {
      filtered = filtered.filter(
        (fixture) => getLeagueForFixture(fixture)?.season === selectedSeason
      );
    }

    return filtered;
  };

  const getAvailableSeasons = () => {
    if (!fixtures || !leagues) return [];

    const seasons = Array.from(
      new Set(
        fixtures
          .map((fixture) => getLeagueForFixture(fixture)?.season)
          .filter((season): season is string => Boolean(season))
      )
    );

    return seasons.sort();
  };

  const getTabCounts = () => {
    if (!fixtures) return {} as Record<FixtureStatus, number>;
    const grouped = groupFixturesByStatus(fixtures);
    const counts = {} as Record<FixtureStatus, number>;

    Object.values(FixtureStatus).forEach((status) => {
      counts[status] = grouped[status].length;
    });

    return counts;
  };

  if (isLoading || leaguesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <span className="text-sky-700 text-lg font-medium">
            Loading fixtures...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-xl shadow-lg">
          <div className="text-red-600 text-lg font-medium mb-2">
            Error loading fixtures
          </div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredFixtures = getFilteredFixtures();
  const tabCounts = getTabCounts();
  const availableSeasons = getAvailableSeasons();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 py-4 lg:py-8 px-3 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-600 rounded-xl shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Fixtures
                </h1>
                <p className="text-sky-600 mt-1">
                  {filteredFixtures.length} of {fixtures?.length || 0} fixtures
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/admin/fixtures/new"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl shadow-lg hover:from-sky-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 font-medium"
            >
              <Plus className="w-5 h-5" />
              Create New Fixture
            </Link>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-sky-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 lg:p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-sky-600" />
                <span className="text-lg font-semibold text-gray-900">
                  Filters
                </span>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-2 hover:bg-sky-100 rounded-lg transition-colors"
              >
                <ChevronDown
                  className={`w-5 h-5 text-sky-600 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            <div
              className={`p-4 lg:p-6 ${showFilters ? 'block' : 'hidden lg:block'}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    League
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLeague}
                      onChange={(e) => setSelectedLeague(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white appearance-none pr-10"
                    >
                      <option value="all">All Leagues</option>
                      {leagues?.map((league) => (
                        <option key={league.id} value={league.id.toString()}>
                          {league.name} {league.isFriendly ? '(Friendly)' : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Season
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white appearance-none pr-10"
                    >
                      <option value="all">All Seasons</option>
                      {availableSeasons.map((season) => (
                        <option key={season} value={season}>
                          {season}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Status Filter
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all'
                        ? 'bg-sky-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      All
                    </button>
                    {Object.values(FixtureStatus)
                      .slice(0, 3)
                      .map((status) => (
                        <button
                          key={status}
                          onClick={() => setActiveTab(status)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === status
                            ? 'bg-sky-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {status}{' '}
                          {tabCounts[status] ? `(${tabCounts[status]})` : ''}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixtures Content */}
        {filteredFixtures.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No fixtures found
              </h3>
              <p className="text-gray-500 mb-6">
                {activeTab !== 'all' ||
                  selectedLeague !== 'all' ||
                  selectedSeason !== 'all'
                  ? 'Try adjusting your filters to see more results'
                  : 'Get started by creating your first fixture'}
              </p>
              <Link
                href="/fixtures/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Create New Fixture
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden border border-sky-100">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-sky-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Fixture
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        League
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Venue
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredFixtures.map((fixture) => {
                      const league = getLeagueForFixture(fixture);
                      return (
                        <tr
                          key={fixture.id}
                          className="hover:bg-sky-50 transition-colors group cursor-pointer"
                          onClick={() =>
                            router.push(`/dashboard/admin/fixtures/${fixture.id}`)
                          }
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900">
                                    {fixture.homeTeam}
                                  </span>
                                  <span className="text-gray-500">vs</span>
                                  <span className="font-semibold text-gray-900">
                                    {fixture.awayTeam}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-sky-600" />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {league?.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {league?.season}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Calendar className="w-4 h-4 text-sky-600" />
                              {new Date(fixture.matchDate).toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-700">
                              <MapPin className="w-4 h-4 text-sky-600" />
                              {fixture.venue}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(fixture.status)}`}
                            >
                              {getStatusIcon(fixture.status)}
                              {fixture.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/sports-admin/fixtures/${fixture.id}`
                                );
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 text-sm text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredFixtures.map((fixture) => {
                const league = getLeagueForFixture(fixture);
                return (
                  <div
                    key={fixture.id}
                    className="bg-white rounded-2xl shadow-lg border border-sky-100 overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/admin/fixtures/${fixture.id}`)
                    }
                  >
                    <div className="p-6">
                      {/* Fixture Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-sky-600" />
                          <div>
                            <div className="font-semibold text-gray-900">
                              {league?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {league?.season}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(fixture.status)}`}
                        >
                          {getStatusIcon(fixture.status)}
                          {fixture.status}
                        </span>
                      </div>

                      {/* Teams */}
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-lg font-bold text-gray-900">
                            {fixture.homeTeam}
                          </span>
                          <div className="px-3 py-1 bg-sky-100 rounded-lg">
                            <span className="text-sky-700 font-semibold">
                              VS
                            </span>
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            {fixture.awayTeam}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-sky-600" />
                          <span className="text-sm">
                            {new Date(fixture.matchDate).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-sky-600" />
                          <span className="text-sm">{fixture.venue}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/admin/fixtures/${fixture.id}`);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
