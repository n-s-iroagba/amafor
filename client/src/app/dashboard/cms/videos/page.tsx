// app/videos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDelete, useGet } from '@/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import Image from 'next/image';

interface Video {
  id: number;
  title: string;
  excerpt: string;
  thumbnail: string;
  videoUrl: string;
  duration?: number;
  createdAt: string;
}
interface PaginatedData<T> {
  data: T;
  pagination: any;
}
export default function VideosList() {
  const router = useRouter();

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const { data, loading, error } = useGet<PaginatedData<Video[]>>(
    API_ROUTES.VIDEOS.LIST
  );
  const { handleDelete } = useDelete(API_ROUTES.VIDEOS.MUTATE(deleteConfirm));

  const videos = data?.data;
  


  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDeleteClick = async (videoId: number) => {
    try {
      await handleDelete();
      setDeleteConfirm(null);
      // The useEffect will handle the refresh
    } catch (error) {
      console.error('Failed to delete video:', error);
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-sky-800">
            Videos
          </h1>
          <Link
            href="/sports-admin/videos/new"
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors text-sm sm:text-base whitespace-nowrap w-full sm:w-auto text-center"
          >
            Add New Video
          </Link>
        </div>

        {videos?.length === 0 ? (
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
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-3 sm:mt-4 text-lg font-medium text-sky-800">
              No videos yet
            </h3>
            <p className="mt-1 sm:mt-2 text-sky-600 text-sm sm:text-base">
              Get started by adding your first video
            </p>
            <div className="mt-4 sm:mt-6">
              <Link
                href="/sports-admin/videos/new"
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
                New Video
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
                      Video
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider hidden md:table-cell"
                    >
                      Duration
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider hidden lg:table-cell"
                    >
                      Excerpt
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-sky-500 uppercase tracking-wider hidden xl:table-cell"
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
                  {videos?.map((video) => (
                    <tr
                      key={video.id}
                      className="hover:bg-sky-50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex-shrink-0 h-16 w-24 relative">
                          <Image
                            unoptimized
                            src={video.thumbnail}
                            alt={video.title}
                            width={96}
                            height={64}
                            className="h-16 w-24 object-cover rounded"
                          />
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-sky-900 truncate max-w-xs">
                            {video.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-sky-600">
                          {formatDuration(video.duration)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                        <div className="text-sm text-sky-900 truncate max-w-xs">
                          {video.excerpt}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden xl:table-cell">
                        <div className="text-xs sm:text-sm text-sky-500">
                          {formatDate(video.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2 sm:space-x-3">
                          <Link
                            href={`${video.videoUrl}`}
                            target="_blank"
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
                            href={`/sports-admin/videos/${video.id}/edit`}
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
                            onClick={() => setDeleteConfirm(video.id)}
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

                        {deleteConfirm === video.id && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 sm:absolute sm:inset-auto sm:mt-2 sm:right-4 sm:left-4 sm:bg-white sm:p-4 sm:rounded-md sm:shadow-lg sm:border sm:border-red-200 sm:z-10 m-0">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm sm:max-w-none sm:w-auto">
                              <p className="text-sm text-sky-800 mb-4 text-center sm:text-left">
                                Are you sure you want to delete this video?
                              </p>
                              <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-4 py-2 text-sm bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(video.id)}
                                  className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
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