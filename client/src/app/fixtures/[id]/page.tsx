'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  ChevronLeft,
  Download,
  Share2,
  Eye,
  Home,

  Clock,
  Target,

  BarChart3,
  Loader2,
  AlertCircle,
  User,

  Activity,
  GlobeIcon,

} from 'lucide-react';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { FixtureWithLeague, FixtureStatus } from '@/features/fixture/types';
import { Lineup } from '@/features/lineup/types';


/**
 * Page: Fixture Details
 * Description: Detailed view of a specific fixture including lineups, stats, and match events.
 * Requirements: REQ-PUB-02 (Lineups, Goals), REQ-PUB-01 (Details)
 * User Story: US-PUB-002 (View Fixture Details)
 * User Journey: UJ-PUB-001 (Browse Fixtures)
 * API: GET /fixtures/one/:id (API_ROUTES.FIXTURES.VIEW)
 * Hook: useGet(API_ROUTES.FIXTURES.VIEW(id))
 */
interface FixtureDetails extends FixtureWithLeague {
  lineups?: Lineup[];
  stats?: {
    homePossession: number;
    awayPossession: number;
    homeShots: number;
    awayShots: number;
    homeShotsOnTarget: number;
    awayShotsOnTarget: number;
    homeCorners: number;
    awayCorners: number;
    homeFouls: number;
    awayFouls: number;
    homeOffsides: number;
    awayOffsides: number;
    homeYellowCards: number;
    awayYellowCards: number;
    homeRedCards: number;
    awayRedCards: number;
  };
}

export default function FixtureDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const fixtureId = params.id as string;

  const [activeTab, setActiveTab] = useState<'overview' | 'lineup' | 'stats' | 'timeline'>('overview');
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');

  // Fetch fixture details with lineups and stats
  const {
    data: fixture,
    loading,
    error
  } = useGet<FixtureDetails>(API_ROUTES.FIXTURES.VIEW(fixtureId), {
    params: {
      include: 'league,lineups.player,lineups.player.stats,stats'
    }
  });

  // Group lineups by position category
  const homeLineup = fixture?.lineups?.filter(l =>
    l.player && (selectedTeam === 'home' ? true : false)
  ) || [];

  const awayLineup = fixture?.lineups?.filter(l =>
    l.player && (selectedTeam === 'away' ? true : false)
  ) || [];

  const groupedLineup = (lineup: Lineup[]) => {
    const groups: Record<string, Lineup[]> = {
      'GOALKEEPER': [],
      'DEFENDER': [],
      'MIDFIELDER': [],
      'FORWARD': []
    };

    lineup.forEach(l => {
      if (l.player?.positionCategory) {
        const category = l.player.positionCategory.toUpperCase();
        if (groups[category]) {
          groups[category].push(l);
        }
      }
    });

    return groups;
  };

  const getStatusColor = (status: FixtureStatus) => {
    switch (status) {
      case FixtureStatus.WON: return 'bg-green-100 text-green-800';
      case FixtureStatus.LOST: return 'bg-red-100 text-red-800';
      case FixtureStatus.DRAW: return 'bg-yellow-100 text-yellow-800';
      case FixtureStatus.PLAYING: return 'bg-blue-100 text-blue-800';
      case FixtureStatus.SCHEDULED: return 'bg-gray-100 text-gray-800';
      case FixtureStatus.CANCELLED: return 'bg-gray-300 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPositionColor = (position: string) => {
    if (position.includes('GOALKEEPER') || position.includes('GK')) return 'bg-blue-100 text-blue-800';
    if (position.includes('DEFENDER') || position.includes('DF')) return 'bg-green-100 text-green-800';
    if (position.includes('MIDFIELDER') || position.includes('MF')) return 'bg-yellow-100 text-yellow-800';
    if (position.includes('FORWARD') || position.includes('FW')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPlayerFormColor = (form?: string) => {
    switch (form) {
      case 'EXCELLENT': return 'text-green-600';
      case 'GOOD': return 'text-green-500';
      case 'AVERAGE': return 'text-yellow-500';
      case 'POOR': return 'text-orange-500';
      case 'TERRIBLE': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const renderPlayerCard = (lineup: Lineup) => {
    const { player } = lineup;
    if (!player) return null;

    return (
      <div key={player.id} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              {player.imageUrl ? (
                <Image
                  src={player.imageUrl}
                  alt={player.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-slate-400" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">{player.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPositionColor(player.position as string)}`}>
                  {player.position.replace('_', ' ')}
                </span>
                {player.jerseyNumber && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                    #{player.jerseyNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
          {lineup.isStarting && (
            <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Starting
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-slate-600">
              <Target className="h-3 w-3" />
              <span>Form:</span>
              <span className={`font-medium ${getPlayerFormColor(player.form)}`}>
                {player.form || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <Activity className="h-3 w-3" />
              <span>Status:</span>
              <span className={`font-medium ${player.status === 'ACTIVE' ? 'text-green-600' :
                player.status === 'INJURED' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                {player.status}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-slate-600">
              <span className="font-medium">{player.heightInCm || 'N/A'} cm</span>
            </div>
            <div className="text-slate-600">
              <span className="font-medium">{player.nationality || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-slate-700 animate-spin mb-4" />
            <p className="text-slate-600">Loading fixture details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !fixture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 mb-8"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Fixtures
          </button>

          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              {error ? 'Error Loading Fixture' : 'Fixture Not Found'}
            </h3>
            <p className="text-red-600 mb-6">
              {error || 'The requested fixture could not be found.'}
            </p>
            <button
              onClick={() => router.push('/fixtures')}
              className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors font-medium"
            >
              Browse All Fixtures
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusColor(fixture.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
            data-testid="back-button"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Fixtures
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {fixture.league?.logo && (
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Image
                      src={fixture.league.logo}
                      alt={fixture.league.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">{fixture.league?.name}</h2>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2 ${statusDisplay}`}>
                    {fixture.status.charAt(0).toUpperCase() + fixture.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDate(String(fixture.matchDate))}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{fixture.venue}</span>
                </div>
              </div>
            </div>

            {/* Fixture Score */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 min-w-[300px]">
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                    <Home className="h-8 w-8 text-white" />
                  </div>
                  <div className="font-bold text-lg">{fixture.homeTeam}</div>
                  <div className="text-sm text-slate-300">Home</div>
                </div>

                <div className="text-center px-6">
                  {fixture.status === FixtureStatus.SCHEDULED ? (
                    <div className="text-2xl font-bold">VS</div>
                  ) : (
                    <>
                      <div className="text-5xl font-bold mb-2">
                        {fixture.homeScore || 0} - {fixture.awayScore || 0}
                      </div>
                      <div className="text-sm text-slate-300">Final Score</div>
                    </>
                  )}
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                    <GlobeIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="font-bold text-lg">{fixture.awayTeam}</div>
                  <div className="text-sm text-slate-300">Away</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'lineup', label: 'Lineups', icon: Users },
              { id: 'stats', label: 'Statistics', icon: BarChart3 },
              { id: 'timeline', label: 'Timeline', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-700 bg-blue-50'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Fixture Summary */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Fixture Summary</h3>
                  <div className="bg-slate-50 rounded-lg p-6">
                    <p className="text-slate-700">
                      {fixture.status === FixtureStatus.SCHEDULED
                        ? `Upcoming match between ${fixture.homeTeam} and ${fixture.awayTeam} at ${fixture.venue}.`
                        : `Fixture played on ${formatDate(String(fixture.matchDate))} at ${fixture.venue}. ` +
                        `${fixture.homeTeam} ${fixture.status === FixtureStatus.WON ? 'won' : fixture.status === FixtureStatus.LOST ? 'lost' : 'drew'} ` +
                        `with a score of ${fixture.homeScore || 0}-${fixture.awayScore || 0}.`
                      }
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-slate-800 mb-1">
                        {fixture.stats?.homePossession || '50'}%
                      </div>
                      <div className="text-sm text-slate-600">Possession (Home)</div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-slate-800 mb-1">
                        {fixture.stats?.homeShots || '0'}
                      </div>
                      <div className="text-sm text-slate-600">Total Shots (Home)</div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-slate-800 mb-1">
                        {fixture.stats?.homeCorners || '0'}
                      </div>
                      <div className="text-sm text-slate-600">Corners (Home)</div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-slate-800 mb-1">
                        {fixture.stats?.homeFouls || '0'}
                      </div>
                      <div className="text-sm text-slate-600">Fouls (Home)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lineup' && (
              <div className="space-y-8">
                {/* Team Selection */}
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSelectedTeam('home')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedTeam === 'home'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                  >
                    {fixture.homeTeam} Lineup
                  </button>
                  <button
                    onClick={() => setSelectedTeam('away')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedTeam === 'away'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                  >
                    {fixture.awayTeam} Lineup
                  </button>
                </div>

                {/* Lineup Display */}
                {homeLineup.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      {selectedTeam === 'home' ? fixture.homeTeam : fixture.awayTeam} Squad
                    </h3>

                    <div className="space-y-6">
                      {Object.entries(groupedLineup(selectedTeam === 'home' ? homeLineup : awayLineup)).map(([positionCategory, players]) => {
                        if (players.length === 0) return null;

                        return (
                          <div key={positionCategory}>
                            <h4 className="text-md font-medium text-slate-700 mb-3 capitalize">
                              {positionCategory.toLowerCase()}s ({players.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {players.map(renderPlayerCard)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No lineup data</h3>
                    <p className="text-slate-500">
                      Lineup information is not available for this match.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Fixture Statistics</h3>

                {fixture.stats ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Home Team Stats */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                      <h4 className="font-semibold text-slate-800 mb-4">{fixture.homeTeam}</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Possession</span>
                          <span className="font-semibold">{fixture.stats.homePossession}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Shots</span>
                          <span className="font-semibold">{fixture.stats.homeShots}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Shots on Target</span>
                          <span className="font-semibold">{fixture.stats.homeShotsOnTarget}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Corners</span>
                          <span className="font-semibold">{fixture.stats.homeCorners}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Fouls</span>
                          <span className="font-semibold">{fixture.stats.homeFouls}</span>
                        </div>
                      </div>
                    </div>

                    {/* Away Team Stats */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                      <h4 className="font-semibold text-slate-800 mb-4">{fixture.awayTeam}</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Possession</span>
                          <span className="font-semibold">{fixture.stats.awayPossession}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Shots</span>
                          <span className="font-semibold">{fixture.stats.awayShots}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Shots on Target</span>
                          <span className="font-semibold">{fixture.stats.awayShotsOnTarget}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Corners</span>
                          <span className="font-semibold">{fixture.stats.awayCorners}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Fouls</span>
                          <span className="font-semibold">{fixture.stats.awayFouls}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Fixture statistics are not available.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Fixture Timeline</h3>
                <p className="text-slate-500">
                  Fixture timeline and events will be displayed here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">

            <button
              onClick={() => router.push(`/gallery/${fixture.id}`)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              View Gallery
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}