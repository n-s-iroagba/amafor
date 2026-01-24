'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Trophy,
  TrendingUp,
  Target,

  ChevronRight,
  Loader2,
  AlertCircle,

  Shield,

  Target as TargetIcon,
  TrendingDown,
  TrendingUpDown,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { League } from '@/features/league/types';
import { LeagueTableProps } from '@/features/league-statistics/types';

interface LeagueWithTable extends League {
  logo?: string;
  table?: LeagueTableProps[];
  amaforPosition?: number;
  amaforStats?: LeagueTableProps;
}

export default function LeagueStatisticsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<string>('position_asc');
  const [expandedLeagues, setExpandedLeagues] = useState<string[]>([]);

  // Fetch leagues with their tables
  const {
    data: leaguesData,
    loading,
    error,
    refetch
  } = useGet<LeagueWithTable[]>(API_ROUTES.LEAGUES.TABLES, {
    params: {
      include: 'table',
      limit: 50
    }
  });

  // Filter and sort leagues
  const filteredLeagues = leaguesData?.filter(league => {
    const matchesSearch =
      league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      league.season?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status (active/completed)
    const currentYear = new Date().getFullYear();
    const leagueYear = parseInt(league.season || '2024');



    return matchesSearch;
  });

  // Sort leagues
  const sortedLeagues = filteredLeagues?.sort((a, b) => {
    switch (sortBy) {
      case 'position_asc':
        return (a.amaforPosition || 999) - (b.amaforPosition || 999);
      case 'position_desc':
        return (b.amaforPosition || 0) - (a.amaforPosition || 999);
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      default:
        return (a.amaforPosition || 999) - (b.amaforPosition || 999);
    }
  });

  // Get performance trend
  const getTrendIcon = (league: LeagueWithTable) => {
    if (!league.amaforPosition) return null;

    // Mock trend based on position (in real app, compare with previous season)
    if (league.amaforPosition <= 3) return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (league.amaforPosition >= 8) return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <TrendingUpDown className="h-5 w-5 text-yellow-500" />;
  };

  // Get position color
  const getPositionColor = (position: number) => {
    if (position === 1) return 'bg-yellow-100 text-yellow-800';
    if (position === 2) return 'bg-gray-100 text-gray-800';
    if (position === 3) return 'bg-orange-100 text-orange-800';
    if (position <= 4) return 'bg-blue-100 text-blue-800';
    if (position >= 8) return 'bg-red-100 text-red-800';
    return 'bg-slate-100 text-slate-800';
  };

  // Toggle league expansion
  const toggleLeagueExpansion = (leagueId: string) => {
    setExpandedLeagues(prev =>
      prev.includes(leagueId)
        ? prev.filter(id => id !== leagueId)
        : [...prev, leagueId]
    );
  };

  // Calculate summary stats
  const summaryStats = {
    totalLeagues: leaguesData?.length || 0,
    activeLeagues: leaguesData?.length || 0,
    totalPoints: leaguesData?.reduce((sum, league) =>
      sum + (league.amaforStats?.points || 0), 0) || 0,
    totalGoals: leaguesData?.reduce((sum, league) =>
      sum + (league.amaforStats?.goalsFor || 0), 0) || 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-slate-700 animate-spin mb-4" />
            <p className="text-slate-600">Loading league statistics...</p>
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
                <h3 className="font-medium text-red-800 mb-2">Error Loading Statistics</h3>
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
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">League Statistics</h1>
          <p className="text-slate-300 text-lg max-w-3xl">
            Track Amafor Gladiators FC performance across all competitions.
            View standings, statistics, and progress in every league.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-slate-800">
                  {summaryStats.totalLeagues}
                </div>
                <div className="text-sm text-slate-600">Total Leagues</div>
              </div>
              <Trophy className="h-10 w-10 text-slate-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-slate-800">
                  {summaryStats.activeLeagues}
                </div>
                <div className="text-sm text-slate-600">Active Leagues</div>
              </div>
              <Target className="h-10 w-10 text-slate-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-slate-800">
                  {summaryStats.totalPoints}
                </div>
                <div className="text-sm text-slate-600">Total Points</div>
              </div>
              <TrendingUp className="h-10 w-10 text-slate-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-slate-800">
                  {summaryStats.totalGoals}
                </div>
                <div className="text-sm text-slate-600">Total Goals</div>
              </div>
              <TargetIcon className="h-10 w-10 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search leagues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-5 w-5 text-slate-600" />
                <label className="text-sm font-medium text-slate-700">League Status</label>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
              >
                <option value="all">All Leagues</option>
                <option value="active">Active Only</option>
                <option value="completed">Completed Only</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-slate-600" />
                <label className="text-sm font-medium text-slate-700">Sort By</label>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
              >
                <option value="position_asc">Position (Best First)</option>
                <option value="position_desc">Position (Worst First)</option>
                <option value="name_asc">League Name (A-Z)</option>
                <option value="name_desc">League Name (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {sortedLeagues?.length || 0} of {leaguesData?.length || 0} leagues
              </div>
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Leagues Grid */}
        <div className="space-y-6">
          {sortedLeagues?.map((league) => {
            const amaforStats = league.amaforStats;
            const amaforPosition = league.amaforPosition || 999;
            const isExpanded = expandedLeagues.includes(league.id.toString());

            return (
              <div key={league.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* League Header */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        {league.logo ? (
                          <Image
                            src={league.logo}
                            alt={league.name}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        ) : (
                          <Trophy className="h-8 w-8 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{league.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                          <span>Season: {league.season || '2023/24'}</span>
                          <span>•</span>

                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Amafor Position */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-800">
                          #{amaforPosition}
                        </div>
                        <div className="text-sm text-slate-600">Position</div>
                      </div>

                      {/* Amafor Points */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">
                          {amaforStats?.points || 0}
                        </div>
                        <div className="text-sm text-slate-600">Points</div>
                      </div>

                      {/* Performance Trend */}
                      <div className="text-center">
                        {getTrendIcon(league)}
                        <div className="text-sm text-slate-600 mt-1">Trend</div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleLeagueExpansion(league.id.toString())}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          {isExpanded ? 'Hide Table' : 'View Table'}
                          <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                        <Link
                          href={`/league-statistics/${league.id}`}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Table Preview */}
                {isExpanded && league.table && (
                  <div className="border-t border-slate-200">
                    <div className="p-6">
                      <h4 className="font-semibold text-slate-800 mb-4">
                        League Table Preview
                      </h4>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Pos</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Team</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">P</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">W</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">D</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">L</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">GF</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">GA</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">GD</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Pts</th>
                            </tr>
                          </thead>
                          <tbody>
                            {league.table.slice(0, 5).map((team) => (
                              <tr
                                key={team.team}
                                className={`border-b border-slate-100 last:border-b-0 ${team.team === 'Amafor Gladiators'
                                  ? 'bg-blue-50'
                                  : 'hover:bg-slate-50'
                                  }`}
                              >
                                <td className="py-3 px-4">
                                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${getPositionColor(team.position)}`}>
                                    {team.position}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-medium text-slate-800">
                                  <div className="flex items-center gap-3">
                                    {team.team === 'Amafor Gladiators' && (
                                      <Shield className="h-4 w-4 text-blue-600" />
                                    )}
                                    {team.team}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-slate-700">{team.played}</td>
                                <td className="py-3 px-4 text-slate-700">{team.won}</td>
                                <td className="py-3 px-4 text-slate-700">{team.draw}</td>
                                <td className="py-3 px-4 text-slate-700">{team.lost}</td>
                                <td className="py-3 px-4 text-slate-700 font-medium">{team.goalsFor}</td>
                                <td className="py-3 px-4 text-slate-700">{team.goalsAgainst}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${team.goalDifference > 0
                                    ? 'bg-green-100 text-green-800'
                                    : team.goalDifference < 0
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-bold text-slate-800">{team.points}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 text-center">
                        <Link
                          href={`/league-statistics/${league.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1"
                        >
                          View full table
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {sortedLeagues?.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <Trophy className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No leagues found</h3>
              <p className="text-slate-500">
                {leaguesData?.length === 0
                  ? "No league statistics available yet."
                  : "Try adjusting your filters to see more results."}
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Table Legend</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-100"></div>
              <span className="text-sm text-slate-600">1st Place (Champions)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-100"></div>
              <span className="text-sm text-slate-600">2nd Place</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-100"></div>
              <span className="text-sm text-slate-600">3rd Place</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-100"></div>
              <span className="text-sm text-slate-600">European Places</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-100"></div>
              <span className="text-sm text-slate-600">Relegation Zone</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}