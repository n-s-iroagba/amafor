// app/players/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDelete, useGet } from '@/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import Image from 'next/image';

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

export default function PlayersList() {
  const router = useRouter();
  const {data:players, loading:isLoading} = useGet<Player[]>(API_ROUTES.PLAYERS.LIST)
 const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const  {handleDelete} = useDelete(API_ROUTES.PLAYERS.MUTATE(deleteConfirm))

  



  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Goalkeeper':
        return 'bg-yellow-100 text-yellow-800';
      case 'Defender':
        return 'bg-blue-100 text-blue-800';
      case 'Midfielder':
        return 'bg-green-100 text-green-800';
      case 'Forward':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700">Loading players...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-sky-800">
            Players
          </h1>
          <Link
            href="/sports-admin/players/new"
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors text-sm sm:text-base whitespace-nowrap w-full sm:w-auto text-center"
          >
            Add New Player
          </Link>
        </div>

        {players?.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-6 sm:p-8 text-center">
            <svg
              className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-sky-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <h3 className="mt-3 sm:mt-4 text-lg font-medium text-sky-800">
              No players yet
            </h3>
            <p className="mt-1 sm:mt-2 text-sky-600 text-sm sm:text-base">
              Get started by adding your first player
            </p>
            <div className="mt-4 sm:mt-6">
              <Link
                href="/sports-admin/players/new"
                className="inline-flex items-center justify-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                New Player
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-200">
                <thead className="bg-sky-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider"
                    >
                      Player
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider"
                    >
                      Position
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider hidden sm:table-cell"
                    >
                      Jersey
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider hidden md:table-cell"
                    >
                      Nationality
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider hidden lg:table-cell"
                    >
                      Added
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-sky-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-sky-200">
                  {players?.map((player) => (
                    <tr
                      key={player.id}
                      className="hover:bg-sky-50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center">
                          {player.imageUrl && (
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3">
                              <Image
                                height={50}
                                width={50}
                                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                                src={player.imageUrl}
                                alt={player.name}
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-sky-900 truncate">
                              {player.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPositionColor(player.position)}`}
                        >
                          {player.position}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                        <span className="text-sm text-sky-600">
                          #{player.jerseyNumber}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-sky-600">
                          {player.nationality || '-'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                        <div className="text-xs sm:text-sm text-sky-500">
                          {new Date(player.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2 sm:space-x-3">
                          <Link
                            href={`/sports-admin/players/${player.id}`}
                            className="text-sky-600 hover:text-sky-900 transition-colors text-xs sm:text-sm"
                            title="View"
                          >
                            <span className="sr-only sm:not-sr-only">View</span>
                            <svg
                              className="w-4 h-4 sm:hidden"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </Link>
                          <Link
                            href={`/sports-admin/players/${player.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors text-xs sm:text-sm"
                            title="Edit"
                          >
                            <span className="sr-only sm:not-sr-only">Edit</span>
                            <svg
                              className="w-4 h-4 sm:hidden"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(player.id)}
                            className="text-red-600 hover:text-red-900 transition-colors text-xs sm:text-sm"
                            title="Delete"
                          >
                            <span className="sr-only sm:not-sr-only">
                              Delete
                            </span>
                            <svg
                              className="w-4 h-4 sm:hidden"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>

                        {deleteConfirm === player.id && (
                          <div className="fixed sm:absolute inset-0 sm:inset-auto sm:mt-2 sm:right-4 sm:left-4 bg-white p-4 rounded-md shadow-lg border border-red-200 z-50 sm:z-10 m-4 sm:m-0">
                            <p className="text-sm text-sky-800 mb-2">
                              Are you sure you want to delete this player?
                            </p>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-1 text-sm bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {handleDelete()
                                  window.location.reload()
                                }}
                                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
