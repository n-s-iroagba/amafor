'use client';

import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { Article } from '@/features/articles/types';
import { useGet } from '@/shared/hooks/useApiQuery';
import { AnimatePresence, motion } from 'framer-motion';
import { cleanText} from '@/features/articles/utils';
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/routes';
import { formatDate } from '@/shared/utils';
import { PaginatedData } from '@/shared/types';

export default function LatestNewsSection() {
  const router = useRouter()
  const { data, loading } = useGet<{data:Article[]}>(API_ROUTES.ARTICLES.PUBLISHED,{
      params: { limit: 3 },
      enabled: true 
    }
  )
  const articles = data?.data || []

  const handleArticleClick = (id: number | string) => {
    router.push(`/news/${id}`);
  };

  // Loading state
  if (loading) return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 lg:mb-16 gap-4">
          <div className="w-full sm:w-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">LATEST NEWS</h2>
            <div className="h-1.5 sm:h-2 w-16 sm:w-20 lg:w-24 bg-sky-500 mt-3 sm:mt-4"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 sm:h-56 md:h-64 bg-gray-200 rounded-lg mb-4 sm:mb-5"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2 sm:mb-3 w-1/4"></div>
              <div className="h-5 sm:h-6 bg-gray-200 rounded mb-2 sm:mb-3"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  if (!articles || articles.length === 0) return null

  return (
    <section className="py-3  bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 lg:mb-16 gap-4">
          <div className="w-full sm:w-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">LATEST NEWS</h2>
            <div className="h-1.5 sm:h-2 w-16 sm:w-20 lg:w-24 bg-sky-500 mt-3 sm:mt-4"></div>
          </div>
          <Link 
            href="/news" 
            className="text-sky-500 hover:text-sky-600 font-bold inline-flex items-center gap-2 sm:gap-3 text-base sm:text-lg transition-colors duration-200"
          >
            VIEW ALL
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </div>
        
        {/* Articles Grid */}
        <AnimatePresence mode="wait">
          <motion.div
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
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6 flex flex-col h-full hover:shadow-lg transition-all duration-300 border border-gray-100 relative overflow-hidden group w-full cursor-pointer"
                onClick={() => handleArticleClick(article.id)}
              >
                {/* Article Title */}
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-gray-900 hover:text-sky-600 transition-colors duration-300">
                  <span className="hover:underline underline-offset-4 decoration-sky-500 line-clamp-2 block">
                    {article.title}
                  </span>
                </h3>

                {/* Featured Image */}
                {article.content?.includes('<img') && (
                  <motion.div
                    className="mb-3 sm:mb-4 rounded-lg overflow-hidden shadow-inner relative h-40 sm:h-48 md:h-52 lg:h-56 w-full"
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

                {/* Excerpt */}
                <p className="text-gray-700 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 line-clamp-3 flex-grow leading-relaxed">
                  {cleanText(article.content, true)}
                </p>

                {/* Footer */}
                <div className="pt-3 sm:pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-2 mt-auto">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500 flex-shrink-0" />
                    <span className="truncate">
                      {formatDate(new Date(article.createdAt).toDateString())}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 group/button text-xs sm:text-sm w-full sm:w-auto"
                    aria-label={`View article: ${article.title}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArticleClick(article.id);
                    }}
                  >
                    <span className="whitespace-nowrap">View Article</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/button:translate-x-1 flex-shrink-0" />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}