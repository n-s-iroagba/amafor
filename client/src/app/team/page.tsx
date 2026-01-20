'use client';
import { API_ROUTES } from '@/config/routes';

import { useState } from 'react';
import Image from 'next/image';
import { Coach } from '@/features/coach/types';
import { Player } from '@/features/player/types';
import { useGet } from '@/shared/hooks/useApiQuery';




export default function TeamSquad() {
  const [selectedTab, setSelectedTab] = useState<'coaches' | 'players'>(
    'players'
  );
  const [selectedMember, setSelectedMember] = useState<Player | Coach | null>(
    null
  );

  // Destructure loading and error states from the hook
  const {
    data: coaches,
    loading: coachesLoading,
    error: coachesError,
  } = useGet<Coach[]>(API_ROUTES.COACHES.LIST);

  const {
    data: players,
    loading: playersLoading,
    error: playersError,
  } = useGet<Player[]>(API_ROUTES.PLAYERS.LIST);

  const calculateAge = (birthDate: Date | string) => {
    const today = new Date();
    const dob = new Date(birthDate);
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dob.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case 'goalkeeper':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'defender':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'midfielder':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'forward':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Loading state
  if (playersLoading || coachesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-sky-600 text-lg">Loading team data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (playersError || coachesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">
            {playersError || coachesError || 'Failed to load team data'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Ensure players and coaches are arrays (fallback to empty arrays if undefined)
  const playersData = players ?? [];
  const coachesData = coaches || [];

  const PlayerCard = ({ player }: { player: Player }) => (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden border border-sky-100"
      onClick={() => setSelectedMember(player)}
    >
      <div className="relative">
        <div className="w-full h-64 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center overflow-hidden">
          {player.imageUrl ? (
            <Image
              height={50}
              width={50}
              src={player.imageUrl}
              alt={player.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-sky-400">
              <svg
                className="w-20 h-20"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 bg-sky-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
          {player.jerseyNumber}
        </div>
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPositionColor(player.position)}`}
          >
            {player.position}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-lg text-sky-800 mb-2 truncate">
          {player.name}
        </h3>
        <div className="flex items-center justify-between text-sm text-sky-600">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {player.nationality || 'Unknown'}
          </div>
          {player.dateOfBirth && (
            <span className="text-sky-500">
              Age {calculateAge(player.dateOfBirth)}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const CoachCard = ({ coach }: { coach: Coach }) => (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden border border-sky-100"
      onClick={() => setSelectedMember(coach)}
    >
      <div className="w-full h-64 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center overflow-hidden">
        {coach.imageUrl ? (
          <Image
            src={coach.imageUrl}
            alt={coach.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-sky-400">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-bold text-lg text-sky-800 mb-2 truncate">
          {coach.name}
        </h3>
        <div className="flex items-center text-sm">
          <div className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-medium border border-sky-200">
            {coach.role}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sky-800 mb-4 break-words">
              Our Team
            </h1>
            <p className="text-lg sm:text-xl text-sky-600 max-w-3xl mx-auto leading-relaxed break-words">
              Meet the talented individuals who make up our incredible team,
              from our skilled coaching staff to our dedicated players.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="bg-white rounded-full p-1 shadow-md border border-sky-200 w-full max-w-md">
              <div className="flex w-full">
                <button
                  onClick={() => setSelectedTab('players')}
                  className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${selectedTab === 'players'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-sky-600 hover:bg-sky-50'
                    }`}
                >
                  Players ({playersData.length})
                </button>
                <button
                  onClick={() => setSelectedTab('coaches')}
                  className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${selectedTab === 'coaches'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-sky-600 hover:bg-sky-50'
                    }`}
                >
                  Coaches ({coachesData.length})
                </button>
              </div>
            </div>
          </div>

          {/* Grid Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 w-full">
            {playersData.length && selectedTab === 'players'
              ? playersData?.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))
              : coachesData.length &&
              coachesData?.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
          </div>

          {/* Empty state */}
          {(selectedTab === 'players' && playersData.length === 0) ||
            (selectedTab === 'coaches' && coachesData.length === 0) ? (
            <div className="text-center py-12">
              <div className="text-sky-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-sky-600 mb-2">
                No {selectedTab} found
              </h3>
              <p className="text-sky-500">
                There are no {selectedTab} to display at the moment.
              </p>
            </div>
          ) : null}

          {/* Team Stats */}
          <div className="mt-12 sm:mt-16 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-sky-200 w-full overflow-x-hidden">
            <h2 className="text-2xl sm:text-3xl font-bold text-sky-800 mb-6 text-center break-words">
              Team Statistics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-sky-600 mb-2">
                  {playersData.length}
                </div>
                <div className="text-sm sm:text-base text-sky-500 font-medium">
                  Total Players
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-sky-600 mb-2">
                  {coachesData.length}
                </div>
                <div className="text-sm sm:text-base text-sky-500 font-medium">
                  Coaching Staff
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-sky-600 mb-2">
                  {playersData.length &&
                    new Set(playersData.map((p) => p.nationality)).size}
                </div>
                <div className="text-sm sm:text-base text-sky-500 font-medium">
                  Nationalities
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-sky-600 mb-2">
                  {playersData.length > 0 &&
                    playersData.filter((p) => p.dateOfBirth).length > 0
                    ? Math.round(
                      playersData.reduce((acc, player) => {
                        if (player.dateOfBirth) {
                          return acc + calculateAge(player.dateOfBirth);
                        }
                        return acc;
                      }, 0) / playersData.filter((p) => p.dateOfBirth).length
                    )
                    : 0}
                </div>
                <div className="text-sm sm:text-base text-sky-500 font-medium">
                  Avg Age
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center overflow-hidden">
                {selectedMember.imageUrl ? (
                  <Image
                    src={selectedMember.imageUrl}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-sky-400">
                    <svg
                      className="w-24 h-24"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Jersey number for players */}
              {'jerseyNumber' in selectedMember && (
                <div className="absolute top-4 right-4 bg-sky-600 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  {selectedMember.jerseyNumber}
                </div>
              )}

              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 left-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
              >
                <svg
                  className="w-6 h-6 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-2xl text-sky-800 mb-4 break-words">
                {selectedMember.name}
              </h3>

              {/* Player specific info */}
              {'position' in selectedMember && (
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getPositionColor(selectedMember.position)}`}
                    >
                      {selectedMember.position}
                    </span>
                    {selectedMember.dateOfBirth && (
                      <span className="text-sky-600">
                        Age {calculateAge(selectedMember.dateOfBirth)}
                      </span>
                    )}
                  </div>
                  {selectedMember.nationality && (
                    <div className="flex items-center text-sky-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      {selectedMember.nationality}
                    </div>
                  )}
                </div>
              )}

              {/* Coach specific info */}
              {'role' in selectedMember && (
                <div className="mb-4">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-medium border border-sky-200">
                    {selectedMember.role}
                  </span>
                </div>
              )}

              {selectedMember.bio && (
                <div className="text-sky-600 leading-relaxed break-words">
                  {selectedMember.bio}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
