'use client'
import React from 'react';
import { notFound, useParams } from 'next/navigation';
import { Shirt, Calendar, MapPin} from 'lucide-react';

import { API_ROUTES } from '@/config/routes';
import { Player } from '@/features/player/types';
import { useGet } from '@/shared/hooks/useApiQuery';



const PlayerPage: React.FC = () => {
  const params = useParams()
  const { id } = params;
  const {
    data: player,
    loading,
    error,
  } = useGet<Player>(API_ROUTES.PLAYERS.VIEW(id as string));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex items-center space-x-6 mb-8">
            <div className="h-32 w-32 bg-gray-200 rounded-full"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !player) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const calculateAge = (dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{player.name}</h1>
        <div className="flex items-center text-gray-600">
          <span className="mr-4">{player.position}</span>
          <span className="flex items-center">
            <Shirt className="h-4 w-4 mr-1" />#{player.jerseyNumber}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            {player.imageUrl ? (
              <img
                src={player.imageUrl}
                alt={player.name}
                className="w-48 h-48 rounded-full mx-auto object-cover mb-6"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Shirt className="h-12 w-12 text-gray-400" />
              </div>
            )}

            <div className="space-y-4">
              {player.dateOfBirth && (
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">Date of Birth</p>
                    <p>{formatDate(player.dateOfBirth)}</p>
                    <p className="text-sm text-gray-500">
                      ({calculateAge(player.dateOfBirth)} years old)
                    </p>
                  </div>
                </div>
              )}

              {player.nationality && (
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">Nationality</p>
                    <p>{player.nationality}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center text-gray-700">
                <Shirt className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="font-medium">Jersey Number</p>
                  <p>#{player.jerseyNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          {player.bio && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Player Bio</h2>
              <p className="text-gray-700 leading-relaxed">{player.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
