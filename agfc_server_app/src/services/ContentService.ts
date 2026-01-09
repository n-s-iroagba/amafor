import { ContentRepository } from '../repositories';
import { AuditService } from './AuditService';
import { Article, ArticleCreationAttributes } from '../models';
import { structuredLogger, tracer } from '../utils';

export class ContentService {
  private contentRepository: ContentRepository;
  private auditService: AuditService;

  constructor() {
    this.contentRepository = new ContentRepository();
    this.auditService = new AuditService();
  }

  public async createArticle(data: ArticleCreationAttributes, authorId: string): Promise<Article> {
    return tracer.startActiveSpan('service.ContentService.createArticle', async (span) => {
      try {
        const article = await this.contentRepository.create({ ...data, authorId, status: 'DRAFT' });
        
        structuredLogger.info('ARTICLE_CREATED', { articleId: article.id, authorId });
        return article;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async publishArticle(id: string, adminId: string): Promise<Article> {
    return tracer.startActiveSpan('service.ContentService.publishArticle', async (span) => {
      try {
        const [affected, updated] = await this.contentRepository.update(id, { 
          status: 'PUBLISHED', 
          publishedAt: new Date() 
        });

        if (!affected) throw new Error('Article not found');

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
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async getPublicNews(query: any): Promise<Article[]> {
    return tracer.startActiveSpan('service.ContentService.getPublicNews', async (span) => {
      try {
        return await this.contentRepository.findAll({ ...query, where: { status: 'PUBLISHED' } });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async getArticleDetails(id: string): Promise<Article | null> {
    return tracer.startActiveSpan('service.ContentService.getArticleDetails', async (span) => {
      try {
        return await this.contentRepository.findById(id);
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async deleteArticle(id: string, adminId: string): Promise<void> {
    return tracer.startActiveSpan('service.ContentService.deleteArticle', async (span) => {
      try {
        const article = await this.contentRepository.findById(id);
        if (!article) throw new Error('Article not found');

        await this.contentRepository.delete(id);

        structuredLogger.business('ARTICLE_DELETED', 0, adminId, { articleId: id, title: article.title });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}