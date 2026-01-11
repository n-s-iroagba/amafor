import { Header } from '@/features/home/components/Header'
import { WhatsAppWidget } from '@/features/shared/WhatsAppWidget';
import { CookieConsent } from '@/features/shared/CookieConsent';
import { Footer } from '@/features/shared/Footer';
import Link from 'next/link'
import { newsArticles } from '@/data/mockData'
import { Calendar } from 'lucide-react'

export default function NewsListing() {
  const categories = ['All', 'Match Reports', 'Transfers', 'Academy', 'Community']

  return (
    <>
      <Header />
      
      <main className="py-16 bg-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-5xl font-heading text-sky-500 mb-2">News & Updates</h1>
            <div className="h-1 w-16 bg-sky-600 mb-6"></div>
            <p className="text-xl text-slate-600">
              Stay up to date with the latest news, match reports, and club announcements
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12 pb-6 border-b border-slate-200">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 font-semibold transition-colors ${
                  category === 'All'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.map((article) => (
              <Link 
                key={article.id}
                href={`/news/${article.id}`}
                className="group bg-slate-50 border border-slate-200 overflow-hidden hover:border-sky-600 transition-colors"
              >
                <div 
                  className="h-56 bg-cover bg-center"
                  style={{ backgroundImage: `url(${article.image})` }}
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-sky-600 font-semibold">
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-heading text-sky-500 mb-3 group-hover:text-sky-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 line-clamp-3 leading-relaxed">
                    {article.snippet}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <CookieConsent />
      <WhatsAppWidget />
    </>
  )
}
