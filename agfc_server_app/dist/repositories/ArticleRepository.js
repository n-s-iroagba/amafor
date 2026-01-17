"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleRepository = void 0;
const sequelize_1 = require("sequelize");
const Article_1 = require("@models/Article");
const BaseRepository_1 = require("./BaseRepository");
const AuditLogRepository_1 = require("./AuditLogRepository");
const logger_1 = __importDefault(require("@utils/logger"));
const tracer_1 = require("@utils/tracer");
class ArticleRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Article_1.Article);
        this.auditLogRepository = new AuditLogRepository_1.AuditLogRepository();
    }
    async createWithAudit(data, auditData) {
        return tracer_1.tracer.startActiveSpan('repository.Article.createWithAudit', async (span) => {
            const transaction = await Article_1.Article.sequelize.transaction();
            try {
                span.setAttribute('title', data.title);
                // Calculate read time
                const readTime = this.calculateReadTime(data.content);
                const articleData = {
                    ...data,
                    readTime,
                    authorId: auditData.userId
                };
                const article = await this.create(articleData, { transaction });
                // Create audit log
                await this.auditLogRepository.create({
                    userId: auditData.userId,
                    userEmail: auditData.userEmail,
                    userType: auditData.userType,
                    action: 'create',
                    entityType: 'article',
                    entityId: article.id,
                    entityName: article.title,
                    newValue: article.toJSON(),
                    changes: Object.keys(data).map(key => ({
                        field: key,
                        newValue: data[key]
                    })),
                    ipAddress: auditData.ipAddress,
                    userAgent: auditData.userAgent
                }, { transaction });
                await transaction.commit();
                logger_1.default.info(`Article created with audit: ${article.id}`);
                return article;
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error creating article with audit', { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updateWithAudit(id, data, auditData) {
        return tracer_1.tracer.startActiveSpan('repository.Article.updateWithAudit', async (span) => {
            const transaction = await Article_1.Article.sequelize.transaction();
            try {
                span.setAttribute('id', id);
                const article = await this.findById(id, { transaction });
                if (!article) {
                    throw new Error('Article not found');
                }
                const oldValue = article.toJSON();
                // Calculate read time if content changed
                if (data.content) {
                    data.readTime = this.calculateReadTime(data.content);
                }
                // Update article
                await article.update(data, { transaction });
                // Get changes
                const changes = Object.keys(data)
                    .filter(key => article.get(key) !== oldValue[key])
                    .map(key => ({
                    field: key,
                    oldValue: oldValue[key],
                    newValue: data[key]
                }));
                // Create audit log
                await this.auditLogRepository.create({
                    userId: auditData.userId,
                    userEmail: auditData.userEmail,
                    userType: auditData.userType,
                    action: 'update',
                    entityType: 'article',
                    entityId: id,
                    entityName: article.title,
                    oldValue,
                    newValue: article.toJSON(),
                    changes,
                    ipAddress: auditData.ipAddress,
                    userAgent: auditData.userAgent
                }, { transaction });
                await transaction.commit();
                logger_1.default.info(`Article updated with audit: ${id}`);
                return article;
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error updating article with audit: ${id}`, { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async publish(id, auditData, publishAt) {
        return tracer_1.tracer.startActiveSpan('repository.Article.publish', async (span) => {
            const transaction = await Article_1.Article.sequelize.transaction();
            try {
                span.setAttribute('id', id);
                publishAt && span.setAttribute('publishAt', publishAt?.toISOString());
                const article = await this.findById(id, { transaction });
                if (!article) {
                    throw new Error('Article not found');
                }
                const oldValue = article.toJSON();
                const updateData = {
                    status: publishAt ? Article_1.ArticleStatus.SCHEDULED : Article_1.ArticleStatus.PUBLISHED
                };
                if (publishAt) {
                    updateData.scheduledPublishAt = publishAt;
                }
                else {
                    updateData.publishedAt = new Date();
                }
                await article.update(updateData, { transaction });
                // Create audit log
                await this.auditLogRepository.create({
                    userId: auditData.userId,
                    userEmail: auditData.userEmail,
                    userType: auditData.userType,
                    action: 'update',
                    entityType: 'article',
                    entityId: id,
                    entityName: article.title,
                    oldValue,
                    newValue: article.toJSON(),
                    changes: [
                        {
                            field: 'status',
                            oldValue: oldValue.status,
                            newValue: updateData.status
                        },
                        {
                            field: publishAt ? 'scheduledPublishAt' : 'publishedAt',
                            oldValue: oldValue[publishAt ? 'scheduledPublishAt' : 'publishedAt'],
                            newValue: publishAt || new Date()
                        }
                    ],
                    ipAddress: auditData.ipAddress,
                    userAgent: auditData.userAgent
                }, { transaction });
                await transaction.commit();
                logger_1.default.info(`Article published: ${id}`, { publishAt });
                return article;
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error publishing article: ${id}`, { error, publishAt });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async unpublish(id, auditData) {
        return tracer_1.tracer.startActiveSpan('repository.Article.unpublish', async (span) => {
            try {
                span.setAttribute('id', id);
                const article = await this.updateWithAudit(id, {
                    status: Article_1.ArticleStatus.DRAFT,
                    publishedAt: undefined
                }, auditData);
                logger_1.default.info(`Article unpublished: ${id}`);
                return article;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error unpublishing article: ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async incrementViewCount(id) {
        return tracer_1.tracer.startActiveSpan('repository.Article.incrementViewCount', async (span) => {
            try {
                span.setAttribute('id', id);
                await this.model.update({ viewCount: this.model.sequelize.literal('viewCount + 1') }, { where: { id } });
                logger_1.default.debug(`Article view count incremented: ${id}`);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error incrementing article view count: ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findPublished(filters = {}, sort = {}, pagination) {
        return tracer_1.tracer.startActiveSpan('repository.Article.findPublished', async (span) => {
            try {
                span.setAttributes({
                    filters: JSON.stringify(filters),
                    sort: JSON.stringify(sort)
                });
                const where = {
                    status: Article_1.ArticleStatus.PUBLISHED
                };
                // Apply filters
                if (filters.tag) {
                    where.tags = { [sequelize_1.Op.contains]: [filters.tag] };
                }
                if (filters.author) {
                    where.authorId = filters.author;
                }
                if (filters.dateFrom || filters.dateTo) {
                    where.publishedAt = {};
                    if (filters.dateFrom) {
                        where.publishedAt[sequelize_1.Op.gte] = filters.dateFrom;
                    }
                    if (filters.dateTo) {
                        where.publishedAt[sequelize_1.Op.lte] = filters.dateTo;
                    }
                }
                if (filters.search) {
                    where[sequelize_1.Op.or] = [
                        { title: { [sequelize_1.Op.like]: `%${filters.search}%` } },
                        { excerpt: { [sequelize_1.Op.like]: `%${filters.search}%` } },
                        { content: { [sequelize_1.Op.like]: `%${filters.search}%` } }
                    ];
                }
                // Apply sorting
                const order = [];
                if (sort.sortBy) {
                    order.push([sort.sortBy, sort.sortOrder?.toUpperCase() || 'DESC']);
                }
                else {
                    order.push(['publishedAt', 'DESC']);
                }
                const options = {
                    where,
                    order,
                    include: ['author']
                };
                if (pagination) {
                    return await this.paginate(pagination.page, pagination.limit, options);
                }
                else {
                    const data = await this.findAll(options);
                    const total = await this.count({ where });
                    return {
                        data,
                        total,
                        page: 1,
                        totalPages: 1
                    };
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding published articles', { error, filters, sort });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findDrafts(pagination) {
        return tracer_1.tracer.startActiveSpan('repository.Article.findDrafts', async (span) => {
            try {
                return await this.paginate(pagination?.page || 1, pagination?.limit || 20, {
                    where: { status: Article_1.ArticleStatus.DRAFT },
                    order: [['updatedAt', 'DESC']],
                    include: ['author']
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding draft articles', { error, pagination });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findScheduled() {
        return tracer_1.tracer.startActiveSpan('repository.Article.findScheduled', async (span) => {
            try {
                const articles = await this.findAll({
                    where: {
                        status: Article_1.ArticleStatus.SCHEDULED,
                        scheduledPublishAt: { [sequelize_1.Op.lte]: new Date() }
                    }
                });
                span.setAttribute('count', articles.length);
                return articles;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding scheduled articles', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async processScheduledArticles() {
        return tracer_1.tracer.startActiveSpan('repository.Article.processScheduledArticles', async (span) => {
            const transaction = await Article_1.Article.sequelize.transaction();
            try {
                const articles = await this.findScheduled();
                for (const article of articles) {
                    await article.update({
                        status: Article_1.ArticleStatus.PUBLISHED,
                        publishedAt: new Date(),
                        scheduledPublishAt: undefined
                    }, { transaction });
                    logger_1.default.info(`Scheduled article published: ${article.id}`);
                }
                await transaction.commit();
                span.setAttribute('processed', articles.length);
                logger_1.default.info(`Processed ${articles.length} scheduled articles`);
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error processing scheduled articles', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getTopArticles(limit = 10, period = 'all') {
        return tracer_1.tracer.startActiveSpan('repository.Article.getTopArticles', async (span) => {
            try {
                span.setAttributes({
                    limit,
                    period
                });
                const where = { status: Article_1.ArticleStatus.PUBLISHED };
                if (period !== 'all') {
                    const date = new Date();
                    switch (period) {
                        case 'day':
                            date.setDate(date.getDate() - 1);
                            break;
                        case 'week':
                            date.setDate(date.getDate() - 7);
                            break;
                        case 'month':
                            date.setMonth(date.getMonth() - 1);
                            break;
                    }
                    where.publishedAt = { [sequelize_1.Op.gte]: date };
                }
                const articles = await this.findAll({
                    where,
                    order: [['viewCount', 'DESC']],
                    limit,
                    include: ['author']
                });
                span.setAttribute('count', articles.length);
                return articles;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting top articles', { error, limit, period });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getAnalytics(dateFrom, dateTo) {
        return tracer_1.tracer.startActiveSpan('repository.Article.getAnalytics', async (span) => {
            try {
                span.setAttributes({
                    dateFrom: dateFrom.toISOString(),
                    dateTo: dateTo.toISOString()
                });
                // This is a simplified version - in production, you'd use a proper analytics service
                const [totalViews, articles] = await Promise.all([
                    this.model.sum('viewCount', {
                        where: {
                            status: Article_1.ArticleStatus.PUBLISHED,
                            publishedAt: { [sequelize_1.Op.between]: [dateFrom, dateTo] }
                        }
                    }),
                    this.findAll({
                        where: {
                            status: Article_1.ArticleStatus.PUBLISHED,
                            publishedAt: { [sequelize_1.Op.between]: [dateFrom, dateTo] }
                        },
                        order: [['viewCount', 'DESC']],
                        limit: 10,
                        include: ['author']
                    })
                ]);
                // Mock data for demonstration
                const analytics = {
                    totalViews: totalViews || 0,
                    uniqueVisitors: Math.floor((totalViews || 0) * 0.7),
                    averageTimeOnPage: 2.5,
                    bounceRate: 45,
                    topArticles: articles.map(article => ({
                        id: article.id,
                        title: article.title,
                        views: article.viewCount,
                    })),
                    viewsByDay: this.generateViewsByDay(dateFrom, dateTo, totalViews || 0)
                };
                span.setAttribute('totalViews', analytics.totalViews);
                return analytics;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting article analytics', { error, dateFrom, dateTo });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    calculateReadTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    }
    generateViewsByDay(dateFrom, dateTo, totalViews) {
        const days = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
        const viewsByDay = [];
        for (let i = 0; i <= days; i++) {
            const date = new Date(dateFrom);
            date.setDate(date.getDate() + i);
            // Generate random views for demonstration
            const views = Math.floor(totalViews / (days + 1) * (0.8 + Math.random() * 0.4));
            viewsByDay.push({
                date: date.toISOString().split('T')[0],
                views
            });
        }
        return viewsByDay;
    }
}
exports.ArticleRepository = ArticleRepository;
//# sourceMappingURL=ArticleRepository.js.map