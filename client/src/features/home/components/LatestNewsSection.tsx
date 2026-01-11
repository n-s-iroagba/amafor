'use client';

import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { useGet } from "@/hooks/useApiQuery"

interface NewsArticle {
  id: string;
  title: string;
  snippet: string;
  image: string;
  category: string;
  date: string;
}

export default function LatestNewsSection() {
  const { data: latestNews, loading } = useGet<NewsArticle[]>(
    '/api/news',
    { 
      params: { limit: 3 },
      enabled: true 
    }
  )

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

  if (!latestNews || latestNews.length === 0) return null

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
        
        <div className="grid md:grid-cols-3 gap-8">
          {latestNews.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="group"
            >
              <div className="relative overflow-hidden mb-5">
                <div
                  className="h-64 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${article.image})` }}
                />
                <div className="absolute top-4 left-4 bg-sky-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider">
                  {article.category}
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-sky-500 transition-colors line-clamp-2">
                {article.title}
              </h3>
              
              <p className="text-gray-600 line-clamp-2 leading-relaxed">
                {article.snippet}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}