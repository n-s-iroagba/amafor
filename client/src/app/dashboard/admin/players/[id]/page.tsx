// app/dashboard/admin/players/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useGet, useDelete } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Player {
  id: number;
  name: string;
  position: string;
  jerseyNumber: number;
  imageUrl?: string;
  bio?: string;
  dateOfBirth?: string;
  nationality?: string;
  createdAt: string;
}


/**
 * Page: Player Details
 * Description: Admin view of a player's profile, including bio and system metadata.
 * Requirements: REQ-ADM-02 (Player Management)
 * User Story: US-ADM-002 (View Player)
 * User Journey: UJ-ADM-006 (Team Management)
 * API: GET /players/:id (API_ROUTES.PLAYERS.VIEW)
 * Hook: useGet(API_ROUTES.PLAYERS.VIEW)
 */
const PlayerDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const playerId = params.id as string;
  const [deleteError, setDeleteError] = useState('');

  const { data: player, loading, error } = useGet<Player>(
    API_ROUTES.PLAYERS.VIEW(playerId)
  );

  const { delete: deletePlayer, isPending: deleting } = useDelete(
    API_ROUTES.PLAYERS.DELETE
  );

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this player? This action cannot be undone.')) {
      try {
        await deletePlayer(playerId);
        router.push('/dashboard/admin/players');
      } catch (err) {
        setDeleteError('Failed to delete player');
        console.error('Delete failed:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Player Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested player could not be found.'}</p>
          <Link
            href="/dashboard/admin/players"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Players
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with actions */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Link
              href="/dashboard/admin/players"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-2"
            >
              ← Back to Players
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Player Details</h1>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/admin/players/${playerId}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Player
            </Link>
            <button
              onClick={handleDeleteClick}
              disabled={deleting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {deleting ? 'Deleting...' : 'Delete Player'}
            </button>
          </div>
        </div>

        {/* Error message */}
        {deleteError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error deleting player</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{deleteError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Player details card */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Player information and details
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              ID: {player.id}
            </div>
          </div>

          <div className="border-t border-gray-200">
            <dl>
              {/* Profile section with image */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Profile</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex items-center space-x-4">
                    {player.imageUrl ? (
                      <Image
                        height={50}
                        width={50}
                        unoptimized
                        className="h-24 w-24 rounded-full object-cover"
                        src={player.imageUrl}
                        alt={player.name}
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-lg font-medium">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{player.name}</h3>
                      <p className="text-gray-600">{player.position}</p>
                    </div>
                  </div>
                </dd>
              </div>

              {/* Basic information */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Jersey Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-semibold">
                    {player.jerseyNumber}
                  </span>
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Position</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {player.position}
                </dd>
              </div>

              {/* Personal information */}
              {player.dateOfBirth && (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDate(player.dateOfBirth)}
                    {player.dateOfBirth && ` (${calculateAge(player.dateOfBirth)} years old)`}
                  </dd>
                </div>
              )}

              {player.nationality && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Nationality</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {player.nationality}
                  </dd>
                </div>
              )}

              {/* Bio */}
              {player.bio && (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Bio</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                    {player.bio}
                  </dd>
                </div>
              )}

              {/* System information */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(player.createdAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Quick actions footer */}
        <div className="mt-6 flex justify-end space-x-3">
          <Link
            href={`/dashboard/admin/players/${playerId}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Player
          </Link>
          <button
            onClick={handleDeleteClick}
            disabled={deleting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? 'Deleting...' : 'Delete Player'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailsPage;