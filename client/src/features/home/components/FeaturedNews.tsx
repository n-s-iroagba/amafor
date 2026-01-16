'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp, Bookmark, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorAlert } from '@/shared/components/Alerts';
import { API_ROUTES } from '@/config/routes';
import { useGet } from '@/shared/hooks/useApiQuery';

// Assuming you still need to import Category/API_ROUTES/useGet/AdDisplay
// Adjust these imports based on your actual file structure
// import { Category, API_ROUTES, useGet } from '@/...';
// import AdDisplay from '@/...';

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


const FeaturedNews: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 6; // Reduced initial limit for a home page section feel

  // Ideally, ensure useGet fetches based on the current page
  const {
    data,
    loading,
    error,
  } = useGet<RSSResponse>(
    API_ROUTES.ARTICLES.HOME_PAGE,{params:{
      limit:'3'
    }}
  );

  const [totalPages, setTotalPages] = useState(0);
  const [items, setItems] = useState<RSSItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setTotalPages(data.totalPages);
      
      setItems((prevItems) => {
        // If it's the first page, replace items. Otherwise, append.
        if (page === 1) return data.data;
        
        // Simple de-duplication to be safe
        const newItems = data.data.filter(
          (newItem) => !prevItems.some((prev) => prev.guid === newItem.guid)
        );
        return [...prevItems, ...newItems];
      });
      
      setIsLoadingMore(false);
    }
  }, [data, page]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Fixed Styling Configuration (Amber Theme)
  const config = {
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-amber-600',
    hoverColor: 'hover:text-amber-600',
    focusRing: 'focus:ring-amber-400',
    decorationColor: 'decoration-amber-500',
    clockColor: 'text-amber-500',
    bgColor: 'bg-amber-500',
  };

  // Initial Loading State (Skeleton)
  if (loading && page === 1) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Optional: Keep or remove AdDisplay depending on home page layout needs */}
   

      <section className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 border-b border-gray-100 pb-4"
        >
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-amber-600" />
              Featured News
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Curated stories from around the world
            </p>
          </div>
        </motion.div>

        {error && <ErrorAlert message={error} />}

        {!items.length && !loading && (
          <div className="text-center py-12">
            <Bookmark className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No featured news available.</p>
          </div>
        )}

        {/* News Grid */}
        <AnimatePresence mode='popLayout'>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {items.map((item, index) => (
              <motion.article
                key={`${item.guid}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index % limit * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full"
              >
                {/* Image Section */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
                  {item.content?.includes('<img') ? (
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${item.content.match(/<img.*?src=["'](.*?)["']/)?.[1]})`,
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                      <TrendingUp className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Category/Date Badge on Image */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      News
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <span>{formatDate(item.published_at ?? item.isoDate)}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors">
                    <a
                      href={item.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {item.title}
                    </a>
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                    {item.contentSnippet}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      Read Article
                    </span>
                    <a
                      href={item.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </AnimatePresence>

        {/* View More Button (Replaces Pagination) */}
        {page < totalPages && (
          <div className="mt-12 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-800 px-8 py-3 rounded-full font-semibold shadow-sm hover:shadow-md hover:bg-gray-50 hover:text-amber-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  View More News
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default FeaturedNews;