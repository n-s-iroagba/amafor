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



export default function LatestNewsSection() {
  const router = useRouter()
  const { data: articles, loading } = useGet<Article[]>(API_ROUTES.ARTICLES.PUBLISHED,{
      params: { limit: 3 },
      enabled: true 
    }
  )

    const handleArticleClick = (id: number | string) => {
    router.push(`/sport-articles/${id}`);
  };

  // Don't render if loading or no news
  if (loading) return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-5xl font-black text-gray-900">LATEST NEWS</h2>
            <div className="h-2 w-24 bg-sky-500 mt-4"></div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 mb-5"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  if (!articles || articles.length === 0) return null

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-5xl font-black text-gray-900">LATEST NEWS</h2>
            <div className="h-2 w-24 bg-sky-500 mt-4"></div>
          </div>
          <Link href="/news" className="text-sky-500 hover:text-sky-600 font-bold inline-flex items-center gap-3 text-lg">
            VIEW ALL
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
        
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
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col h-full hover:shadow-lg transition-all duration-300 border border-gray-100 relative overflow-hidden group w-full cursor-pointer"
              onClick={() => handleArticleClick(article.id)}
            >
        <div className="relative overflow-hidden mb-5">
                <div
                  className="h-64 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${article.featuredImage})` }}
                />
             
              </div>

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
                   {cleanText(article.content, true)}
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
      </div>
    </section>
  )
}