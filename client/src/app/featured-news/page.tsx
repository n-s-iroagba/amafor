'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Clock, TrendingUp, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorAlert } from '@/shared/components/Alerts';
import { API_ROUTES } from '@/config/routes';
import { useGet } from '@/shared/hooks/useApiQuery';
import AdDisplay from '@/features/advertisement/component/AdDisplay';
// Ensure you have these imports or adjust paths accordingly
// import { API_ROUTES, useGet, AdDisplay } from '@/...';

interface RSSItem {
  id: number | string;
  title?: string;
  article_url?: string;
  published_at?: string;
  creator?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  isoDate?: string;
}

type RSSResponse = {
  data: RSSItem[];
  totalPages: number;
};



const FeaturedNews =() => {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetching data based on the type prop, but styling is now unified
  const { data: data, loading, error } = useGet<RSSResponse>(
    `${API_ROUTES.ARTICLES.PUBLISHED}`
  );
  
  const [totalPages, setTotalPages] = useState(0);
  const [items, setItems] = useState<RSSItem[]>([]);

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
      setItems(data.data);
    }
  }, [data]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Standardized configuration (Amber Theme)
  const config = {
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-amber-600',
    hoverColor: 'hover:text-amber-600',
    focusRing: 'focus:ring-amber-400',
    decorationColor: 'decoration-amber-500',
    clockColor: 'text-amber-500',
    bgColor: 'bg-amber-500',
  };

  // Loading State
  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 text-center sm:text-left"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900 tracking-tight flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-600 flex-shrink-0" />
            <span className="text-center sm:text-left">Featured News</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto sm:mx-0 px-2 sm:px-0">
            Stay updated with the latest curated stories from around the world
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-96 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <AdDisplay identifier="header-banner" />
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12 text-center sm:text-left"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900 tracking-tight flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-600 flex-shrink-0" />
            <span className="text-center sm:text-left leading-tight">
              Featured News
            </span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto sm:mx-0 px-2 sm:px-0">
            Stay updated with the latest sports news from around the world
          </p>
        </motion.div>

        {error && <ErrorAlert message={error} />}

        {!items.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16 px-4"
          >
            <Bookmark className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
              No featured news available at the moment.
            </p>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              Check back later for updates or try refreshing the page.
            </p>
          </motion.div>
        )}

        {items.length > 0 && (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {items.map((item, index) => (
                <motion.article
                  key={item.guid ?? index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col h-full hover:shadow-lg transition-all duration-300 border border-gray-100 relative overflow-hidden group w-full"
                >
                  {/* Premium badge - Standardized */}
                  {index < 2 && (
                    <div
                      className={`absolute top-3 sm:top-4 right-3 sm:right-4 z-10 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold shadow-md flex items-center gap-1`}
                    >
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                      <span className="whitespace-nowrap">Premium</span>
                    </div>
                  )}

                  <h3
                    className={`text-base sm:text-lg md:text-xl font-bold mb-3 text-gray-900 ${config.hoverColor} transition-colors duration-300 pr-16 sm:pr-20`}
                  >
                    <a
                      href={item.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`hover:underline underline-offset-4 ${config.decorationColor} line-clamp-2 block`}
                      title={`Read full article: ${item.title}`}
                    >
                      {item.title}
                    </a>
                  </h3>

                  {item.content?.includes('<img') && (
                    <motion.div
                      className="mb-3 sm:mb-4 rounded-lg overflow-hidden shadow-inner relative h-32 sm:h-40 md:h-48 w-full"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div
                        className="w-full h-full bg-cover bg-center rounded-lg transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage: `url(${item.content.match(/<img.*?src=["'](.*?)["']/)?.[1]})`,
                        }}
                        aria-hidden="true"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  )}

                  <p className="text-gray-700 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-3 flex-grow leading-relaxed">
                    {item.contentSnippet}
                  </p>

                  <div className="pt-3 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-gray-500 order-2 sm:order-1">
                      <Clock
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${config.clockColor} flex-shrink-0`}
                      />
                      <span className="truncate">
                        {formatDate(item.published_at ?? item.isoDate)}
                      </span>
                    </div>

                    <motion.a
                      href={item.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-1 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white px-3 sm:px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 ${config.focusRing} focus:ring-opacity-50 group/button text-xs sm:text-sm w-full sm:w-auto order-1 sm:order-2`}
                      aria-label={`Read more about ${item.title}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="whitespace-nowrap">Read More</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/button:translate-x-1 flex-shrink-0" />
                    </motion.a>
                  </div>
                </motion.article>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Standard Numbered Pagination */}
        {totalPages > 1 && items.length > 0 && (
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
                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 ${config.focusRing} focus:ring-opacity-50 relative overflow-hidden text-sm sm:text-base min-w-[40px] ${
                      page === pageNum
                        ? `bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white shadow-md`
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
                        className={`absolute inset-0 ${config.bgColor} rounded-lg`}
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
    </>
  );
};

export default FeaturedNews;