'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/routes';
import { useGet, useDelete } from '@/shared/hooks/useApiQuery';
import { cleanText } from '@/shared/utils';

enum ArticleStatus {
  Draft = 'draft',
  Published = 'published',
}

interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  slug: string;
  status: ArticleStatus;
  metaTitle?: string;
  metaDescription?: string;
  readingTime?: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}


/**
 * Page: CMS Article Detail
 * Description: View article version history and status.
 * Requirements: REQ-CMS-01 (Article List/Detail)
 * User Story: US-CMS-001 (View Article List)
 * User Journey: UJ-CMS-001 (Manage Articles)
 * API: GET /articles/:id (API_ROUTES.ARTICLES.VIEW)
 */
export default function ArticleDetail() {
  const router = useRouter();
  const { id } = useParams(); // article id from URL
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const { data: article, loading, error } = useGet<Article>(API_ROUTES.ARTICLES.VIEW(id as string));
  const { delete: deleteItem } = useDelete(API_ROUTES.ARTICLES.MUTATE(id as unknown as number));


  const handleDelete = async () => {
    try {
      await deleteItem(id as unknown as number);
      router.push('/dashboard/cms/articles'); // back to list
    } catch (err) {
      console.error('Error deleting article:', err);
      // Toast error handled by hook usually or add local handling
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <p className="text-sky-600">Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-red-600">{error || 'Article not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-sky-800 mb-4" data-testid="article-title">
          {article.title}
        </h1>

        <p className="text-gray-500 text-sm mb-2">
          Created: {new Date(article.createdAt).toLocaleString()} | Updated:{' '}
          {new Date(article.updatedAt).toLocaleString()}
        </p>

        <span
          className={`inline-block text-xs px-2 py-1 rounded-full mb-4 ${article.status === ArticleStatus.Published
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
            }`}
          data-testid="article-status-badge"
        >
          {article.status}
        </span>

        {article.content?.includes('<img') && (
          <div
            className="mb-3 sm:mb-4 rounded-lg overflow-hidden shadow-inner relative h-32 sm:h-40 md:h-48 w-full"

          >
            <div
              className="w-full h-full bg-cover bg-center rounded-lg transition-transform duration-500 group-hover:scale-105"
              style={{
                backgroundImage: `url(${article.content.match(/<img.*?src=["'](.*?)["']/)?.[1]})`,
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <p className="text-gray-700 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-3 flex-grow leading-relaxed">
          {cleanText(article.summary)}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() =>
              router.push(`/dashboard/cms/articles/${article.id}/edit`)
            }
            className="px-4 py-2 border text-sky-600 rounded hover:bg-sky-50"
            data-testid="btn-edit-article"
          >
            Edit
          </button>

          {deleteConfirm ? (
            <>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                data-testid="btn-confirm-delete"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 border text-gray-600 rounded hover:bg-gray-50"
                data-testid="btn-confirm-cancel"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="px-4 py-2 border text-red-600 rounded hover:bg-red-50"
              data-testid="btn-delete-article"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
