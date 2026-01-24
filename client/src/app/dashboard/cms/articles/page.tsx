'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Star,
  Clock,
  TrendingUp,
  Bookmark,
  FileText,
  Eye,
  Edit,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_ROUTES } from '@/config/routes';
import { useGet } from '@/shared/hooks/useApiQuery';
import { cleanText, formatDate } from '@/shared/utils';
import { Article, ArticleStatus, PaginatedData } from '@/shared/types';

type TabType = ArticleStatus | 'all';


/**
 * Page: CMS Article Management
 * Description: Management of sports articles, news, and match reports.
 * Requirements: REQ-CMS-01 (Content Management)
 * User Story: US-CMS-002 (Manage Articles)
 * User Journey: UJ-CMS-001 (Content Publication)
 * API: GET /articles (API_ROUTES.ARTICLES.LIST)
 * Hook: useGet(API_ROUTES.ARTICLES.LIST)
 */
const ArticleList: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const url =
    activeTab === 'all'
      ? API_ROUTES.ARTICLES.LIST // Default list
      : activeTab === ArticleStatus.Draft
        ? API_ROUTES.ARTICLES.UN_PUBLISHED
        : API_ROUTES.ARTICLES.PUBLISHED;

  const { data, loading, error } = useGet<PaginatedData<Article>>(url);
  const articles = data?.data;
  const totalPages = data?.totalPages;

  // Tab configuration
  const tabs = [
    {
      id: 'all' as TabType,
      label: 'All Articles',
      icon: FileText,
      count: articles?.length || 0,
    },
    {
      id: ArticleStatus.Draft,
      label: 'Drafts',
      icon: Edit,
      count:
        articles?.filter((a) => a.status === ArticleStatus.Draft).length || 0,
    },
    {
      id: ArticleStatus.Published,
      label: 'Published',
      icon: Eye,
      count:
        articles?.filter((a) => a.status === ArticleStatus.Published).length ||
        0,
    },
  ];



  const handleArticleClick = (id: number | string) => {
    router.push(`/dashboard/cms/articles/${id}`);
  };

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    setPage(1); // Reset to first page when changing tabs
  };

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 text-center sm:text-left"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900 tracking-tight flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-sky-600 flex-shrink-0" />
            <span className="text-center sm:text-left">Sports Articles</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto sm:mx-0 px-2 sm:px-0">
            Manage and review all sports articles
          </p>
        </motion.div>

        {/* Tab Skeleton */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center sm:justify-start">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[...Array(6)].map((_, i) => (
            <ArticleSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 sm:mb-12 text-center sm:text-left"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900 tracking-tight flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3">
          <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-sky-600 flex-shrink-0" />
          <span className="text-center sm:text-left leading-tight">
            Sports Articles
          </span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto sm:mx-0 px-2 sm:px-0">
          Manage and review all sports articles in the system
        </p>

        {/* Add New Article Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-6 flex justify-center sm:justify-start"
        >
          <button
            onClick={() => router.push('/dashboard/cms/articles/new')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-medium shadow-lg hover:from-sky-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Article
          </button>
        </motion.div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8 sm:mb-12"
      >
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  relative inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50
                  ${isActive
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-sky-300 hover:bg-sky-50 shadow-sm hover:shadow-md'
                  }
                `}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-pressed={isActive}
                aria-label={`Filter by ${tab.label}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {activeTab === 'all' && (
                    <span
                      className={`
                      px-2 py-0.5 rounded-full text-xs font-medium
                      ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}
                    `}
                    >
                      {tab.count}
                    </span>
                  )}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}

      {!articles?.length && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 sm:py-16 px-4"
        >
          <Bookmark className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
            No {activeTab !== 'all' ? activeTab : ''} articles available at the
            moment.
          </p>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            {activeTab === ArticleStatus.Draft
              ? 'Create your first draft article.'
              : activeTab === ArticleStatus.Published
                ? 'Publish some articles to see them here.'
                : 'Check back later for new articles or try refreshing the page.'}
          </p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {articles?.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col h-full hover:shadow-lg transition-all duration-300 border border-gray-100 relative overflow-hidden group w-full cursor-pointer"
              onClick={() => handleArticleClick(article.id)}
            >
              {/* Status badge */}
              <div
                className={`absolute top-3 sm:top-4 right-3 sm:right-4 z-10 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold shadow-md flex items-center gap-1 ${article.status === ArticleStatus.Published
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600'
                  }`}
              >
                {article.status === ArticleStatus.Published ? (
                  <>
                    <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                    <span className="whitespace-nowrap">Published</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                    <span className="whitespace-nowrap">Draft</span>
                  </>
                )}
              </div>

              {/* Featured badge for top articles */}
              {index < 2 && activeTab === 'all' && (
                <div className="absolute top-10 sm:top-12 right-3 sm:right-4 z-10 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold shadow-md flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span className="whitespace-nowrap">Featured</span>
                </div>
              )}

              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 text-gray-900 hover:text-sky-600 transition-colors duration-300 pr-16 sm:pr-20">
                <span className="hover:underline underline-offset-4 decoration-sky-500 line-clamp-2 block">
                  {article.title}
                </span>
              </h3>

              {article.content?.includes('<img') && (
                <motion.div
                  className="mb-3 sm:mb-4 rounded-lg overflow-hidden shadow-inner relative h-32 sm:h-40 md:h-48 w-full"
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className="w-full h-full bg-cover bg-center rounded-lg transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${article.content.match(/<img.*?src=["'](.*?)["']/)?.[1]})`,
                    }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              )}

              <p className="text-gray-700 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-3 flex-grow leading-relaxed">
                {cleanText(article.summary ? article.summary : article.content, true)}
              </p>

              <div className="pt-3 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 mt-auto">
                <div className="flex items-center gap-2 text-xs text-gray-500 order-2 sm:order-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-sky-500 flex-shrink-0" />
                  <span className="truncate">
                    {formatDate(new Date(article.createdAt).toDateString())}
                  </span>
                </div>

                <motion.button
                  className="inline-flex items-center justify-center gap-1 bg-gradient-to-r from-sky-500 to-sky-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 group/button text-xs sm:text-sm w-full sm:w-auto order-1 sm:order-2"
                  aria-label={`View article: ${article.title}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArticleClick(article.id);
                  }}
                >
                  <span className="whitespace-nowrap">View Article</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/button:translate-x-1 flex-shrink-0" />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination Controls */}
      {totalPages && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mt-12 sm:mt-16 px-4 overflow-x-auto"
        >
          <div className="flex space-x-2 min-w-max">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <motion.button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 relative overflow-hidden text-sm sm:text-base min-w-[40px] ${page === pageNum
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  aria-current={page === pageNum ? 'page' : undefined}
                  aria-label={`Go to page ${pageNum}`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {page === pageNum && (
                    <motion.span
                      layoutId="paginationIndicator"
                      className="absolute inset-0 bg-sky-500 rounded-lg"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{pageNum}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </section>
  );
};

// Article Skeleton Component
const ArticleSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col h-full border border-gray-100">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 sm:h-40 md:h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
