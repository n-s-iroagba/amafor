// app/videos/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/apiUtils';


interface Video {
  id: number;
  title: string;
  excerpt: string;
  thumbnail: string;
  videoUrl: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export default function VideoDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVideo();
    }
  }, [id]);

  const fetchVideo = async () => {
    try {
      const response = await api.get(`/videos/${id}`);
     
        const data = await response.data;
        setVideo(data);
  
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/videos/${id}`)

   
        router.push('/sports-admin/videos');
     
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700">Loading video details...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700">Video not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <Link
            href="/videos"
            className="text-sky-600 hover:text-sky-800 transition-colors flex items-center text-sm sm:text-base"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to videos
          </Link>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-sky-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
                  {video.title}
                </h2>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-800">
                    {formatDuration(video.duration)}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/videos/${video.id}/edit`}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <div className="aspect-w-16 aspect-h-9 bg-sky-100 rounded-lg overflow-hidden">
                <video
                  controls
                  className="w-full h-64 sm:h-96 object-contain"
                  poster={video.thumbnail}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-sky-800 mb-2">
                  Description
                </h3>
                <p className="text-sm text-sky-900 leading-relaxed">
                  {video.excerpt}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-sky-800 mb-2">
                    Video Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-sky-700">Duration</span>
                      <span className="text-sm font-semibold text-sky-900">
                        {formatDuration(video.duration)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-sky-700">Video URL</span>
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-sky-600 hover:text-sky-800 truncate max-w-xs"
                      >
                        View Source
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-sky-800 mb-2">
                    Thumbnail
                  </h4>
                  <div className="border border-sky-200 rounded-lg p-2">
                    <Image
                    unoptimized
                    height={50}
                    width={50}
                     
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-24 object-contain rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-sky-200">
            <h3 className="text-lg font-medium text-sky-800 mb-4">Timeline</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sky-700">
                  Created
                </label>
                <p className="mt-1 text-sm text-sky-900">
                  {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-sky-700">
                  Last Updated
                </label>
                <p className="mt-1 text-sm text-sky-900">
                  {new Date(video.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-sky-800 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-sky-600 mb-4">
                Are you sure you want to delete this video? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-sky-100 text-sky-700 rounded-md hover:bg-sky-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
