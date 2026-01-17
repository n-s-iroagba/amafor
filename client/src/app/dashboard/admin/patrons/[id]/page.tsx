'use client';

import { API_ROUTES } from '@/config/routes';
import { useGet } from '@/shared/hooks/useApiQuery';

import Image from 'next/image';
import { useParams } from 'next/navigation';

interface Patron {
  id: number;
  name: string;
  position: string;
  imageUrl?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function PatronDetailsPage() {
  const { id } = useParams();
  const {
    data: patron,
    loading,
    error,
  } = useGet<Patron>(API_ROUTES.PATRONS.DETAIL(Number(id)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-t-2 border-b-2 border-sky-500 rounded-full animate-spin"></div>
            <p className="text-sky-700 font-medium">
              Loading patron details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !patron) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
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
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Patron Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested patron could not be loaded.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sky-800 mb-2">
            Patron Details
          </h1>
          <p className="text-sky-600">Learn more about our valued patron</p>
        </div>

        {/* Patron Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-sky-100">
          <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                  {patron.imageUrl ? (
                    <Image
                      src={patron.imageUrl}
                      alt={patron.name}
                      width={128}
                      height={128}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-sky-100 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-sky-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                  <svg
                    className="w-5 h-5 text-sky-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
              </div>

              {/* Basic Info */}
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {patron.name}
                </h2>
                <p className="text-sky-100 text-lg font-medium mb-4">
                  {patron.position}
                </p>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                  <span className="text-white text-sm">
                    Patron ID: #{patron.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Biography
              </h3>
              {patron.bio ? (
                <div className="bg-sky-50 rounded-xl p-6 border border-sky-200">
                  <p className="text-gray-700 leading-relaxed">{patron.bio}</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                  <svg
                    className="w-8 h-8 text-gray-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-gray-500">No biography available</p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patron.createdAt && (
                <div>
                  <h4 className="text-sm font-medium text-sky-700 mb-2">
                    Member Since
                  </h4>
                  <div className="bg-white border border-sky-200 rounded-lg p-4">
                    <p className="text-gray-700">
                      {new Date(patron.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}

              {patron.updatedAt && (
                <div>
                  <h4 className="text-sm font-medium text-sky-700 mb-2">
                    Last Updated
                  </h4>
                  <div className="bg-white border border-sky-200 rounded-lg p-4">
                    <p className="text-gray-700">
                      {new Date(patron.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-sky-50 px-8 py-4 border-t border-sky-100">
            <div className="flex items-center justify-center gap-2 text-sm text-sky-700">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Patron information is securely stored and protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
