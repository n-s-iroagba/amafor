'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Trophy, Users, Target, TrendingUp, TrendingDown, 
  Edit, Trash2, Plus, BarChart3, Search, Filter,
  Shield, Flag, Goal, Clock, Award, Star, TrendingUp as TrendingUpIcon,
  Calendar, Home, Zap, ShieldCheck, Download, Share2, MoreVertical,
  Upload,
  Printer
} from 'lucide-react';
import { motion } from 'framer-motion';
import { API_ROUTES } from '@/config/routes';
import { LeagueStatistics } from '@/features/league-statistics/types';
import { League } from '@/features/league/types';
import { useGet, useDelete } from '@/shared/hooks/useApiQuery';


interface LeagueStatisticsResponse {
  data: LeagueStatistics[];
  league: League;
  summary: {
    totalGoals: number;
    averageGoalsPerMatch: number;
    totalMatches: number;
    totalTeams: number;
    highestScoringTeam: string;
    bestDefenseTeam: string;
    mostCleanSheets: string;
  };
  topScorers: LeagueStatistics[];
  topDefenses: LeagueStatistics[];
  formTable: LeagueStatistics[];
}

export default function LeagueStatisticsPage() {
  const params = useParams();
  const router = useRouter();
  const leagueId = params.id as string;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statistics, setStatistics] = useState<LeagueStatistics[]>([]);
  const [league, setLeague] = useState<League | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [topScorers, setTopScorers] = useState<LeagueStatistics[]>([]);
  const [topDefenses, setTopDefenses] = useState<LeagueStatistics[]>([]);
  const [formTable, setFormTable] = useState<LeagueStatistics[]>([]);
  const [deletingId, setDeletingId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'standings' | 'scorers' | 'defenses' | 'form'>('standings');
  
  const { data, loading, refetch } = useGet<LeagueStatisticsResponse>(
    API_ROUTES.LEAGUES.STATISTICS(leagueId)
  );
  
  const { handleDelete: deleteStatistic, deleting: deleteLoading } = useDelete(
    API_ROUTES.LEAGUE_STATISTICS.MUTATE(deletingId)
  );

  useEffect(() => {
    if (data) {
      setStatistics(data.data);
      setLeague(data.league);
      setSummary(data.summary);
      setTopScorers(data.topScorers || []);
      setTopDefenses(data.topDefenses || []);
      setFormTable(data.formTable || []);
    }
  }, [data]);

  const filteredStatistics = statistics.filter(stat => 
    stat.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this statistic? This will permanently remove the data.')) {
      return;
    }
    
    setDeletingId(id);
    try {
      await deleteStatistic();
      await refetch();
    } catch (err) {
      console.error('Error deleting statistic:', err);
    } finally {
      setDeletingId('');
    }
  };

  const calculateGoalDifference = (goalsFor: number, goalsAgainst: number) => {
    return goalsFor - goalsAgainst;
  };

  const getGoalDifferenceColor = (difference: number) => {
    if (difference > 0) return 'text-green-600 bg-green-50';
    if (difference < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getGoalDifferenceIcon = (difference: number) => {
    if (difference > 0) return <TrendingUpIcon className="w-4 h-4 text-green-600" />;
    if (difference < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <TrendingUpIcon className="w-4 h-4 text-gray-400" />;
  };

  const getFormBadgeColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-100 text-green-800';
      case 'D': return 'bg-yellow-100 text-yellow-800';
      case 'L': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderFormBadges = (form?: string) => {
    if (!form) return null;
    return form.split('').map((result, index) => (
      <span
        key={index}
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${getFormBadgeColor(result)}`}
      >
        {result}
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
          
          {/* Table Skeleton */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-16 bg-gray-200 animate-pulse"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 border-b border-gray-100 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-blue-600" />
                {league?.name} - Statistics
              </h1>
              <p className="text-gray-600 mt-2">{league?.season} • League Statistics</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/leagues/${leagueId}/statistics/new`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Statistics
              </Link>
              <Link
                href={`/leagues/${leagueId}`}
                className="inline-flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Back to League
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-blue-100"
          >
            <div className="flex items-center justify-between mb-4">
              <Goal className="w-10 h-10 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 px-3 py-1 bg-blue-50 rounded-full">
                Total Goals
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {summary?.totalGoals || 0}
            </div>
            <div className="text-sm text-gray-500">
              Across {summary?.totalMatches || 0} matches
            </div>
          </motion.div>

          {/* Average Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-10 h-10 text-green-500" />
              <span className="text-sm font-medium text-green-600 px-3 py-1 bg-green-50 rounded-full">
                Avg. Goals
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {summary?.averageGoalsPerMatch?.toFixed(2) || 0}
            </div>
            <div className="text-sm text-gray-500">
              Per match
            </div>
          </motion.div>

          {/* Top Scorer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-yellow-100"
          >
            <div className="flex items-center justify-between mb-4">
              <Target className="w-10 h-10 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-600 px-3 py-1 bg-yellow-50 rounded-full">
                Top Attack
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-2">
              {summary?.highestScoringTeam || 'N/A'}
            </div>
            <div className="text-sm text-gray-500">
              Most goals scored
            </div>
          </motion.div>

          {/* Best Defense */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-purple-100"
          >
            <div className="flex items-center justify-between mb-4">
              <ShieldCheck className="w-10 h-10 text-purple-500" />
              <span className="text-sm font-medium text-purple-600 px-3 py-1 bg-purple-50 rounded-full">
                Best Defense
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-2">
              {summary?.bestDefenseTeam || 'N/A'}
            </div>
            <div className="text-sm text-gray-500">
              Least goals conceded
            </div>
          </motion.div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('standings')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'standings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Trophy className="w-4 h-4 inline mr-2" />
                Standings
              </button>
              <button
                onClick={() => setActiveTab('scorers')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'scorers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Target className="w-4 h-4 inline mr-2" />
                Top Scorers
              </button>
              <button
                onClick={() => setActiveTab('defenses')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'defenses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                Top Defenses
              </button>
              <button
                onClick={() => setActiveTab('form')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'form'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Form Table
              </button>
            </nav>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-64"
              />
            </div>
            {activeTab === 'standings' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Total Teams:</span>
                <span className="font-medium">{statistics.length}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'standings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {filteredStatistics.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        MP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        W
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        D
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        L
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GF
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GD
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PTS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Form
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStatistics.map((stat, index) => (
                      <tr key={stat.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <Trophy className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">{stat.team}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stat.matchesPlayed || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          {stat.wins || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">
                          {stat.draws || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                          {stat.losses || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {stat.goalsFor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {stat.goalsAgainst}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${getGoalDifferenceColor(calculateGoalDifference(stat.goalsFor, stat.goalsAgainst))}`}>
                            {getGoalDifferenceIcon(calculateGoalDifference(stat.goalsFor, stat.goalsAgainst))}
                            <span className="text-sm font-medium">
                              {calculateGoalDifference(stat.goalsFor, stat.goalsAgainst)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 font-bold rounded-lg">
                            {stat.points || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-1">
                            {renderFormBadges(stat.form)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/leagues/${leagueId}/statistics/${stat.id}/edit`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(stat.id)}
                              disabled={deletingId === stat.id || deleteLoading}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                              {deletingId === stat.id || deleteLoading ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Trophy className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No teams found' : 'No statistics available'}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {searchTerm 
                    ? "No teams match your search. Try a different search term."
                    : "Start by adding statistics for teams in this league."
                  }
                </p>
                {!searchTerm && (
                  <Link
                    href={`/leagues/${leagueId}/statistics/new`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Statistics
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'scorers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {topScorers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Goals For
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Goals
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matches Played
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topScorers.map((team, index) => (
                      <tr key={team.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${index < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            <span className="font-bold">{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                              <Target className="w-4 h-4 text-orange-600" />
                            </div>
                            <span className="font-medium text-gray-900">{team.team}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Goal className="w-5 h-5 text-orange-500 mr-2" />
                            <span className="text-2xl font-bold text-gray-900">{team.goalsFor}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <BarChart3 className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="font-medium">{team.avgGoalsPerMatch?.toFixed(2) || '0.00'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {team.matchesPlayed || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/leagues/${leagueId}/statistics/${team.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                          >
                            <MoreVertical className="w-4 h-4" />
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No scoring data available
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Add match results to see top scorers statistics.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'defenses' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {topDefenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Goals Against
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Conceded
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clean Sheets
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topDefenses.map((team, index) => (
                      <tr key={team.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${index < 3 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            <span className="font-bold">{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <Shield className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="font-medium text-gray-900">{team.team}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <ShieldCheck className="w-5 h-5 text-green-500 mr-2" />
                            <span className="text-2xl font-bold text-gray-900">{team.goalsAgainst}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <BarChart3 className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="font-medium">{team.avgGoalsConcededPerMatch?.toFixed(2) || '0.00'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="font-medium">{team.cleanSheets || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/leagues/${leagueId}/statistics/${team.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                          >
                            <MoreVertical className="w-4 h-4" />
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No defense data available
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Add match results to see top defenses statistics.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {formTable.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last 5 Matches
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Form
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Match
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formTable.map((team) => (
                      <tr key={team.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                              <TrendingUp className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="font-medium text-gray-900">{team.team}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            {renderFormBadges(team.form)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {team.form && team.form.length > 0 && (
                              <>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFormBadgeColor(team.form[0])}`}>
                                  {team.form[0]}
                                </span>
                                <span className="text-sm text-gray-500">
                                  in last match
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 bg-purple-100 text-purple-800 font-bold rounded-lg flex items-center justify-center">
                              {team.points || 0}
                            </div>
                            <span className="text-sm text-gray-500">points</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {team.lastMatchDate ? new Date(team.lastMatchDate).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No form data available
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Add match results to see team form statistics.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Additional Stats Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* League Progress */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              League Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Matches Completed</span>
                  <span className="font-medium">{summary?.totalMatches || 0}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${summary?.totalMatches ? Math.min((summary.totalMatches / 380) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Goal Average</span>
                  <span className="font-medium">{summary?.averageGoalsPerMatch?.toFixed(2) || 0}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: `${summary?.averageGoalsPerMatch ? Math.min((summary.averageGoalsPerMatch / 5) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href={`/leagues/${leagueId}/statistics/bulk-update`}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Bulk Update</div>
                  <div className="text-sm text-gray-500">Update multiple statistics at once</div>
                </div>
              </Link>
              <Link
                href={`/leagues/${leagueId}/fixtures`}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">View Fixtures</div>
                  <div className="text-sm text-gray-500">See upcoming matches</div>
                </div>
              </Link>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
              >
                <Printer className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Print Table</div>
                  <div className="text-sm text-gray-500">Print current standings</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}