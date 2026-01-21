'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Globe,
  Rss,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';

import { API_ROUTES } from '@/config/routes';
import { useGet, useDelete } from '@/shared/hooks/useApiQuery';
import { RssFeedSourceCategory } from '@/shared/types';

// Updated to match your Sequelize model exactly


interface RssFeedSource {
  id: number;
  name: string;
  feedUrl: string;
  category: RssFeedSourceCategory;
  createdAt: Date;
  updatedAt: Date;
}

type FeedResponse = {
  data: RssFeedSource[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
};

export default function RssFeedList() {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<
    RssFeedSourceCategory | 'all'
  >('all');
  const [deleting, setDeleting] = useState(false);

  // Build query parameters
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: '10',
    ...(searchQuery && { search: searchQuery }),
    ...(categoryFilter !== 'all' && { category: categoryFilter }),
  });

  const { data, loading, error, refetch } = useGet<FeedResponse>(
    `${API_ROUTES.FEEDS.LIST}?${queryParams.toString()}`
  );

  const { delete: deleteFeed, isPending: feedDeleteLoading } = useDelete(
    API_ROUTES.FEEDS.MUTATE
  );

  const feeds = data?.data || [];
  const totalPages = data?.totalPages || 0;
  const totalItems = data?.totalItems || 0;
  const currentPage = data?.currentPage || 1;

  // Handle search and filter changes
  useEffect(() => {
    setPage(1); // Reset to first page when search/filter changes
  }, [searchQuery, categoryFilter]);

  const getCategoryColor = (category: RssFeedSourceCategory) => {
    return category === RssFeedSourceCategory.SPORTS
      ? 'bg-orange-100 text-orange-800 border-orange-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getCategoryIcon = (category: RssFeedSourceCategory) => {
    return category === RssFeedSourceCategory.SPORTS ? '⚽' : '📰';
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    try {
      await deleteFeed(deleteConfirm);
      setDeleteConfirm(null);
      refetch();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="w-6 h-6 text-sky-600 animate-spin" />
              <span className="text-gray-600">Loading RSS feeds...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <Rss className="w-8 h-8 text-sky-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-sky-800">
                RSS Feed Sources
              </h1>
              <p className="text-sky-600 text-sm">
                Manage your RSS feed sources • {totalItems} total feeds
              </p>
            </div>
          </div>
          <Link
            href="/sports-admin/rss-feeds/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add New Source
          </Link>
        </motion.div>

        {/* BRD Requirement: DEV-15 RSS Feeds Documentation */}
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r shadow-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-yellow-800">Feature Status: Pending Full Approval</h4>
            <p className="text-sm text-yellow-700 mt-1">
              External RSS integration is currently limited to <strong>5 sources</strong> per BR-CMS-04.
              Full aggregation requires Legal + Compliance sign-off on copyright adherence.
            </p>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search feeds by name or URL..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value as RssFeedSourceCategory | 'all'
                  )
                }
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="all">All Categories</option>
                <option value={RssFeedSourceCategory.SPORTS}>Sports</option>
                <option value={RssFeedSourceCategory.GENERAL}>General</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-red-800 font-medium">
                  Error Loading Feeds
                </h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <button
                  onClick={() => refetch()}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {feeds.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
            >
              <Rss className="mx-auto h-16 w-16 text-sky-400 mb-4" />
              <h3 className="text-xl font-semibold text-sky-800 mb-2">
                {searchQuery || categoryFilter !== 'all'
                  ? 'No matching feeds found'
                  : 'No RSS feed sources yet'}
              </h3>
              <p className="text-sky-600 mb-6 max-w-md mx-auto">
                {searchQuery || categoryFilter !== 'all'
                  ? 'Try adjusting your search terms or filters'
                  : 'Get started by adding your first RSS feed source to aggregate content'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/sports-admin/rss-feeds/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add New Feed Source
                </Link>
                {(searchQuery || categoryFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Mobile Cards View */}
              <div className="block sm:hidden">
                <div className="divide-y divide-gray-200">
                  {feeds.map((feed, index) => (
                    <motion.div
                      key={feed.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-gray-50 transition-colors relative"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {getCategoryIcon(feed.category)} {feed.name}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {feed.feedUrl}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(feed.category)}`}
                        >
                          {feed.category.charAt(0).toUpperCase() +
                            feed.category.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Created {formatDate(feed.createdAt)}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Link
                          href={`/sports-admin/rss-feeds/${feed.id}`}
                          className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        <Link
                          href={`/sports-admin/rss-feeds/${feed.id}/edit`}
                          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(feed.id)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-sky-50 to-sky-100">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider"
                      >
                        Feed Source
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider"
                      >
                        Created
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider"
                      >
                        Updated
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-right text-xs font-semibold text-sky-700 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {feeds.map((feed, index) => (
                      <motion.tr
                        key={feed.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <Globe className="w-5 h-5 text-sky-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-gray-900 group-hover:text-sky-700 transition-colors">
                                {feed.name}
                              </div>
                              <div
                                className="text-sm text-gray-500 truncate max-w-sm"
                                title={feed.feedUrl}
                              >
                                {feed.feedUrl}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(feed.category)}`}
                          >
                            <span className="text-base leading-none">
                              {getCategoryIcon(feed.category)}
                            </span>
                            {feed.category.charAt(0).toUpperCase() +
                              feed.category.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(feed.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <RefreshCw className="w-4 h-4" />
                            {formatDate(feed.updatedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center space-x-3 relative">
                            <Link
                              href={`/sports-admin/rss-feeds/${feed.id}`}
                              className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 transition-colors font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Link>
                            <Link
                              href={`/sports-admin/rss-feeds/${feed.id}/edit`}
                              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() => setDeleteConfirm(feed.id)}
                              className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors font-medium"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4"
          >
            <div className="text-sm text-gray-700">
              Showing page <span className="font-semibold">{currentPage}</span>{' '}
              of <span className="font-semibold">{totalPages}</span> (
              {totalItems} total feeds)
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${page === pageNum
                        ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
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
                    <p className="text-gray-600 mb-6">
                      Are you sure you want to delete this RSS feed source? This
                      action cannot be undone.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleDeleteConfirm}
                        disabled={deleting || feedDeleteLoading}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                      >
                        {deleting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
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
    </div>
  );
}
