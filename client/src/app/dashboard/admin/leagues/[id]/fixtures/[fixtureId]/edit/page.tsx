'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/routes';
import { useGet, usePut } from '@/shared/hooks/useApiQuery';
import { Calendar, MapPin, Users, Upload, X, Loader2, ArrowLeft, Image as ImageIcon, Trophy, Clock, Ban, Play, Calendar as CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import api from '@/shared/lib/axios';

enum FixtureStatus {
  WON = 'won',
  LOST = 'lost',
  DRAW = 'draw',
  PLAYING = 'playing',
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
}

interface Fixture {
  id: number;
  leagueId: number;
  date: string;
  matchDate?: string; // Alias for date
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  venue: string;
  status: FixtureStatus;
}

interface League {
  id: number;
  name: string;
  season: string;
}

interface FormData {
  leagueId: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: File | null;
  awayTeamLogo: File | null;
  venue: string;
  status: FixtureStatus;
}

interface FormErrors {
  leagueId?: string;
  date?: string;
  homeTeam?: string;
  awayTeam?: string;
  venue?: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  submit?: string;
  status?: string;
}

// Status configuration for better UX
const statusConfig = {
  [FixtureStatus.SCHEDULED]: {
    label: 'Scheduled',
    description: 'Fixture is planned for future',
    icon: CalendarIcon,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  [FixtureStatus.PLAYING]: {
    label: 'Playing',
    description: 'Fixture is currently in progress',
    icon: Play,
    color: 'text-orange-600 bg-orange-50 border-orange-200'
  },
  [FixtureStatus.WON]: {
    label: 'Won',
    description: 'Fixture completed - Our team won',
    icon: Trophy,
    color: 'text-green-600 bg-green-50 border-green-200'
  },
  [FixtureStatus.LOST]: {
    label: 'Lost',
    description: 'Fixture completed - Our team lost',
    icon: Trophy,
    color: 'text-red-600 bg-red-50 border-red-200'
  },
  [FixtureStatus.DRAW]: {
    label: 'Draw',
    description: 'Fixture completed - It was a draw',
    icon: Trophy,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
  },
  [FixtureStatus.CANCELLED]: {
    label: 'Cancelled',
    description: 'Fixture has been cancelled',
    icon: Ban,
    color: 'text-gray-600 bg-gray-50 border-gray-200'
  }
};


/**
 * Page: Edit Fixture
 * Description: Form to update fixture details (scores, status, venue).
 * Requirements: REQ-ADM-08 (Fixture Management)
 * User Story: US-ADM-011 (Update Fixture)
 * User Journey: UJ-ADM-005 (Competition Setup)
 * API: PUT /fixtures/:id (API_ROUTES.FIXTURES.UPDATE)
 */
export default function EditFixture() {
  const router = useRouter();
  const params = useParams();
  const id = params.fixtureId as string;

  const [formData, setFormData] = useState<FormData>({
    leagueId: '',
    date: '',
    homeTeam: 'Amafor Galadiators',
    awayTeam: '',
    homeTeamLogo: null,
    awayTeamLogo: null,
    venue: '',
    status: FixtureStatus.SCHEDULED
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<{
    home: string | null;
    away: string | null;
  }>({ home: null, away: null });

  const { data: fixture, loading: fixtureLoading } = useGet<Fixture>(
    API_ROUTES.FIXTURES.VIEW(id)
  );
  const { data: leagues, loading: leaguesLoading } = useGet<League[]>(
    `${API_ROUTES.LEAGUES.LIST}/all`
  );

  const { put, isPending: isSubmitting } = usePut(
    API_ROUTES.FIXTURES.UPDATE(id)
  );

  const isLoading = fixtureLoading || leaguesLoading;

  useEffect(() => {
    if (fixture) {
      setFormData({
        leagueId: fixture.leagueId.toString(),
        date: new Date(fixture.date || fixture.matchDate || '').toISOString().slice(0, 16),
        homeTeam: fixture.homeTeam,
        awayTeam: fixture.awayTeam,
        homeTeamLogo: null,
        awayTeamLogo: null,
        venue: fixture.venue,
        status: fixture.status
      });

      // Set preview URLs from existing images
      setPreviewUrls({
        home: fixture.homeTeamLogo,
        away: fixture.awayTeamLogo
      });
    }
  }, [fixture]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (team: 'home' | 'away', file: File | null) => {
    const field = team === 'home' ? 'homeTeamLogo' : 'awayTeamLogo';
    handleInputChange(field, file);

    // Create preview URL for new files
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({ ...prev, [team]: url }));
    }

    // Clear file error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const removeFile = (team: 'home' | 'away') => {
    handleFileChange(team, null);
    // Don't clear preview URL if we're just removing a new file upload
    // Keep the existing image preview
    if (team === 'home' && formData.homeTeamLogo) {
      URL.revokeObjectURL(previewUrls.home || '');
      setPreviewUrls(prev => ({ ...prev, home: fixture?.homeTeamLogo || null }));
    }
    if (team === 'away' && formData.awayTeamLogo) {
      URL.revokeObjectURL(previewUrls.away || '');
      setPreviewUrls(prev => ({ ...prev, away: fixture?.awayTeamLogo || null }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.leagueId) newErrors.leagueId = 'Please select a league';
    if (!formData.date) newErrors.date = 'Fixture date and time is required';
    if (!formData.homeTeam.trim()) newErrors.homeTeam = 'Home team name is required';
    if (!formData.awayTeam.trim()) newErrors.awayTeam = 'Away team name is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';

    // Validate file types if new files are uploaded
    if (formData.homeTeamLogo && !formData.homeTeamLogo.type.startsWith('image/')) {
      newErrors.homeTeamLogo = 'Please upload a valid image file';
    }
    if (formData.awayTeamLogo && !formData.awayTeamLogo.type.startsWith('image/')) {
      newErrors.awayTeamLogo = 'Please upload a valid image file';
    }

    // Validate date for completed matches
    if (formData.status !== FixtureStatus.SCHEDULED && !formData.date) {
      newErrors.date = 'Date is required for completed or ongoing matches';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const sigRes = await api.get('/videos/upload/signature');
    const { signature, timestamp, apiKey, cloudName, folder } = sigRes.data;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp);
    formData.append('api_key', apiKey);
    formData.append('folder', folder);

    const uploadRes = await api.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return uploadRes.data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUploading(true);
    setErrors(prev => ({ ...prev, submit: undefined }));

    try {
      // Upload new logos if provided, otherwise use existing ones
      const [homeLogoUrl, awayLogoUrl] = await Promise.all([
        formData.homeTeamLogo ? uploadImage(formData.homeTeamLogo) : Promise.resolve(fixture?.homeTeamLogo),
        formData.awayTeamLogo ? uploadImage(formData.awayTeamLogo) : Promise.resolve(fixture?.awayTeamLogo)
      ]);

      await put({
        leagueId: parseInt(formData.leagueId),
        date: formData.date,
        homeTeam: formData.homeTeam.trim(),
        awayTeam: formData.awayTeam.trim(),
        homeTeamLogo: homeLogoUrl,
        awayTeamLogo: awayLogoUrl,
        venue: formData.venue.trim(),
        status: formData.status,
      });

      router.push('/sports-admin/fixtures');
      router.refresh(); // Refresh to show updated data
    } catch (error: any) {
      console.error('Error updating fixture:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || 'Failed to update fixture. Please try again.'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      if (formData.homeTeamLogo && previewUrls.home?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrls.home);
      }
      if (formData.awayTeamLogo && previewUrls.away?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrls.away);
      }
    };
  }, [formData.homeTeamLogo, formData.awayTeamLogo, previewUrls]);

  // Get current status configuration
  const currentStatusConfig = statusConfig[formData.status];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-4" />
          <p className="text-sky-700 font-medium">Loading fixture data...</p>
        </div>
      </div>
    );
  }

  if (!fixture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Fixture not found</p>
          <button
            onClick={() => router.push('/fixtures')}
            className="mt-4 text-sky-600 hover:text-sky-700"
          >
            Back to fixtures
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Fixture</h1>
            <p className="text-gray-600 mt-1">
              Update match details and team information
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* League Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                League *
              </label>
              <select
                value={formData.leagueId}
                onChange={(e) => handleInputChange('leagueId', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${errors.leagueId ? 'border-red-300' : 'border-gray-300'
                  }`}
              >
                <option value="">Select a league</option>
                {leagues?.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name} - {league.season}
                  </option>
                ))}
              </select>
              {errors.leagueId && (
                <p className="mt-1 text-sm text-red-600">{errors.leagueId}</p>
              )}
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Fixture Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Teams Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Home Team */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home Team *
                </label>
                <input
                  type="text"
                  value={formData.homeTeam}
                  onChange={(e) => handleInputChange('homeTeam', e.target.value)}
                  placeholder="Enter home team name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${errors.homeTeam ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.homeTeam && (
                  <p className="mt-1 text-sm text-red-600">{errors.homeTeam}</p>
                )}

                {/* Home Team Logo */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Team Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-sky-400 transition-colors relative">
                    {previewUrls.home ? (
                      <div className="relative inline-block">
                        <img
                          src={previewUrls.home}
                          alt="Home team logo preview"
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                        {formData.homeTeamLogo && (
                          <button
                            type="button"
                            onClick={() => removeFile('home')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload new home team logo
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('home', e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {errors.homeTeamLogo && (
                    <p className="mt-1 text-sm text-red-600">{errors.homeTeamLogo}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to keep current logo
                  </p>
                </div>
              </div>

              {/* Away Team */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Away Team *
                </label>
                <input
                  type="text"
                  value={formData.awayTeam}
                  onChange={(e) => handleInputChange('awayTeam', e.target.value)}
                  placeholder="Enter away team name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${errors.awayTeam ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.awayTeam && (
                  <p className="mt-1 text-sm text-red-600">{errors.awayTeam}</p>
                )}

                {/* Away Team Logo */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Away Team Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-sky-400 transition-colors relative">
                    {previewUrls.away ? (
                      <div className="relative inline-block">
                        <img
                          src={previewUrls.away}
                          alt="Away team logo preview"
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                        {formData.awayTeamLogo && (
                          <button
                            type="button"
                            onClick={() => removeFile('away')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload new away team logo
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('away', e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {errors.awayTeamLogo && (
                    <p className="mt-1 text-sm text-red-600">{errors.awayTeamLogo}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to keep current logo
                  </p>
                </div>
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Venue *
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                placeholder="Enter match venue"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${errors.venue ? 'border-red-300' : 'border-gray-300'
                  }`}
              />
              {errors.venue && (
                <p className="mt-1 text-sm text-red-600">{errors.venue}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Fixture Status
              </label>

              {/* Status Preview */}
              <div className={`mb-3 p-3 rounded-lg border ${currentStatusConfig.color} flex items-center gap-3`}>
                <currentStatusConfig.icon className="w-5 h-5" />
                <div>
                  <p className="font-medium">{currentStatusConfig.label}</p>
                  <p className="text-sm opacity-75">{currentStatusConfig.description}</p>
                </div>
              </div>

              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as FixtureStatus)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
              >
                {Object.entries(FixtureStatus).map(([key, value]) => {
                  const config = statusConfig[value];
                  return (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  );
                })}
              </select>

              {/* Status Help Text */}
              <div className="mt-2 text-sm text-gray-500">
                {formData.status === FixtureStatus.SCHEDULED && (
                  <p>✓ Fixture will appear in upcoming fixtures</p>
                )}
                {formData.status === FixtureStatus.PLAYING && (
                  <p>✓ Fixture will appear as live/in progress</p>
                )}
                {[
                  FixtureStatus.WON,
                  FixtureStatus.LOST,
                  FixtureStatus.DRAW
                ].includes(formData.status) && (
                    <p>✓ Fixture will appear in completed fixtures with result</p>
                  )}
                {formData.status === FixtureStatus.CANCELLED && (
                  <p>✓ Fixture will be marked as cancelled</p>
                )}
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating Fixture...
                  </>
                ) : (
                  'Update Fixture'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}