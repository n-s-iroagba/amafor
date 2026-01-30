'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Star, Clock, TrendingUp, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


import { API_ROUTES } from '@/config/routes';
import { useGet } from '@/shared/hooks/useApiQuery';
import { PaginatedData } from '@/shared/types';
import ArticleSkeleton from '@/features/articles/components/ArticleSkeleton';
import { Footer } from '@/shared/components/Footer';
import { WhatsAppWidget } from '@/shared/components/WhatsAppWidget';
import { Article } from '@/features/articles/types';
import { formatDate } from '@/shared/utils';




/**
 * Page: News List
 * Description: Displays paginated list of club news articles.
 * Requirements: REQ-PUB-03 (Articles)
 * User Story: US-PUB-003 (Browse News)
 * User Journey: UJ-PUB-002 (Browse News)
 * API: GET /articles/published (API_ROUTES.ARTICLES.PUBLISHED)
 * Hook: useGet(API_ROUTES.ARTICLES.PUBLISHED)
 */
const ArticleList: React.FC = () => {
  const router = useRouter();
  const limit = 10;
  const [page, setPage] = useState(1);
  const { data, loading, error } = useGet<PaginatedData<Article>>(
    API_ROUTES.ARTICLES.PUBLISHED,
    {
      params: { page, limit }
    }
  );

  const articles = data?.data;
  const totalPages = data?.totalPages;


  const handleArticleClick = (id: number | string) => {
    router.push(`/news/${id}`);
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
            <span className="text-center sm:text-left">
              Amafor Galadiators Sports News
            </span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[...Array(6)].map((_, i) => (
            <ArticleSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12 text-center sm:text-left"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900 tracking-tight flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-sky-600 flex-shrink-0" />
            <span className="text-center sm:text-left">
              Amafor Galadiators Sports News
            </span>
          </h1>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-center px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!articles?.length && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16 px-4"
          >
            <Bookmark className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
              No articles available at the moment.
            </p>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              Check back later for new articles or try refreshing the page.
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {articles?.map((article, index) => (
              <motion.article
                key={article.id ?? index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col h-full hover:shadow-lg transition-all duration-300 border border-gray-100 relative overflow-hidden group w-full cursor-pointer"
                onClick={() => handleArticleClick(article.id)}
                data-testid="news-item"
              >
                {/* Premium badge */}
                {index < 2 && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold shadow-md flex items-center gap-1">
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
                  {article.excerpt}
                </p>

                <div className="pt-3 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 mt-auto">
                  <div className="flex items-center gap-2 text-xs text-gray-500 order-2 sm:order-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-sky-500 flex-shrink-0" />
                    <span className="truncate">
                      {formatDate(String(article.publishedAt || ''))}
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
                    data-testid={`btn-view-article-${article.id}`}
                  >
                    <span className="whitespace-nowrap">View Article</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/button:translate-x-1 flex-shrink-0" />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>
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
                    data-testid={`pagination-page-${pageNum}`}
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
      <Footer />

      <WhatsAppWidget />
    </>
  );
};



export default ArticleList;
