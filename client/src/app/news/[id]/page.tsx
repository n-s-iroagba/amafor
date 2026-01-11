
import Link from 'next/link'
import { newsArticles } from '@/data/mockData'
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Header } from '@/features/home/components/Header'
import { CookieConsent } from '@/features/shared/CookieConsent'
import { Footer } from '@/features/shared/Footer'
import { WhatsAppWidget } from '@/features/shared/WhatsAppWidget'

export function generateStaticParams() {
  return newsArticles.map((article) => ({
    id: article.id,
  }))
}

export default function NewsDetail({ params }: { params: { id: string } }) {
  const article = newsArticles.find(a => a.id === params.id)

  if (!article) {
    notFound()
  }

  const relatedArticles = newsArticles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3)

  return (
    <>
      <Header />
      
      <main className="py-16 bg-white min-h-screen">
        <article className="container mx-auto px-4 max-w-4xl">
          <Link href="/news" className="inline-flex items-center gap-2 text-sky-500 hover:text-sky-600 mb-8 font-semibold transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to News
          </Link>

          {/* Article Header */}
          <div className="mb-8">
            <span className="inline-block text-xs uppercase tracking-wider text-sky-600 bg-sky-50 px-4 py-2 font-semibold mb-4">
              {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-heading text-sky-500 mb-6">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-slate-600 pb-6 border-b border-slate-200">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(article.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.author}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div 
            className="w-full h-96 bg-cover bg-center mb-12 border border-slate-200"
            style={{ backgroundImage: `url(${article.image})` }}
          />

          {/* Article Content */}
          <div className="prose max-w-none mb-12">
            <p className="text-xl text-slate-700 leading-relaxed mb-6">
              {article.content}
            </p>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <h2 className="text-2xl font-heading text-sky-500 mb-4 mt-8">Key Highlights</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700 mb-6">
              <li>Outstanding performance from key players throughout the match</li>
              <li>Strategic tactical changes that made the difference</li>
              <li>Strong support from the fans at the stadium</li>
              <li>Looking ahead to the next fixture with confidence</li>
            </ul>

            <p className="text-slate-700 leading-relaxed mb-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>

          {/* Share */}
          <div className="flex items-center gap-4 py-6 border-y border-slate-200 mb-12">
            <span className="flex items-center gap-2 text-sky-500 font-semibold">
              <Share2 className="w-5 h-5" />
              Share:
            </span>
            <div className="flex gap-3">
              <button className="w-10 h-10 bg-slate-100 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-slate-100 hover:bg-blue-400 hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-slate-100 hover:bg-blue-700 hover:text-white flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div>
              <h2 className="text-3xl font-heading text-sky-500 mb-8">Related News</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link 
                    key={related.id}
                    href={`/news/${related.id}`}
                    className="group bg-slate-50 border border-slate-200 overflow-hidden hover:border-sky-600 transition-colors"
                  >
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${related.image})` }}
                    />
                    <div className="p-4">
                      <span className="text-xs uppercase tracking-wider text-sky-600 font-semibold">
                        {related.category}
                      </span>
                      <h3 className="text-lg font-heading text-sky-500 mt-2 group-hover:text-sky-600 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
      <CookieConsent />
      <WhatsAppWidget />
    </>
  )
}
