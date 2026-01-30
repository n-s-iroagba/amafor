'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Article } from '@/features/articles/types';
import { cleanText } from '@/features/articles/utils';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

/**
 * Page: Article Detail
 * Description: Displays full content of a news article.
 * Requirements: REQ-PUB-03 (Articles)
 * User Story: US-PUB-004 (Read Full Article)
 * User Journey: UJ-PUB-002 (Browse News)
 * API: GET /articles/:id (API_ROUTES.ARTICLES.VIEW)
 * Hook: useGet(API_ROUTES.ARTICLES.VIEW(id))
 */
export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    data: article,
    loading,
    error,
    refetch,
  } = useGet<Article>(API_ROUTES.ARTICLES.VIEW(id));

  const removeImageTags = (content: string) => {
    return content.replace(/<img[^>]*>/gi, '');
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="h-10 bg-sky-200 rounded mb-4 animate-pulse"></div>
            <div className="w-full h-64 bg-sky-200 rounded mb-4 animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {error ? 'Something went wrong' : 'Article not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              'The article you are looking for does not exist or has been moved.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 text-sky-600 hover:text-sky-800 transition-colors duration-200"
            >
              ← Go Back
            </button>
            {error && (
              <button
                onClick={() => {
                  refetch();
                }}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Title */}

          <h1 className="text-cetext-3xl sm:text-4xl lg:text-5xl font-bold text-sky-800 leading-tight break-words mb-6 min-h-[3rem]" data-testid="article-title">
            {cleanText(article.title)}
          </h1>

          <div
            className="w-full h-full bg-cover bg-center rounded-lg transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: `url(${article.content.match(/<img.*?src=["'](.*?)["']/)?.[1]})`,
            }}
            aria-hidden="true"
          />
          {/* Content Card */}
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Summary */}
              {article.excerpt && (
                <p className="text-sky-600 italic border-l-4 border-sky-200 pl-4 mb-6 min-h-[3rem]" data-testid="article-excerpt">
                  {article.excerpt}
                </p>
              )}

              {/* Content */}
              <div className="prose prose-sky max-w-none min-h-[10rem] break-words" data-testid="article-content">
                <div
                  dangerouslySetInnerHTML={{
                    __html: removeImageTags(article.content),
                  }}
                />
              </div>


            </div>
          </article>

          {/* Back button */}
          <div className="mt-6">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-sm sm:text-base text-sky-600 hover:text-sky-800 transition-all duration-200 hover:translate-x-1"
              data-testid="back-button"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to articles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
