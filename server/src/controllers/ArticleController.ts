// src/controllers/ArticleController.ts
import { Request, Response } from 'express';
import articleService, { ArticleService } from '@services/ArticleService';
import { ArticleStatus, ArticleTag } from '@models/Article';
import { ApiResponse } from '@utils/apiResponse';
import { z } from 'zod';
import logger from '@utils/logger';
import { tracer } from '@utils/tracer';

// Validation schemas
const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).default('1').transform(Number),
  limit: z.string().regex(/^\d+$/).default('10').transform(Number)
});

const filterSchema = z.object({
  tag: z.string().optional(),
  author: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['draft', 'published', 'scheduled']).optional()
});

const sortSchema = z.object({
  sortBy: z.enum(['publishedAt', 'updatedAt', 'views', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export class ArticleController {
  private articleService: ArticleService;

  constructor() {
    this.articleService = articleService;
  }

  /**
   * Get homepage articles
   * @api GET /articles/homepage
   * @apiName API-ARTICLE-001
   * @apiGroup Articles
   * @srsRequirement REQ-PUB-03
   */
  async fetchHomepageArticles(req: Request, res: Response): Promise<void> {
    return tracer.startActiveSpan('controller.Article.fetchHomepageArticles', async (span) => {
      try {
        const homepageArticles = await this.articleService.fetchHomepageArticles();

        ApiResponse.success(res, {
          message: 'Homepage articles fetched successfully',
          data: homepageArticles
        });

        span.setStatus({ code: 1 }); // OK
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error fetching homepage articles', { error });

        ApiResponse.error(res, {
          message: 'Failed to fetch homepage articles',
          statusCode: 500
        });
      } finally {
        span.end();
      }
    });
  }

  /**
   * Get all published articles
   * @api GET /articles/published
   * @apiName API-ARTICLE-002
   * @apiGroup Articles
   * @srsRequirement REQ-PUB-03, REQ-CMS-01
   */
  async fetchAllPublishedArticles(req: Request, res: Response): Promise<void> {
    return tracer.startActiveSpan('controller.Article.fetchAllPublishedArticles', async (span) => {
      try {
        // Validate query parameters
        const pagination = paginationSchema.parse(req.query);
        const filters = filterSchema.parse(req.query);
        const sort = sortSchema.parse(req.query);

        // Convert date filters if provided
        const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined;
        const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined;

        const filterOptions = {
          ...filters,
          tag: filters.tag as ArticleTag,
          status: filters.status as ArticleStatus,
          dateFrom,
          dateTo
        };

        const articles = await this.articleService.fetchAllPublishedArticles(
          pagination.page,
          pagination.limit,
          filterOptions,
          sort
        );

        ApiResponse.success(res, {
          message: 'Published articles fetched successfully',
          data: articles
        });

        span.setAttributes({
          page: pagination.page,
          limit: pagination.limit,
          total: articles.total
        });
        span.setStatus({ code: 1 }); // OK
      } catch (error) {
        if (error instanceof z.ZodError) {
          ApiResponse.error(res, {
            message: 'Validation error',
            errors: error,
            statusCode: 400
          });
          span.setStatus({ code: 2, message: 'Validation error' }); // Invalid argument
        } else {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          span.setStatus({ code: 2, message: errorMessage });
          logger.error('Error fetching published articles', { error });

          ApiResponse.error(res, {
            message: 'Failed to fetch published articles',
            statusCode: 500
          });
        }
      } finally {
        span.end();
      }
    });
  }

  /**
   * Get article by ID
   * @api GET /articles/:id
   * @apiName API-ARTICLE-006
   * @apiGroup Articles
   * @srsRequirement REQ-PUB-03, REQ-CMS-01
   */
  async getArticleById(req: Request, res: Response): Promise<void> {
    return tracer.startActiveSpan('controller.Article.getArticleById', async (span) => {
      try {
        const { id } = req.params;
        span.setAttribute('id', id);

        const article = await this.articleService.getArticleById(id);

        if (!article) {
          ApiResponse.error(res, {
            message: 'Article not found',
            statusCode: 404
          });
          span.setStatus({ code: 2, message: 'Article not found' }); // NOT_FOUND
          return;
        }

        if (article.status !== 'published') {
          ApiResponse.error(res, {
            message: 'Article is not published',
            statusCode: 403
          });
          span.setStatus({ code: 2, message: 'Article not published' }); // Permission denied
          return;
        }

        ApiResponse.success(res, {
          message: 'Article fetched successfully',
          data: article
        });

        span.setStatus({ code: 1 }); // OK
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error fetching article by ID', { error, id: req.params.id });

        ApiResponse.error(res, {
          message: 'Failed to fetch article',
          statusCode: 500
        });
      } finally {
        span.end();
      }
    });
  }

  /**
   * Get articles by tag
   * @api GET /articles/tag/:tag
   * @apiName API-ARTICLE-003
   * @apiGroup Articles
   * @srsRequirement REQ-PUB-03
   */
  async getArticlesByTag(req: Request, res: Response): Promise<void> {
    return tracer.startActiveSpan('controller.Article.getArticlesByTag', async (span) => {
      try {
        const { tag } = req.params;
        const pagination = paginationSchema.parse(req.query);

        span.setAttribute('tag', tag);
        span.setAttribute('page', pagination.page);
        span.setAttribute('limit', pagination.limit);

        const articles = await this.articleService.getArticlesByTag(
          tag as ArticleTag,
          pagination.page,
          pagination.limit
        );

        ApiResponse.success(res, {
          message: `Articles with tag "${tag}" fetched successfully`,
          data: articles
        });

        span.setStatus({ code: 1 }); // OK
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error fetching articles by tag', { error, tag: req.params.tag });

        ApiResponse.error(res, {
          message: 'Failed to fetch articles by tag',
          statusCode: 500
        });
      } finally {
        span.end();
      }
    });
  }

  /**
   * Search articles
   * @api GET /articles/search
   * @apiName API-ARTICLE-004
   * @apiGroup Articles
   * @srsRequirement REQ-PUB-03
   */
  async searchArticles(req: Request, res: Response): Promise<void> {
    return tracer.startActiveSpan('controller.Article.searchArticles', async (span) => {
      try {
        const { q } = req.query;
        const pagination = paginationSchema.parse(req.query);

        if (!q) {
          ApiResponse.error(res, {
            message: 'Search query is required',
            statusCode: 400
          });
          span.setStatus({ code: 2, message: 'Search query required' });
          return;
        }

        span.setAttribute('query', q as string);
        span.setAttribute('page', pagination.page);
        span.setAttribute('limit', pagination.limit);

        const articles = await this.articleService.searchArticles(
          q as string,
          pagination.page,
          pagination.limit
        );

        ApiResponse.success(res, {
          message: 'Search results fetched successfully',
          data: articles
        });

        span.setStatus({ code: 1 }); // OK
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error searching articles', { error, query: req.query.q });

        ApiResponse.error(res, {
          message: 'Failed to search articles',
          statusCode: 500
        });
      } finally {
        span.end();
      }
    });
  }

  // Invalidate cache (admin only - protected route)
  async invalidateCache(req: Request, res: Response): Promise<void> {
    return tracer.startActiveSpan('controller.Article.invalidateCache', async (span) => {
      try {
        const { articleId } = req.query;

        await this.articleService.invalidateArticleCache(articleId as string);

        ApiResponse.success(res, {
          message: articleId ? `Cache invalidated for article ${articleId}` : 'Article cache invalidated',
          data: { invalidated: true }
        });

        span.setStatus({ code: 1 }); // OK
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error invalidating article cache', { error });

        ApiResponse.error(res, {
          message: 'Failed to invalidate cache',
          statusCode: 500
        });
      } finally {
        span.end();
      }
    });
  }

  /**
   * Get popular tags
   * @api GET /articles/popular-tags
   * @apiName API-ARTICLE-005
   * @apiGroup Articles
   * @srsRequirement REQ-PUB-03
   */
  async getPopularTags(req: Request, res: Response): Promise<void> {
    return tracer.startActiveSpan('controller.Article.getPopularTags', async (span) => {
      try {
        // This would typically come from a separate service/repository
        // For now, we'll return mock data or implement if you have a tags table
        const popularTags = [
          { name: 'football', count: 45 },
          { name: 'transfer', count: 32 },
          { name: 'match', count: 28 },
          { name: 'training', count: 21 },
          { name: 'interview', count: 18 }
        ];

        ApiResponse.success(res, {
          message: 'Popular tags fetched successfully',
          data: popularTags
        });

        span.setStatus({ code: 1 }); // OK
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error fetching popular tags', { error });

        ApiResponse.error(res, {
          message: 'Failed to fetch popular tags',
          statusCode: 500
        });
      } finally {
        span.end();
      }
    });
  }
}

export default new ArticleController();