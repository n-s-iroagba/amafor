'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Plus,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Rss,
  Globe,
  Tag,
  Save,
  Loader2,
} from 'lucide-react';

import { API_ROUTES } from '@/config/routes';
import { RssFeedSourceCategory } from '@/shared/types';
import { usePost } from '@/shared/hooks/useApiQuery';

// Updated interface to match your Sequelize model exactly
interface RssFeedSource {
  id: number;
  name: string;
  feedUrl: string;
  category: RssFeedSourceCategory;
  createdAt: Date;
  updatedAt: Date;
}

interface ValidationErrors {
  name?: string;
  feedUrl?: string;
  category?: string;
  general?: string;
}

export default function NewRssFeedSource() {
  const router = useRouter();

  // Form state matching the model exactly
  const [name, setName] = useState('');
  const [feedUrl, setFeedUrl] = useState('');
  const [category, setCategory] = useState<RssFeedSourceCategory>(
    RssFeedSourceCategory.GENERAL
  );

  // UI state
  const [errors, setErrors] = useState<ValidationErrors>({});

  const { post, isPending: isSubmitting } = usePost(API_ROUTES.FEEDS.CREATE);

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Feed source name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    } else if (name.trim().length > 255) {
      newErrors.name = 'Name must be less than 255 characters';
    }

    // Feed URL validation
    if (!feedUrl.trim()) {
      newErrors.feedUrl = 'RSS Feed URL is required';
    } else {
      try {
        const url = new URL(feedUrl.trim());
        if (!['http:', 'https:'].includes(url.protocol)) {
          newErrors.feedUrl = 'URL must use HTTP or HTTPS protocol';
        }
      } catch {
        newErrors.feedUrl = 'Please enter a valid URL';
      }
    }

    // Category validation (though it's selected from dropdown)
    if (!Object.values(RssFeedSourceCategory).includes(category)) {
      newErrors.category = 'Please select a valid category';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await post({
        name: name.trim(),
        feedUrl: feedUrl.trim(),
        category,
      });

      alert(`RSS feed source "${name}" created successfully!`);
      router.push('/dashboard/admin/rss-feeds');
    } catch (error: any) {
      console.error('Error creating RSS feed source:', error);
      setErrors({
        general: 'Network error. Please check your connection and try again.',
      });
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    // Clear field-specific error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Update field value
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'feedUrl':
        setFeedUrl(value);
        break;
    }
  };
  const getCategoryInfo = (cat: RssFeedSourceCategory) => {
    switch (cat) {
      case RssFeedSourceCategory.SPORTS:
        return {
          icon: '⚽',
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          gradientFrom: 'from-orange-500',
          gradientTo: 'to-orange-600',
          hoverColor: 'hover:text-orange-600',
          focusRing: 'focus:ring-orange-400',
          decorationColor: 'decoration-orange-500',
          clockColor: 'text-orange-500',
          bgColor: 'bg-orange-500',
        };

      case RssFeedSourceCategory.GENERAL:
        return {
          icon: '📰',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          gradientFrom: 'from-blue-500',
          gradientTo: 'to-blue-600',
          hoverColor: 'hover:text-blue-600',
          focusRing: 'focus:ring-blue-400',
          decorationColor: 'decoration-blue-500',
          clockColor: 'text-blue-500',
          bgColor: 'bg-blue-500',
        };

      // case RssFeedSourceCategory.BUSINESS:
      //   return {
      //     icon: '💼',
      //     color: 'text-green-600',
      //     bg: 'bg-green-50',
      //     border: 'border-green-200',
      //     gradientFrom: 'from-green-500',
      //     gradientTo: 'to-green-600',
      //     hoverColor: 'hover:text-green-600',
      //     focusRing: 'focus:ring-green-400',
      //     decorationColor: 'decoration-green-500',
      //     clockColor: 'text-green-500',
      //     bgColor: 'bg-green-500',
      //   };

      // case RssFeedSourceCategory.:
      //   return {
      //     icon: '🎬',
      //     color: 'text-purple-600',
      //     bg: 'bg-purple-50',
      //     border: 'border-purple-200',
      //     gradientFrom: 'from-purple-500',
      //     gradientTo: 'to-purple-600',
      //     hoverColor: 'hover:text-purple-600',
      //     focusRing: 'focus:ring-purple-400',
      //     decorationColor: 'decoration-purple-500',
      //     clockColor: 'text-purple-500',
      //     bgColor: 'bg-purple-500',
      //   };

      // case RssFeedSourceCategory.NIGERIA:
      //   return {
      //     icon: '🇳🇬',
      //     color: 'text-green-600',
      //     bg: 'bg-green-50',
      //     border: 'border-green-200',
      //     gradientFrom: 'from-green-500',
      //     gradientTo: 'to-green-600',
      //     hoverColor: 'hover:text-green-600',
      //     focusRing: 'focus:ring-green-400',
      //     decorationColor: 'decoration-green-500',
      //     clockColor: 'text-green-500',
      //     bgColor: 'bg-green-500',
      //   };



      default:
        return {
          icon: '📰',
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          gradientFrom: 'from-gray-500',
          gradientTo: 'to-gray-600',
          hoverColor: 'hover:text-gray-600',
          focusRing: 'focus:ring-gray-400',
          decorationColor: 'decoration-gray-500',
          clockColor: 'text-gray-500',
          bgColor: 'bg-gray-500',
        };
    }
  };
  const selectedCategoryInfo = getCategoryInfo(category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Rss className="w-8 h-8" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Add RSS Feed Source
                </h1>
                <p className="text-sky-100 text-sm sm:text-base mt-1">
                  Create a new RSS feed source for content aggregation
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* General Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-800 font-medium">Error</h4>
                  <p className="text-red-700 text-sm mt-1">{errors.general}</p>
                </div>
              </motion.div>
            )}

            {/* Feed Source Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-sky-500" />
                  Feed Source Name <span className="text-red-500">*</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${errors.name
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                  placeholder="Enter a descriptive name for this RSS feed source"
                  maxLength={255}
                />
                <div className="absolute right-3 top-3 text-xs text-gray-400">
                  {name.length}/255
                </div>
              </div>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </motion.p>
              )}
              <p className="text-gray-500 text-xs">
                Choose a memorable name to identify this RSS feed source
              </p>
            </div>

            {/* RSS Feed URL */}
            <div className="space-y-2">
              <label
                htmlFor="feedUrl"
                className="block text-sm font-semibold text-gray-700"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-500" />
                  RSS Feed URL <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="url"
                id="feedUrl"
                value={feedUrl}
                onChange={(e) => handleFieldChange('feedUrl', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${errors.feedUrl
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
                placeholder="https://example.com/rss.xml"
              />
              {errors.feedUrl && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.feedUrl}
                </motion.p>
              )}
              <p className="text-gray-500 text-xs">
                The complete URL to the RSS/XML feed (e.g.,
                https://example.com/feed.xml)
              </p>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-gray-700"
              >
                Content Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(RssFeedSourceCategory).map((cat) => {
                  const categoryInfo = getCategoryInfo(cat);
                  const isSelected = category === cat;

                  return (
                    <motion.button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-sm ${isSelected
                        ? `${categoryInfo.border} ${categoryInfo.bg} shadow-sm`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{categoryInfo.icon}</span>
                        <div>
                          <h3
                            className={`font-semibold ${isSelected ? categoryInfo.color : 'text-gray-900'}`}
                          >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {cat === RssFeedSourceCategory.SPORTS
                              ? 'Sports news, scores, and updates'
                              : 'General news and articles'}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2
                          className={`absolute top-3 right-3 w-5 h-5 ${categoryInfo.color}`}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              {errors.category && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </motion.p>
              )}
            </div>

            {/* Preview Section */}
            {name && feedUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gradient-to-r from-sky-50 to-sky-100 rounded-xl p-4 border border-sky-200"
              >
                <h4 className="text-sm font-semibold text-sky-800 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Preview
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedCategoryInfo.icon}</span>
                    <span className="font-medium text-gray-900">{name}</span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${selectedCategoryInfo.bg} ${selectedCategoryInfo.color} border ${selectedCategoryInfo.border}`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{feedUrl}</p>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold text-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create RSS Source</span>
                  </>
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Rss className="w-5 h-5 text-sky-500" />
            How to find RSS feed URLs
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-xs font-semibold">
                1
              </div>
              <p>Look for RSS icons (📡) or "RSS" links on websites</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-xs font-semibold">
                2
              </div>
              <p>Check common paths like "/feed", "/rss", "/atom.xml"</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-xs font-semibold">
                3
              </div>
              <p>
                Use browser extensions or online tools to discover RSS feeds
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
