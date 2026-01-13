'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  Globe,
  Rss,
  Tag,
  RefreshCw,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { RssFeedSourceCategory } from '@/types/feed.types';
import { API_ROUTES } from '@/config/routes';
import { useGet, useDelete } from '@/hooks/useApiQuery';

// Updated interface matching your Sequelize model exactly
interface RssFeedSource {
  id: number;
  name: string;
  feedUrl: string;
  category: RssFeedSourceCategory;
  createdAt: Date;
  updatedAt: Date;
}

export default function RssFeedDetail() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [feed, setFeed] = useState<RssFeedSource | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // API hooks
  const { data, loading, error, refetch } = useGet<RssFeedSource>(
    id ? API_ROUTES.FEEDS.VIEW(id) : null
  );

  const { handleDelete: deleteRssFeed } = useDelete(
    id ? API_ROUTES.FEEDS.MUTATE(id) : ''
  );

  // Set feed data when loaded
  useEffect(() => {
    if (data) {
      setFeed(data);
    }
  }, [data]);

  const getCategoryInfo = (category: RssFeedSourceCategory) => {
    return category === RssFeedSourceCategory.SPORTS
      ? {
          icon: '⚽',
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          label: 'Sports',
        }
      : {
          icon: '📰',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          label: 'General',
        };
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteConfirm = async () => {
    if (!feed) return;

    setDeleting(true);
    try {
      await deleteRssFeed();
      // Show success message
      alert(`RSS feed source "${feed.name}" deleted successfully!`);
      // Navigate back to list
      router.push('/sports-admin/rss-feeds');
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert('Failed to delete RSS feed source. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-6 h-6 text-sky-600 animate-spin" />
              <span className="text-gray-600">Loading feed details...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Error Loading Feed
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-x-4">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200 inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <Link
                  href="/sports-admin/rss-feeds"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Feeds
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Feed not found
  if (!feed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Rss className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                RSS Feed Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The RSS feed source you&apos;re looking for doesn&apos;t exist or has been
                removed.
              </p>
              <Link
                href="/sports-admin/rss-feeds"
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Feeds
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(feed.category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/sports-admin/rss-feeds"
            className="text-sky-600 hover:text-sky-800 transition-colors flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to RSS Feeds
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-8 text-white">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <Rss className="w-8 h-8 flex-shrink-0" />
                  <h1 className="text-2xl sm:text-3xl font-bold break-words">
                    {feed.name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${categoryInfo.bg} ${categoryInfo.color} ${categoryInfo.border} bg-white/90`}
                  >
                    <span className="text-base leading-none">
                      {categoryInfo.icon}
                    </span>
                    {categoryInfo.label}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <Link
                  href={`/sports-admin/rss-feeds/${feed.id}/edit`}
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold border border-white/20"
                >
                  <Edit className="w-4 h-4" />
                  Edit Feed
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 backdrop-blur-sm text-white rounded-xl hover:bg-red-500/30 transition-all duration-200 font-semibold border border-red-300/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Feed Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-sky-500" />
                    Feed Information
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RSS Feed URL
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-900 break-all flex-1 font-mono bg-white px-3 py-2 rounded border">
                          {feed.feedUrl}
                        </p>
                        <a
                          href={feed.feedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 p-2 text-sky-600 hover:text-sky-800 transition-colors"
                          title="Open feed in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Category
                        </div>
                      </label>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${categoryInfo.bg} ${categoryInfo.color} ${categoryInfo.border}`}
                        >
                          <span className="text-base leading-none">
                            {categoryInfo.icon}
                          </span>
                          {categoryInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sky-500" />
                    Timeline Information
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Created Date
                        </div>
                      </label>
                      <p className="text-sm text-gray-900 font-mono">
                        {formatDate(feed.createdAt)}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4" />
                          Last Updated
                        </div>
                      </label>
                      <p className="text-sm text-gray-900 font-mono">
                        {formatDate(feed.updatedAt)}
                      </p>
                    </div>

                    <div className="bg-sky-50 rounded-lg p-4 border border-sky-200">
                      <label className="block text-sm font-medium text-sky-700 mb-2">
                        Feed ID
                      </label>
                      <p className="text-sm text-sky-900 font-mono">
                        #{feed.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </button>

                <Link
                  href={`/rss-feeds/${feed.id}/edit`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                >
                  <Edit className="w-4 h-4" />
                  Edit Feed Source
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Delete RSS Feed Source
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold">"{feed.name}"</span>?
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    This action cannot be undone and will permanently remove
                    this RSS feed source.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleDeleteConfirm}
                      disabled={deleting}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Delete Feed
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={deleting}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
