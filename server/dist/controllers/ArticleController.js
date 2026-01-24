"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleController = void 0;
const ArticleService_1 = __importDefault(require("@services/ArticleService"));
const apiResponse_1 = require("@utils/apiResponse");
const zod_1 = require("zod");
const logger_1 = __importDefault(require("@utils/logger"));
const tracer_1 = require("@utils/tracer");
// Validation schemas
const paginationSchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).default('1').transform(Number),
    limit: zod_1.z.string().regex(/^\d+$/).default('10').transform(Number)
});
const filterSchema = zod_1.z.object({
    tag: zod_1.z.string().optional(),
    author: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['draft', 'published', 'scheduled']).optional()
});
const sortSchema = zod_1.z.object({
    sortBy: zod_1.z.enum(['publishedAt', 'updatedAt', 'views', 'createdAt']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional()
});
class ArticleController {
    constructor() {
        this.articleService = ArticleService_1.default;
    }
    /**
     * Get homepage articles
     * @api GET /articles/homepage
     * @apiName API-ARTICLE-001
     * @apiGroup Articles
     * @srsRequirement REQ-PUB-03
     */
    async fetchHomepageArticles(req, res) {
        return tracer_1.tracer.startActiveSpan('controller.Article.fetchHomepageArticles', async (span) => {
            try {
                const homepageArticles = await this.articleService.fetchHomepageArticles();
                apiResponse_1.ApiResponse.success(res, {
                    message: 'Homepage articles fetched successfully',
                    data: homepageArticles
                });
                span.setStatus({ code: 1 }); // OK
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error fetching homepage articles', { error });
                apiResponse_1.ApiResponse.error(res, {
                    message: 'Failed to fetch homepage articles',
                    statusCode: 500
                });
            }
            finally {
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
    async fetchAllPublishedArticles(req, res) {
        return tracer_1.tracer.startActiveSpan('controller.Article.fetchAllPublishedArticles', async (span) => {
            try {
                // Validate query parameters
                const pagination = paginationSchema.parse(req.query);
                const filters = filterSchema.parse(req.query);
                const sort = sortSchema.parse(req.query);
                // Convert date filters if provided
                const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : undefined;
                const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : undefined;
                const filterOptions = {
                    ...filters,
                    tag: filters.tag,
                    status: filters.status,
                    dateFrom,
                    dateTo
                };
                const articles = await this.articleService.fetchAllPublishedArticles(pagination.page, pagination.limit, filterOptions, sort);
                apiResponse_1.ApiResponse.success(res, {
                    message: 'Published articles fetched successfully',
                    data: articles
                });
                span.setAttributes({
                    page: pagination.page,
                    limit: pagination.limit,
                    total: articles.total
                });
                span.setStatus({ code: 1 }); // OK
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    apiResponse_1.ApiResponse.error(res, {
                        message: 'Validation error',
                        errors: error,
                        statusCode: 400
                    });
                    span.setStatus({ code: 2, message: 'Validation error' }); // Invalid argument
                }
                else {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    span.setStatus({ code: 2, message: errorMessage });
                    logger_1.default.error('Error fetching published articles', { error });
                    apiResponse_1.ApiResponse.error(res, {
                        message: 'Failed to fetch published articles',
                        statusCode: 500
                    });
                }
            }
            finally {
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
    async getArticleById(req, res) {
        return tracer_1.tracer.startActiveSpan('controller.Article.getArticleById', async (span) => {
            try {
                const { id } = req.params;
                span.setAttribute('id', id);
                const article = await this.articleService.getArticleById(id);
                if (!article) {
                    apiResponse_1.ApiResponse.error(res, {
                        message: 'Article not found',
                        statusCode: 404
                    });
                    span.setStatus({ code: 2, message: 'Article not found' }); // NOT_FOUND
                    return;
                }
                if (article.status !== 'published') {
                    apiResponse_1.ApiResponse.error(res, {
                        message: 'Article is not published',
                        statusCode: 403
                    });
                    span.setStatus({ code: 2, message: 'Article not published' }); // Permission denied
                    return;
                }
                apiResponse_1.ApiResponse.success(res, {
                    message: 'Article fetched successfully',
                    data: article
                });
                span.setStatus({ code: 1 }); // OK
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error fetching article by ID', { error, id: req.params.id });
                apiResponse_1.ApiResponse.error(res, {
                    message: 'Failed to fetch article',
                    statusCode: 500
                });
            }
            finally {
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
    async getArticlesByTag(req, res) {
        return tracer_1.tracer.startActiveSpan('controller.Article.getArticlesByTag', async (span) => {
            try {
                const { tag } = req.params;
                const pagination = paginationSchema.parse(req.query);
                span.setAttribute('tag', tag);
                span.setAttribute('page', pagination.page);
                span.setAttribute('limit', pagination.limit);
                const articles = await this.articleService.getArticlesByTag(tag, pagination.page, pagination.limit);
                apiResponse_1.ApiResponse.success(res, {
                    message: `Articles with tag "${tag}" fetched successfully`,
                    data: articles
                });
                span.setStatus({ code: 1 }); // OK
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error fetching articles by tag', { error, tag: req.params.tag });
                apiResponse_1.ApiResponse.error(res, {
                    message: 'Failed to fetch articles by tag',
                    statusCode: 500
                });
            }
            finally {
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
    async searchArticles(req, res) {
        return tracer_1.tracer.startActiveSpan('controller.Article.searchArticles', async (span) => {
            try {
                const { q } = req.query;
                const pagination = paginationSchema.parse(req.query);
                if (!q) {
                    apiResponse_1.ApiResponse.error(res, {
                        message: 'Search query is required',
                        statusCode: 400
                    });
                    span.setStatus({ code: 2, message: 'Search query required' });
                    return;
                }
                span.setAttribute('query', q);
                span.setAttribute('page', pagination.page);
                span.setAttribute('limit', pagination.limit);
                const articles = await this.articleService.searchArticles(q, pagination.page, pagination.limit);
                apiResponse_1.ApiResponse.success(res, {
                    message: 'Search results fetched successfully',
                    data: articles
                });
                span.setStatus({ code: 1 }); // OK
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error searching articles', { error, query: req.query.q });
                apiResponse_1.ApiResponse.error(res, {
                    message: 'Failed to search articles',
                    statusCode: 500
                });
            }
            finally {
                span.end();
            }
        });
    }
    // Invalidate cache (admin only - protected route)
    async invalidateCache(req, res) {
        return tracer_1.tracer.startActiveSpan('controller.Article.invalidateCache', async (span) => {
            try {
                const { articleId } = req.query;
                await this.articleService.invalidateArticleCache(articleId);
                apiResponse_1.ApiResponse.success(res, {
                    message: articleId ? `Cache invalidated for article ${articleId}` : 'Article cache invalidated',
                    data: { invalidated: true }
                });
                span.setStatus({ code: 1 }); // OK
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error invalidating article cache', { error });
                apiResponse_1.ApiResponse.error(res, {
                    message: 'Failed to invalidate cache',
                    statusCode: 500
                });
            }
            finally {
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
    async getPopularTags(req, res) {
        return tracer_1.tracer.startActiveSpan('controller.Article.getPopularTags', async (span) => {
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
                apiResponse_1.ApiResponse.success(res, {
                    message: 'Popular tags fetched successfully',
                    data: popularTags
                });
                span.setStatus({ code: 1 }); // OK
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error fetching popular tags', { error });
                apiResponse_1.ApiResponse.error(res, {
                    message: 'Failed to fetch popular tags',
                    statusCode: 500
                });
            }
            finally {
                span.end();
            }
        });
    }
    /**
     * Create new article
     * @api POST /articles
     * @apiName API-ARTICLE-007
     */
    async createArticle(req, res) {
        return tracer_1.tracer.startActiveSpan('controller.Article.createArticle', async (span) => {
            try {
                // Basic validation - enhance with Zod later if needed
                const { title, content, status } = req.body;
                if (!title || !content) {
                    apiResponse_1.ApiResponse.error(res, {
                        message: 'Title and Content are required',
                        statusCode: 400
                    });
                    return;
                }
                const article = await this.articleService.createArticle(req.body);
                apiResponse_1.ApiResponse.success(res, {
                    message: 'Article created successfully',
                    data: article,
                    statusCode: 201
                });
            }
            catch (error) {
                logger_1.default.error('Error creating article', { error });
                apiResponse_1.ApiResponse.error(res, { message: 'Failed to create article', statusCode: 500 });
            }
            finally {
                span.end();
            }
        });
    }
    /**
   * Update article
   * @api PATCH /articles/:id
   * @apiName API-ARTICLE-008
   */
    async updateArticle(req, res) {
        return tracer_1.tracer.startActiveSpan('controller.Article.updateArticle', async (span) => {
            try {
                const { id } = req.params;
                const article = await this.articleService.updateArticle(id, req.body);
                apiResponse_1.ApiResponse.success(res, {
                    message: 'Article updated successfully',
                    data: article
                });
            }
            catch (error) {
                logger_1.default.error('Error updating article', { error });
                apiResponse_1.ApiResponse.error(res, { message: 'Failed to update article', statusCode: 500 });
            }
            finally {
                span.end();
            }
        });
    }
    /**
   * Delete article
   * @api DELETE /articles/:id
   * @apiName API-ARTICLE-009
   */
    async deleteArticle(req, res) {
        return tracer_1.tracer.startActiveSpan('controller.Article.deleteArticle', async (span) => {
            try {
                const { id } = req.params;
                await this.articleService.deleteArticle(id);
                apiResponse_1.ApiResponse.success(res, {
                    message: 'Article deleted successfully'
                });
            }
            catch (error) {
                logger_1.default.error('Error deleting article', { error });
                apiResponse_1.ApiResponse.error(res, { message: 'Failed to delete article', statusCode: 500 });
            }
            finally {
                span.end();
            }
        });
    }
    /**
     * Get article analytics
     * @api GET /articles/analytics
     * @apiName API-ARTICLE-010
     */
    async getAnalytics(req, res) {
        return tracer_1.tracer.startActiveSpan('controller.Article.getAnalytics', async (span) => {
            try {
                const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : new Date(new Date().setDate(new Date().getDate() - 30));
                const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : new Date();
                const analytics = await this.articleService.getAnalytics(dateFrom, dateTo);
                apiResponse_1.ApiResponse.success(res, {
                    message: 'Analytics fetched successfully',
                    data: analytics
                });
            }
            catch (error) {
                logger_1.default.error('Error fetching analytics', { error });
                apiResponse_1.ApiResponse.error(res, { message: 'Failed to fetch analytics', statusCode: 500 });
            }
            finally {
                span.end();
            }
        });
    }
}
exports.ArticleController = ArticleController;
exports.default = new ArticleController();
//# sourceMappingURL=ArticleController.js.map