'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Trophy,
  Images,
  ChevronLeft,
  Download,
  Share2,
  Eye,
  Home,

  AlertCircle,
  Loader2,
  Maximize2,
  ChevronRight,
  ChevronLeft as LeftIcon,
  Heart,
  Bookmark,
  GlobeIcon
} from 'lucide-react';
import { useGet } from '@/shared/hooks/useApiQuery';
import { FixtureWithLeague, FixtureImage, FixtureStatus } from '@/features/fixture/types';


export default function FixtureGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const fixtureId = params.id as string;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Fetch fixture details
  const {
    data: fixture,
    loading: fixtureLoading,
    error: fixtureError
  } = useGet<FixtureWithLeague>(`/api/fixtures/${fixtureId}`, {
    params: { include: 'league' }
  });

  // Fetch match images for this fixture
  const {
    data: images,
    loading: imagesLoading,
    error: imagesError
  } = useGet<FixtureImage[]>(`/api/fixtures/${fixtureId}/images`);

  const loading = fixtureLoading || imagesLoading;
  const error = fixtureError || imagesError;

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadImage = (imageUrl: string, description: string) => {
    // In real app, implement download logic
    alert(`Downloading: ${description}`);
  };

  const handleShareFixture = () => {
    if (navigator.share) {
      navigator.share({
        title: `${fixture?.homeTeam} vs ${fixture?.awayTeam}`,
        text: `Check out photos from ${fixture?.homeTeam} vs ${fixture?.awayTeam} match`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-slate-700 animate-spin mb-4" />
            <p className="text-slate-600">Loading match gallery...</p>
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
            Back to Gallery
          </button>

          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              {error ? 'Error Loading Gallery' : 'Fixture Not Found'}
            </h3>
            <p className="text-red-600 mb-6">
              {error || 'The requested match gallery could not be found.'}
            </p>
            <button
              onClick={() => router.push('/gallery')}
              className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors font-medium"
            >
              Browse All Fixtures
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedImage = images?.[selectedImageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with fixture info */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Gallery
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
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
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(fixture.status)}`}>
                    {getStatusIcon(fixture.status)} {fixture.status.charAt(0).toUpperCase() + fixture.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(String(fixture.matchDate))}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="h-5 w-5" />
                <span>{fixture.venue}</span>
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
                        {fixture.homeScore} - {fixture.awayScore}
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
        {/* Stats and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Images className="h-5 w-5 text-slate-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">{images?.length || 0}</div>
                  <div className="text-sm text-slate-600">Photos</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-slate-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">
                    {Math.floor(Math.random() * 1000) + 500}
                  </div>
                  <div className="text-sm text-slate-600">Views</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShareFixture}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                <Share2 className="h-5 w-5" />
                Share
              </button>
              <button className="px-5 py-2.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center gap-2 font-medium">
                <Download className="h-5 w-5" />
                Download All
              </button>
            </div>
          </div>
        </div>

        {/* Main Gallery */}
        {images && images.length > 0 ? (
          <>
            {/* Selected Image View */}
            {selectedImage && (
              <div className="mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="relative aspect-[16/9] bg-slate-100">
                    {/* In real app, use next/image */}
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${selectedImage.url})` }}
                    />
                    <button
                      onClick={() => setLightboxOpen(true)}
                      className="absolute top-4 right-4 bg-black/70 text-white p-2.5 rounded-lg hover:bg-black/80 transition-colors"
                    >
                      <Maximize2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">
                          Photo {selectedImageIndex + 1} of {images.length}
                        </h3>
                        <p className="text-slate-600">{selectedImage.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="p-2.5 text-slate-600 hover:text-slate-800">
                          <Heart className="h-5 w-5" />
                        </button>
                        <button className="p-2.5 text-slate-600 hover:text-slate-800">
                          <Bookmark className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDownloadImage(selectedImage.url, selectedImage.description)}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => setSelectedImageIndex(prev => Math.max(0, prev - 1))}
                    disabled={selectedImageIndex === 0}
                    className="p-3 rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <LeftIcon className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${index === selectedImageIndex
                          ? 'bg-slate-800'
                          : 'bg-slate-300 hover:bg-slate-400'
                          }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedImageIndex(prev => Math.min(images.length - 1, prev + 1))}
                    disabled={selectedImageIndex === images.length - 1}
                    className="p-3 rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Thumbnail Grid */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">All Fixture Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`group relative aspect-square rounded-lg overflow-hidden transition-all ${index === selectedImageIndex
                      ? 'ring-2 ring-slate-800 ring-offset-2'
                      : 'hover:ring-2 hover:ring-slate-400'
                      }`}
                  >
                    {/* In real app, use next/image */}
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${image.url})` }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-sm truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Images className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No photos available</h3>
            <p className="text-slate-500 mb-6">
              There are no photos uploaded for this match yet.
            </p>
          </div>
        )}

        {/* Related Fixtures */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">More from this league</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* You would fetch related fixtures here */}
            <button
              onClick={() => router.push('/gallery')}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-left hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-800">Browse all fixtures</h4>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
              <p className="text-slate-600 text-sm mb-4">
                View photos from all matches in our gallery
              </p>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Images className="h-4 w-4" />
                <span>Explore complete match gallery</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white p-2 hover:text-slate-300"
          >
            ✕
          </button>

          <div className="relative max-w-7xl max-h-[80vh]">
            {/* In real app, use next/image */}
            <div
              className="w-full h-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${selectedImage.url})`,
                aspectRatio: '16/9'
              }}
            />
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white text-center">
            <p className="text-lg font-medium mb-2">{selectedImage.description}</p>
            <p className="text-sm text-slate-300">
              Photo {selectedImageIndex + 1} of {images?.length}
            </p>
          </div>

          {/* Lightbox Navigation */}
          <button
            onClick={() => setSelectedImageIndex(prev => Math.max(0, prev - 1))}
            disabled={selectedImageIndex === 0}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-4 hover:text-slate-300 disabled:opacity-50"
          >
            <LeftIcon className="h-8 w-8" />
          </button>

          <button
            onClick={() => setSelectedImageIndex(prev => Math.min(images?.length - 1 || 0, prev + 1))}
            disabled={selectedImageIndex === (images?.length || 1) - 1}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-4 hover:text-slate-300 disabled:opacity-50"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </div>
  );
}