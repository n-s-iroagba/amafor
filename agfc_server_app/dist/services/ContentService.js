"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
const repositories_1 = require("../repositories");
const AuditService_1 = require("./AuditService");
const utils_1 = require("../utils");
class ContentService {
    constructor() {
        this.contentRepository = new repositories_1.ContentRepository();
        this.auditService = new AuditService_1.AuditService();
    }
    async createArticle(data, authorId) {
        return utils_1.tracer.startActiveSpan('service.ContentService.createArticle', async (span) => {
            try {
                const article = await this.contentRepository.create({ ...data, authorId, status: 'DRAFT' });
                utils_1.structuredLogger.info('ARTICLE_CREATED', { articleId: article.id, authorId });
                return article;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async publishArticle(id, adminId) {
        return utils_1.tracer.startActiveSpan('service.ContentService.publishArticle', async (span) => {
            try {
                const [affected, updated] = await this.contentRepository.update(id, {
                    status: 'PUBLISHED',
                    publishedAt: new Date()
                });
                if (!affected)
                    throw new Error('Article not found');
                await this.auditService.logAction({
                    userId: adminId,
                    userEmail: 'admin',
                    userType: 'admin',
                    action: 'PUBLISH',
                    entityType: 'ARTICLE',
                    entityId: id,
                    entityName: updated[0].title,
                    changes: [{ field: 'status', newValue: 'PUBLISHED' }],
                    ipAddress: '0.0.0.0',
                    metadata: {}
                });
                return updated[0];
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getPublicNews(query) {
        return utils_1.tracer.startActiveSpan('service.ContentService.getPublicNews', async (span) => {
            try {
                return await this.contentRepository.findAll({ ...query, where: { status: 'PUBLISHED' } });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getArticleDetails(id) {
        return utils_1.tracer.startActiveSpan('service.ContentService.getArticleDetails', async (span) => {
            try {
                return await this.contentRepository.findById(id);
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async deleteArticle(id, adminId) {
        return utils_1.tracer.startActiveSpan('service.ContentService.deleteArticle', async (span) => {
            try {
                const article = await this.contentRepository.findById(id);
                if (!article)
                    throw new Error('Article not found');
                await this.contentRepository.delete(id);
                utils_1.structuredLogger.business('ARTICLE_DELETED', 0, adminId, { articleId: id, title: article.title });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.ContentService = ContentService;
//# sourceMappingURL=ContentService.js.map