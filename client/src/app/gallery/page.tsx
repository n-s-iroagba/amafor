'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Trophy,
  Images,
  ChevronRight,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Home,
  GlobeIcon,


} from 'lucide-react';
import { useGet } from '@/shared/hooks/useApiQuery';
import { FixtureStatus, FixtureWithLeague, FixtureImage } from '@/features/fixture/types';


export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FixtureStatus | 'all'>('all');
  const [leagueFilter, setLeagueFilter] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Fetch fixtures with their images
  const {
    data: fixturesData,
    loading,
    error,
    refetch
  } = useGet<FixtureWithLeague[]>('/api/fixtures/gallery', {
    params: {
      include: 'league,images',
      limit: 50,
      sort: '-date'
    }
  });

  // Fetch leagues for filter
  const { data: leaguesData } = useGet<any[]>('/api/leagues', {
    params: { limit: 20 }
  });

  // Extract unique years from fixtures
  const years = Array.from(
    new Set(
      fixturesData?.map(fixture => new Date(fixture.matchDate).getFullYear().toString()) || []
    )
  ).sort((a, b) => parseInt(b) - parseInt(a));

  // Filter fixtures based on search and filters
  const filteredFixtures = fixturesData?.filter(fixture => {
    const matchesSearch =
      fixture.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fixture.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fixture.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fixture.league?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || fixture.status === statusFilter;
    const matchesLeague = leagueFilter === 'all' || fixture.league?.id?.toString() === leagueFilter;
    const matchesYear = selectedYear === 'all' ||
      new Date(fixture.matchDate).getFullYear().toString() === selectedYear;

    return matchesSearch && matchesStatus && matchesLeague && matchesYear;
  });

  // Group fixtures by date
  const groupedFixtures = filteredFixtures?.reduce((acc, fixture) => {
    const date = new Date(fixture.matchDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(fixture);
    return acc;
  }, {} as Record<string, FixtureWithLeague[]>);

  // Mock images for each fixture (in real app, this would come from API)
  const getMockImages = (fixtureId: number): FixtureImage[] => {
    const imageCount = Math.floor(Math.random() * 8) + 1; // 1-8 images
    return Array.from({ length: imageCount }, (_, i) => ({
      id: `${fixtureId}-${i}`,
      fixtureId: fixtureId.toString(),
      url: `https://images.unsplash.com/photo-${Date.now()}-${i}?auto=format&fit=crop&w=800&q=80`,
      description: `Fixture action ${i + 1}`
    }));
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

  const getStatusIcon = (status: FixtureStatus) => {
    switch (status) {
      case FixtureStatus.WON: return '🏆';
      case FixtureStatus.LOST: return '😔';
      case FixtureStatus.DRAW: return '🤝';
      case FixtureStatus.PLAYING: return '⏳';
      case FixtureStatus.SCHEDULED: return '📅';
      case FixtureStatus.CANCELLED: return '❌';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-slate-700 animate-spin mb-4" />
            <p className="text-slate-600">Loading gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 mb-2">Error Loading Gallery</h3>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Fixture Gallery</h1>
          <p className="text-slate-300 text-lg max-w-3xl">
            Relive the action through photos from our matches. Browse through fixtures,
            view match highlights, and explore game moments.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
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

            {/* Status Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-5 w-5 text-slate-600" />
                <label className="text-sm font-medium text-slate-700">Status</label>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FixtureStatus | 'all')}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
              >
                <option value="all">All Status</option>
                <option value={FixtureStatus.WON}>Won</option>
                <option value={FixtureStatus.LOST}>Lost</option>
                <option value={FixtureStatus.DRAW}>Draw</option>
                <option value={FixtureStatus.PLAYING}>Playing</option>
                <option value={FixtureStatus.SCHEDULED}>Scheduled</option>
                <option value={FixtureStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>

            {/* League Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-slate-600" />
                <label className="text-sm font-medium text-slate-700">League</label>
              </div>
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

            {/* Year Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-slate-600" />
                <label className="text-sm font-medium text-slate-700">Year</label>
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filters info */}
          {(searchTerm || statusFilter !== 'all' || leagueFilter !== 'all' || selectedYear !== 'all') && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Showing {filteredFixtures?.length || 0} of {fixturesData?.length || 0} fixtures
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setLeagueFilter('all');
                    setSelectedYear('all');
                  }}
                  className="text-sm text-slate-700 hover:text-slate-900 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gallery Content */}
        {filteredFixtures && filteredFixtures.length > 0 ? (
          Object.entries(groupedFixtures || {}).map(([date, fixtures]) => (
            <div key={date} className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-200">
                {date}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fixtures.map((fixture) => {
                  const fixtureImages = getMockImages(Number(fixture.id));
                  const firstImage = fixtureImages[0];

                  return (
                    <Link
                      key={fixture.id}
                      href={`/gallery/${fixture.id}`}
                      className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all overflow-hidden"
                    >
                      {/* Fixture Header */}
                      <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {fixture.league?.logo && (
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
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
                              <h3 className="font-bold text-slate-800">{fixture.league?.name}</h3>
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(fixture.status)}`}>
                                {getStatusIcon(fixture.status)} {fixture.status.charAt(0).toUpperCase() + fixture.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>

                        {/* Teams */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                              <Home className="h-6 w-6 text-slate-600" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{fixture.homeTeam}</div>
                              <div className="text-sm text-slate-600">Home</div>
                            </div>
                          </div>

                          <div className="text-center">
                            {fixture.status === FixtureStatus.SCHEDULED ? (
                              <div className="text-sm text-slate-500">VS</div>
                            ) : (
                              <div className="text-2xl font-bold text-slate-800">
                                {fixture.homeScore} - {fixture.awayScore}
                              </div>
                            )}
                            <div className="text-xs text-slate-500 mt-1">
                              {formatDate(String(fixture.matchDate))}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-bold text-slate-800 text-right">{fixture.awayTeam}</div>
                              <div className="text-sm text-slate-600 text-right">Away</div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                              <GlobeIcon className="h-6 w-6 text-slate-600" />
                            </div>
                          </div>
                        </div>

                        {/* Venue */}
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="h-4 w-4" />
                          <span>{fixture.venue}</span>
                        </div>
                      </div>

                      {/* Image Preview */}
                      <div className="relative">
                        {firstImage ? (
                          <>
                            <div className="aspect-video bg-slate-100 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                              {/* In real app, use next/image */}
                              <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${firstImage.url})` }}
                              />
                            </div>
                            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 z-20">
                              <Images className="h-4 w-4" />
                              <span>{fixtureImages.length} photos</span>
                              {/* BRD Requirement: DEV-13 No Image Downloads Allowed */}
                            </div>
                          </>
                        ) : (
                          <div className="aspect-video bg-slate-100 flex flex-col items-center justify-center text-slate-400">
                            <Images className="h-12 w-12 mb-2" />
                            <span className="text-sm">No photos available</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Images className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No fixtures found</h3>
            <p className="text-slate-500 mb-6">
              {fixturesData?.length === 0
                ? "No fixtures have been added to the gallery yet."
                : "Try adjusting your filters to see more results."}
            </p>
            {fixturesData?.length === 0 && (
              <button
                onClick={() => refetch()}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
              >
                Refresh Gallery
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}