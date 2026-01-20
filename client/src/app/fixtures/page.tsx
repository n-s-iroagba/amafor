'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  Search,
  Filter,
  ChevronRight,
  Loader2,
  AlertCircle,
  Clock,
  Target,
  TrendingUp,
  Award,
  BarChart3,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useGet } from '@/shared/hooks/useApiQuery';
import { FixtureStatus, FixtureWithLeague } from '@/features/fixture/types';
import { League } from '@/features/league/types';


export default function FixturesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FixtureStatus | 'all'>('all');
  const [leagueFilter, setLeagueFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all'); // today, upcoming, past, all
  const [sortBy, setSortBy] = useState<string>('date_desc');
  const [expandedLeagues, setExpandedLeagues] = useState<string[]>([]);

  // Fetch fixtures with leagues
  const {
    data: fixturesData,
    loading,
    error,
    refetch
  } = useGet<FixtureWithLeague[]>('/api/fixtures', {
    params: {
      include: 'league',
      limit: 100,
      sort: '-date'
    }
  });

  // Fetch leagues for filter
  const { data: leaguesData } = useGet<League[]>('/api/leagues');

  // Filter and sort fixtures
  const filteredFixtures = useMemo(() => {
    if (!fixturesData) return [];

    let filtered = [...fixturesData];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(fixture =>
        fixture.homeTeam.toLowerCase().includes(term) ||
        fixture.awayTeam.toLowerCase().includes(term) ||
        fixture.venue.toLowerCase().includes(term) ||
        fixture.league?.name?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(fixture => fixture.status === statusFilter);
    }

    // Apply league filter
    if (leagueFilter !== 'all') {
      filtered = filtered.filter(fixture => fixture.leagueId.toString() === leagueFilter);
    }

    // Apply date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(fixture => {
          const fixtureDate = new Date(fixture.matchDate);
          fixtureDate.setHours(0, 0, 0, 0);
          return fixtureDate.getTime() === today.getTime();
        });
        break;
      case 'upcoming':
        filtered = filtered.filter(fixture => new Date(fixture.matchDate) > new Date());
        break;
      case 'past':
        filtered = filtered.filter(fixture => new Date(fixture.matchDate) < new Date());
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime();
        case 'date_desc':
          return new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime();
        case 'league_asc':
          return (a.league?.name || '').localeCompare(b.league?.name || '');
        case 'league_desc':
          return (b.league?.name || '').localeCompare(a.league?.name || '');
        default:
          return new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime();
      }
    });

    return filtered;
  }, [fixturesData, searchTerm, statusFilter, leagueFilter, dateFilter, sortBy]);

  // Group fixtures by league
  const groupedFixtures = useMemo(() => {
    const groups: Record<string, FixtureWithLeague[]> = {};

    filteredFixtures.forEach(fixture => {
      const leagueName = fixture.league?.name || 'Other';
      if (!groups[leagueName]) {
        groups[leagueName] = [];
      }
      groups[leagueName].push(fixture);
    });

    return groups;
  }, [filteredFixtures]);

  // Get fixture status display
  const getStatusDisplay = (fixture: FixtureWithLeague) => {
    const fixtureDate = new Date(fixture.matchDate);
    const now = new Date();

    if (fixture.status === FixtureStatus.SCHEDULED) {
      if (fixtureDate < now) {
        return { text: 'Fixture Started', color: 'text-blue-600', bg: 'bg-blue-100' };
      }
      const diffHours = Math.abs(fixtureDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (diffHours < 24) {
        return { text: 'Today', color: 'text-green-600', bg: 'bg-green-100' };
      } else if (diffHours < 48) {
        return { text: 'Tomorrow', color: 'text-green-600', bg: 'bg-green-100' };
      }
      return { text: 'Scheduled', color: 'text-gray-600', bg: 'bg-gray-100' };
    }

    const statusMap = {
      [FixtureStatus.WON]: { text: 'Won', color: 'text-green-600', bg: 'bg-green-100' },
      [FixtureStatus.LOST]: { text: 'Lost', color: 'text-red-600', bg: 'bg-red-100' },
      [FixtureStatus.DRAW]: { text: 'Draw', color: 'text-yellow-600', bg: 'bg-yellow-100' },
      [FixtureStatus.PLAYING]: { text: 'Live', color: 'text-blue-600', bg: 'bg-blue-100' },
      [FixtureStatus.CANCELLED]: { text: 'Cancelled', color: 'text-gray-600', bg: 'bg-gray-300' },
    };

    return statusMap[fixture.status] || { text: fixture.status, color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(date.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${date.toLocaleDateString([], { weekday: 'long' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    return date.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleLeagueExpansion = (leagueName: string) => {
    setExpandedLeagues(prev =>
      prev.includes(leagueName)
        ? prev.filter(name => name !== leagueName)
        : [...prev, leagueName]
    );
  };

  const handleFixtureClick = (fixtureId: string | number) => {
    router.push(`/fixtures/${fixtureId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-slate-700 animate-spin mb-4" />
            <p className="text-slate-600">Loading fixtures...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 mb-2">Error Loading Fixtures</h3>
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Fixtures</h1>
              <p className="text-slate-300">
                Track all matches, view schedules, and check results
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button
                onClick={() => router.push('/fixtures/add')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
              >
                Add Fixture
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {fixturesData?.length || 0}
                </div>
                <div className="text-sm text-slate-600">Total Fixtures</div>
              </div>
              <Calendar className="h-8 w-8 text-slate-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {fixturesData?.filter(f => f.status === FixtureStatus.SCHEDULED).length || 0}
                </div>
                <div className="text-sm text-slate-600">Upcoming</div>
              </div>
              <Clock className="h-8 w-8 text-slate-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {fixturesData?.filter(f => f.status === FixtureStatus.WON).length || 0}
                </div>
                <div className="text-sm text-slate-600">Wins</div>
              </div>
              <Award className="h-8 w-8 text-slate-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {leaguesData?.length || 0}
                </div>
                <div className="text-sm text-slate-600">Leagues</div>
              </div>
              <Trophy className="h-8 w-8 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search fixtures, teams, venues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FixtureStatus | 'all')}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
              >
                <option value="all">All Status</option>
                <option value={FixtureStatus.SCHEDULED}>Scheduled</option>
                <option value={FixtureStatus.PLAYING}>Live</option>
                <option value={FixtureStatus.WON}>Won</option>
                <option value={FixtureStatus.LOST}>Lost</option>
                <option value={FixtureStatus.DRAW}>Draw</option>
                <option value={FixtureStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>

            {/* League Filter */}
            <div>
              <select
                value={leagueFilter}
                onChange={(e) => setLeagueFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
              >
                <option value="all">All Leagues</option>
                {leaguesData?.map(league => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past Fixturees</option>
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {filteredFixtures.length} of {fixturesData?.length || 0} fixtures
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all text-sm"
              >
                <option value="date_desc">Date (Newest)</option>
                <option value="date_asc">Date (Oldest)</option>
                <option value="league_asc">League (A-Z)</option>
                <option value="league_desc">League (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fixtures List */}
        <div className="space-y-6">
          {Object.entries(groupedFixtures).map(([leagueName, fixtures]) => (
            <div key={leagueName} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {/* League Header */}
              <button
                onClick={() => toggleLeagueExpansion(leagueName)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-slate-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-slate-800">{leagueName}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>{fixtures.length} fixtures</span>
                      <span>•</span>
                      <span>
                        {fixtures.filter(f => f.status === FixtureStatus.WON).length} wins
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">
                    {expandedLeagues.includes(leagueName) ? 'Collapse' : 'Expand'}
                  </span>
                  {expandedLeagues.includes(leagueName) ? (
                    <ChevronUp className="h-5 w-5 text-slate-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-600" />
                  )}
                </div>
              </button>

              {/* League Fixtures */}
              {expandedLeagues.includes(leagueName) && (
                <div className="border-t border-slate-200">
                  {fixtures.map((fixture) => {
                    const statusDisplay = getStatusDisplay(fixture);

                    return (
                      <div
                        key={fixture.id}
                        onClick={() => handleFixtureClick(fixture.id)}
                        className="p-6 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 cursor-pointer transition-colors group"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* Date & Status */}
                          <div className="lg:w-1/4">
                            <div className="flex items-center gap-3">
                              <div className="text-left">
                                <div className="font-medium text-slate-800">
                                  {formatDate(fixture.matchDate as string)}
                                </div>
                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2 ${statusDisplay.bg} ${statusDisplay.color}`}>
                                  {statusDisplay.text}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Fixture Info */}
                          <div className="lg:w-2/4">
                            <div className="flex items-center justify-between">
                              <div className="text-center lg:w-2/5">
                                <div className="font-bold text-lg text-slate-800">
                                  {fixture.homeTeam}
                                </div>
                                <div className="text-sm text-slate-600">Home</div>
                              </div>

                              <div className="text-center lg:w-1/5">
                                {fixture.status === FixtureStatus.SCHEDULED ? (
                                  <div className="text-2xl font-bold text-slate-800">VS</div>
                                ) : (
                                  <>
                                    <div className="text-3xl font-bold text-slate-800 mb-1">
                                      {fixture.homeScore || 0} - {fixture.awayScore || 0}
                                    </div>
                                    <div className="text-xs text-slate-500">Final Score</div>
                                  </>
                                )}
                              </div>

                              <div className="text-center lg:w-2/5">
                                <div className="font-bold text-lg text-slate-800">
                                  {fixture.awayTeam}
                                </div>
                                <div className="text-sm text-slate-600">Away</div>
                              </div>
                            </div>
                          </div>

                          {/* Venue & Actions */}
                          <div className="lg:w-1/4">
                            <div className="flex flex-col lg:items-end gap-3">
                              <div className="flex items-center gap-2 text-slate-600">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm">{fixture.venue}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  View
                                </button>
                                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {filteredFixtures.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No fixtures found</h3>
              <p className="text-slate-500 mb-6">
                {fixturesData?.length === 0
                  ? "No fixtures have been scheduled yet."
                  : "Try adjusting your filters to see more results."}
              </p>
              {fixturesData?.length === 0 && (
                <button
                  onClick={() => router.push('/fixtures/add')}
                  className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  Schedule First Fixture
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}