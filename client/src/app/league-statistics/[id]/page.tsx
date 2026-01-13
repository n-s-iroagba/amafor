'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Trophy,
  TrendingUp,
  Target,
 
  ChevronLeft,
  ChevronRight,
  Download,

  Search,
  Loader2,
  AlertCircle,
  Calendar,
 
  Shield,
  Star,
  
  BarChart,
  Users as UsersIcon,
  Clock,
  Activity
} from 'lucide-react';
import { useGet } from '@/shared/hooks/useApiQuery';
import { League} from '@/features/league/types';
import { LeagueTableProps } from '@/features/league-statistics/types';

interface LeagueDetails extends League {
  table: LeagueTableProps[];
  statistics: {
    topScorer: { name: string; team: string; goals: number };
    mostAssists: { name: string; team: string; assists: number };
    bestDefense: { team: string; goalsAgainst: number };
    bestAttack: { team: string; goalsFor: number };
  };
  recentFixtures: Array<{
    id: number;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    date: string;
  }>;
}

export default function LeagueTablePage() {
  const params = useParams();
  const router = useRouter();
  const leagueId = params.id as string;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('position');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  // Fetch league details with table
  const { 
    data: league, 
    loading, 
    error 
  } = useGet<LeagueDetails>(`/api/leagues/${leagueId}/table`, {
    params: {
      include: 'table,statistics,recentFixtures'
    }
  });

  // Filter and sort table
  const filteredTable = league?.table?.filter(team =>
    team.team.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedTable = [...filteredTable].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'position':
        comparison = a.position - b.position;
        break;
      case 'team':
        comparison = a.team.localeCompare(b.team);
        break;
      case 'points':
        comparison = a.points - b.points;
        break;
      case 'goalsFor':
        comparison = a.goalsFor - b.goalsFor;
        break;
      case 'goalsAgainst':
        comparison = a.goalsAgainst - b.goalsAgainst;
        break;
      case 'goalDifference':
        comparison = a.goalDifference - b.goalDifference;
        break;
      case 'won':
        comparison = a.won - b.won;
        break;
      case 'lost':
        comparison = a.lost - b.lost;
        break;
      case 'draw':
        comparison = a.draw - b.draw;
        break;
      default:
        comparison = a.position - b.position;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Get position color
  const getPositionColor = (position: number) => {
    if (position === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (position === 2) return 'bg-gray-100 text-gray-800 border-gray-200';
    if (position === 3) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (position <= 4) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (position >= (league?.table?.length || 20) - 2) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  // Get form indicator (mock data)
  const getTeamForm = (teamName: string) => {
    const forms = ['W', 'W', 'D', 'L', 'W']; // Mock recent form
    return forms.map((result, index) => (
      <span
        key={index}
        className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-medium ${
          result === 'W' ? 'bg-green-100 text-green-800' :
          result === 'D' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}
      >
        {result}
      </span>
    ));
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    // In real app, implement export functionality
    alert('Export functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-slate-700 animate-spin mb-4" />
            <p className="text-slate-600">Loading league table...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !league) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 mb-8"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Leagues
          </button>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              {error ? 'Error Loading League Table' : 'League Not Found'}
            </h3>
            <p className="text-red-600 mb-6">
              {error || 'The requested league table could not be found.'}
            </p>
            <button
              onClick={() => router.push('/league-statistics')}
              className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors font-medium"
            >
              Browse All Leagues
            </button>
          </div>
        </div>
      </div>
    );
  }

  const amaforTeam = league.table.find(team => team.team === 'Amafor Gladiators');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to All Leagues
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center">
                {league.logo ? (
                  <Image
                    src={league.logo}
                    alt={league.name}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                ) : (
                  <Trophy className="h-12 w-12 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{league.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>Season: {league.season || '2023/24'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5" />
                    <span>{league.table.length} Teams</span>
                  </div>
              
                </div>
              </div>
            </div>

            {/* Amafor Position */}
            {amaforTeam && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 min-w-[300px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Amafor Gladiators</h3>
                      <div className="text-sm text-slate-300">Current Position</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-5xl font-bold mb-2 ${getPositionColor(amaforTeam.position)}`}>
                      #{amaforTeam.position}
                    </div>
                    <div className="text-sm text-slate-300">{amaforTeam.points} Points</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-bold">{amaforTeam.won}</div>
                    <div className="text-slate-300">Wins</div>
                  </div>
                  <div>
                    <div className="font-bold">{amaforTeam.draw}</div>
                    <div className="text-slate-300">Draws</div>
                  </div>
                  <div>
                    <div className="font-bold">{amaforTeam.lost}</div>
                    <div className="text-slate-300">Losses</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {league.statistics?.topScorer?.goals || 0}
                </div>
                <div className="text-sm text-slate-600">Top Scorer</div>
              </div>
              <Target className="h-8 w-8 text-slate-400" />
            </div>
            <div className="text-sm text-slate-700">
              {league.statistics?.topScorer?.name || 'N/A'} ({league.statistics?.topScorer?.team || 'N/A'})
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {league.statistics?.mostAssists?.assists || 0}
                </div>
                <div className="text-sm text-slate-600">Most Assists</div>
              </div>
              <TrendingUp className="h-8 w-8 text-slate-400" />
            </div>
            <div className="text-sm text-slate-700">
              {league.statistics?.mostAssists?.name || 'N/A'} ({league.statistics?.mostAssists?.team || 'N/A'})
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {league.statistics?.bestDefense?.goalsAgainst || 0}
                </div>
                <div className="text-sm text-slate-600">Best Defense</div>
              </div>
              <Shield className="h-8 w-8 text-slate-400" />
            </div>
            <div className="text-sm text-slate-700">
              {league.statistics?.bestDefense?.team || 'N/A'}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {league.statistics?.bestAttack?.goalsFor || 0}
                </div>
                <div className="text-sm text-slate-600">Best Attack</div>
              </div>
              <Activity className="h-8 w-8 text-slate-400" />
            </div>
            <div className="text-sm text-slate-700">
              {league.statistics?.bestAttack?.team || 'N/A'}
            </div>
          </div>
        </div>

        {/* Table Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all text-sm"
                >
                  <option value="position">Position</option>
                  <option value="team">Team</option>
                  <option value="points">Points</option>
                  <option value="won">Wins</option>
                  <option value="goalsFor">Goals For</option>
                  <option value="goalDifference">Goal Difference</option>
                </select>
                <button
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50"
                >
                  {sortDirection === 'asc' ? (
                    <ChevronRight className="h-4 w-4 rotate-90 text-slate-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 -rotate-90 text-slate-600" />
                  )}
                </button>
              </div>
              <button
                onClick={handleExport}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* League Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th 
                    className="text-left py-4 px-6 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('position')}
                  >
                    <div className="flex items-center gap-2">
                      Pos
                      {sortBy === 'position' && (
                        <ChevronRight className={`h-4 w-4 ${sortDirection === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left py-4 px-6 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('team')}
                  >
                    <div className="flex items-center gap-2">
                      Team
                      {sortBy === 'team' && (
                        <ChevronRight className={`h-4 w-4 ${sortDirection === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                      )}
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">P</th>
                  <th 
                    className="text-left py-4 px-6 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('won')}
                  >
                    <div className="flex items-center gap-2">
                      W
                      {sortBy === 'won' && (
                        <ChevronRight className={`h-4 w-4 ${sortDirection === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left py-4 px-6 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('draw')}
                  >
                    <div className="flex items-center gap-2">
                      D
                      {sortBy === 'draw' && (
                        <ChevronRight className={`h-4 w-4 ${sortDirection === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left py-4 px-6 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('lost')}
                  >
                    <div className="flex items-center gap-2">
                      L
                      {sortBy === 'lost' && (
                        <ChevronRight className={`h-4 w-4 ${sortDirection === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left py-4 px-6 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('goalsFor')}
                  >
                    <div className="flex items-center gap-2">
                      GF
                      {sortBy === 'goalsFor' && (
                        <ChevronRight className={`h-4 w-4 ${sortDirection === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left py-4 px-6 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('goalsAgainst')}
                  >
                    <div className="flex items-center gap-2">
                      GA
                      {sortBy === 'goalsAgainst' && (
                        <ChevronRight className={`h-4 w-4 ${sortDirection === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left py-4 px-6 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('goalDifference')}
                  >
                    <div className="flex items-center gap-2">
                      GD
                      {sortBy === 'goalDifference' && (
                        <ChevronRight className={`h-4 w-4 ${sortDirection === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left py-4 px-6 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('points')}
                  >
                    <div className="flex items-center gap-2">
                      Pts
                      {sortBy === 'points' && (
                        <ChevronRight className={`h-4 w-4 ${sortDirection === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                      )}
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Form</th>
                </tr>
              </thead>
              <tbody>
                {sortedTable.map((team) => (
                  <tr 
                    key={team.team}
                    className={`border-b border-slate-100 hover:bg-slate-50 ${
                      team.team === 'Amafor Gladiators' ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold ${getPositionColor(team.position)}`}>
                        {team.position}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {team.team === 'Amafor Gladiators' && (
                          <Shield className="h-5 w-5 text-blue-600" />
                        )}
                        <span className="font-semibold text-slate-800">{team.team}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-700">{team.played}</td>
                    <td className="py-4 px-6 text-slate-700 font-medium">{team.won}</td>
                    <td className="py-4 px-6 text-slate-700">{team.draw}</td>
                    <td className="py-4 px-6 text-slate-700">{team.lost}</td>
                    <td className="py-4 px-6 font-medium text-slate-800">{team.goalsFor}</td>
                    <td className="py-4 px-6 text-slate-700">{team.goalsAgainst}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        team.goalDifference > 0 
                          ? 'bg-green-100 text-green-800'
                          : team.goalDifference < 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-lg text-slate-800">{team.points}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-1">
                        {getTeamForm(team.team)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Fixtures */}
        {league.recentFixtures && league.recentFixtures.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Recent Fixtures</h3>
            <div className="space-y-4">
              {league.recentFixtures.slice(0, 5).map((fixture) => (
                <div key={fixture.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50">
                  <div className="flex-1 text-right">
                    <div className="font-medium text-slate-800">{fixture.homeTeam}</div>
                    <div className="text-sm text-slate-600">Home</div>
                  </div>
                  <div className="mx-8 text-center">
                    <div className="text-2xl font-bold text-slate-800">
                      {fixture.homeScore} - {fixture.awayScore}
                    </div>
                    <div className="text-sm text-slate-500">
                      {new Date(fixture.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-slate-800">{fixture.awayTeam}</div>
                    <div className="text-sm text-slate-600">Away</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">League Positions Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-yellow-100 border-2 border-yellow-200 flex items-center justify-center font-bold">
                1
              </div>
              <span className="text-sm font-medium text-yellow-800">Champions</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center font-bold">
                2
              </div>
              <span className="text-sm font-medium text-gray-800">Runner-up</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center font-bold">
                3
              </div>
              <span className="text-sm font-medium text-orange-800">Third Place</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center font-bold">
                4
              </div>
              <span className="text-sm font-medium text-blue-800">European Places</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center font-bold">
                18
              </div>
              <span className="text-sm font-medium text-red-800">Relegation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}