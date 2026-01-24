'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGet, usePost } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

import Image from 'next/image'
import { Calendar, MapPin, Users, Upload, X, Loader2, Trophy, Clock, Ban, Play, Calendar as CalendarIcon } from 'lucide-react';
import React from 'react';
import { uploadFile } from '@/shared/utils';

enum FixtureStatus {
  WON = 'won',
  LOST = 'lost',
  DRAW = 'draw',
  PLAYING = 'playing',
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
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
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  venue?: string;
  sameTeam?: string;
  submit?: string;
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
 * Page: New Fixture
 * Description: Form to schedule a new match fixture.
 * Requirements: REQ-ADM-08 (Fixture Management)
 * User Story: US-ADM-009 (Schedule Fixture)
 * User Journey: UJ-ADM-005 (Competition Setup)
 * API: POST /fixtures (API_ROUTES.FIXTURES.CREATE)
 */
export default function NewFixture() {
  const router = useRouter();
  const params = useParams();
  const leagueId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    leagueId: leagueId || '',
    date: '',
    homeTeam: '',
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

  const { data: leagues, loading: isLoading } = useGet<League[]>(
    `${API_ROUTES.LEAGUES.LIST}/all`
  );

  const { post, isPending: isSubmitting } = usePost(
    API_ROUTES.FIXTURES.CREATE(formData.leagueId)
  );

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (field === 'homeTeam' || field === 'awayTeam') {
      if (errors.sameTeam) {
        setErrors(prev => ({ ...prev, sameTeam: undefined }));
      }
    }
  };

  const handleFileChange = (team: 'home' | 'away', file: File | null) => {
    const field = team === 'home' ? 'homeTeamLogo' : 'awayTeamLogo';
    handleInputChange(field, file);

    // Create preview URL
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({ ...prev, [team]: url }));
    } else {
      setPreviewUrls(prev => ({ ...prev, [team]: null }));
    }

    // Clear file error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const removeFile = (team: 'home' | 'away') => {
    handleFileChange(team, null);
    if (team === 'home') {
      URL.revokeObjectURL(previewUrls.home || '');
    } else {
      URL.revokeObjectURL(previewUrls.away || '');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.leagueId) newErrors.leagueId = 'Please select a league';
    if (!formData.date) newErrors.date = 'Fixture date and time is required';
    if (!formData.homeTeam.trim()) newErrors.homeTeam = 'Home team name is required';
    if (!formData.awayTeam.trim()) newErrors.awayTeam = 'Away team name is required';
    if (!formData.homeTeamLogo) newErrors.homeTeamLogo = 'Home team logo is required';
    if (!formData.awayTeamLogo) newErrors.awayTeamLogo = 'Away team logo is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';

    if (formData.homeTeam.trim() && formData.awayTeam.trim() &&
      formData.homeTeam.toLowerCase() === formData.awayTeam.toLowerCase()) {
      newErrors.sameTeam = 'Home and away teams cannot be the same';
    }

    // Validate file types
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUploading(true);
    setErrors(prev => ({ ...prev, submit: undefined }));

    try {
      // Upload logos in parallel
      const [homeLogoUrl, awayLogoUrl] = await Promise.all([
        uploadFile(formData.homeTeamLogo!, 'image'),
        uploadFile(formData.awayTeamLogo!, 'image')
      ]);

      await post({
        leagueId: parseInt(formData.leagueId),
        date: formData.date,
        homeTeam: formData.homeTeam.trim(),
        awayTeam: formData.awayTeam.trim(),
        homeTeamLogo: homeLogoUrl,
        awayTeamLogo: awayLogoUrl,
        venue: formData.venue.trim(),
        status: formData.status,
      });

      router.push(`/dashboard/admin/leagues/${formData.leagueId}/fixtures`);
    } catch (error: any) {
      console.error('Error creating fixture:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || 'Failed to create fixture. Please try again.'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up preview URLs on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrls.home) URL.revokeObjectURL(previewUrls.home);
      if (previewUrls.away) URL.revokeObjectURL(previewUrls.away);
    };
  }, [previewUrls.home, previewUrls.away]);

  // Get current status configuration
  const currentStatusConfig = statusConfig[formData.status];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-4" />
          <p className="text-sky-700 font-medium">Loading leagues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Fixture
          </h1>
          <p className="text-gray-600">
            Add a new match fixture to the schedule
          </p>
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

                {/* Home Team Logo Upload */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Team Logo *
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-sky-400 transition-colors">
                    {previewUrls.home ? (
                      <div className="relative inline-block">
                        <Image
                          unoptimized
                          height={50}
                          width={50}
                          src={previewUrls.home}
                          alt="Home team logo preview"
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('home')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload home team logo
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('home', e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                  {errors.homeTeamLogo && (
                    <p className="mt-1 text-sm text-red-600">{errors.homeTeamLogo}</p>
                  )}
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

                {/* Away Team Logo Upload */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Away Team Logo *
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-sky-400 transition-colors">
                    {previewUrls.away ? (
                      <div className="relative inline-block">
                        <Image
                          unoptimized
                          height={50}
                          width={50}
                          src={previewUrls.away}
                          alt="Away team logo preview"
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('away')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload away team logo
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('away', e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                  {errors.awayTeamLogo && (
                    <p className="mt-1 text-sm text-red-600">{errors.awayTeamLogo}</p>
                  )}
                </div>
              </div>
            </div>

            {errors.sameTeam && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{errors.sameTeam}</p>
              </div>
            )}

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
                    Creating Fixture...
                  </>
                ) : (
                  'Create Fixture'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}