import { FindOptions, Op, Transaction } from 'sequelize';
import { Article, ArticleAttributes, ArticleCreationAttributes, ArticleStatus, ArticleTag } from '@models/Article';
import { BaseRepository } from './BaseRepository';
import { AuditLogRepository } from './AuditLogRepository';
import { logger } from '@utils/logger';
import { tracer } from '@utils/tracer';

export interface ArticleFilterOptions {
  tag?: ArticleTag;
  author?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  status?: ArticleStatus;
}

export interface ArticleSortOptions {
  sortBy?: 'publishedAt' | 'updatedAt' | 'views' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export class ArticleRepository extends BaseRepository<Article> {
  private auditLogRepository: AuditLogRepository;

  constructor() {
    super(Article);
    this.auditLogRepository = new AuditLogRepository();
  }

  async createWithAudit(data: ArticleCreationAttributes, auditData: any): Promise<Article> {
    return tracer.startActiveSpan('repository.Article.createWithAudit', async (span) => {
      const transaction = await Article.sequelize!.transaction();
      
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
            newValue: data[key as keyof ArticleCreationAttributes]
          })),
          ipAddress: auditData.ipAddress,
          userAgent: auditData.userAgent
        }, { transaction });

        await transaction.commit();
        logger.info(`Article created with audit: ${article.id}`);
        return article;
      } catch (error) {
        await transaction.rollback();
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error creating article with audit', { error, data });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async updateWithAudit(id: string, data: Partial<ArticleAttributes>, auditData: any): Promise<Article | null> {
    return tracer.startActiveSpan('repository.Article.updateWithAudit', async (span) => {
      const transaction = await Article.sequelize!.transaction();
      
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
            newValue: data[key as keyof ArticleAttributes]
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
        logger.info(`Article updated with audit: ${id}`);
        return article;
      } catch (error) {
        await transaction.rollback();
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error updating article with audit: ${id}`, { error, data });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async publish(id: string, publishAt?: Date, auditData: any): Promise<Article | null> {
    return tracer.startActiveSpan('repository.Article.publish', async (span) => {
      const transaction = await Article.sequelize!.transaction();
      
      try {
        span.setAttribute('id', id);
        span.setAttribute('publishAt', publishAt?.toISOString());
        
        const article = await this.findById(id, { transaction });
        if (!article) {
          throw new Error('Article not found');
        }

        const oldValue = article.toJSON();
        
        const updateData: any = {
          status: publishAt ? ArticleStatus.SCHEDULED : ArticleStatus.PUBLISHED
        };

        if (publishAt) {
          updateData.scheduledPublishAt = publishAt;
        } else {
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
        logger.info(`Article published: ${id}`, { publishAt });
        return article;
      } catch (error) {
        await transaction.rollback();
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error publishing article: ${id}`, { error, publishAt });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async unpublish(id: string, auditData: any): Promise<Article | null> {
    return tracer.startActiveSpan('repository.Article.unpublish', async (span) => {
      try {
        span.setAttribute('id', id);
        
        const article = await this.updateWithAudit(
          id,
          {
            status: ArticleStatus.DRAFT,
            publishedAt: null
          },
          auditData
        );

        logger.info(`Article unpublished: ${id}`);
        return article;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error unpublishing article: ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async incrementViewCount(id: string): Promise<void> {
    return tracer.startActiveSpan('repository.Article.incrementViewCount', async (span) => {
      try {
        span.setAttribute('id', id);
        
        await this.model.update(
          { viewCount: this.model.sequelize!.literal('viewCount + 1') },
          { where: { id } }
        );

        logger.debug(`Article view count incremented: ${id}`);
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error incrementing article view count: ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findPublished(filters: ArticleFilterOptions = {}, sort: ArticleSortOptions = {}, pagination?: { page: number; limit: number }): Promise<{ data: Article[]; total: number; page: number; totalPages: number }> {
    return tracer.startActiveSpan('repository.Article.findPublished', async (span) => {
      try {
        span.setAttributes({
          filters: JSON.stringify(filters),
          sort: JSON.stringify(sort)
        });

        const where: any = {
          status: ArticleStatus.PUBLISHED
        };
        
        // Apply filters
        if (filters.tag) {
          where.tags = { [Op.contains]: [filters.tag] };
        }
        
        if (filters.author) {
          where.authorId = filters.author;
        }
        
        if (filters.dateFrom || filters.dateTo) {
          where.publishedAt = {};
          if (filters.dateFrom) {
            where.publishedAt[Op.gte] = filters.dateFrom;
          }
          if (filters.dateTo) {
            where.publishedAt[Op.lte] = filters.dateTo;
          }
        }
        
        if (filters.search) {
          where[Op.or] = [
            { title: { [Op.like]: `%${filters.search}%` } },
            { excerpt: { [Op.like]: `%${filters.search}%` } },
            { content: { [Op.like]: `%${filters.search}%` } }
          ];
        }

        // Apply sorting
        const order: any[] = [];
        if (sort.sortBy) {
          order.push([sort.sortBy, sort.sortOrder?.toUpperCase() || 'DESC']);
        } else {
          order.push(['publishedAt', 'DESC']);
        }

        const options: FindOptions = {
          where,
          order,
          include: ['author']
        };

        if (pagination) {
          return await this.paginate(pagination.page, pagination.limit, options);
        } else {
          const data = await this.findAll(options);
          const total = await this.count({ where });
          return {
            data,
            total,
            page: 1,
            totalPages: 1
          };
        }
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error finding published articles', { error, filters, sort });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findDrafts(pagination?: { page: number; limit: number }): Promise<{ data: Article[]; total: number; page: number; totalPages: number }> {
    return tracer.startActiveSpan('repository.Article.findDrafts', async (span) => {
      try {
        return await this.paginate(
          pagination?.page || 1,
          pagination?.limit || 20,
          {
            where: { status: ArticleStatus.DRAFT },
            order: [['updatedAt', 'DESC']],
            include: ['author']
          }
        );
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error finding draft articles', { error, pagination });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findScheduled(): Promise<Article[]> {
    return tracer.startActiveSpan('repository.Article.findScheduled', async (span) => {
      try {
        const articles = await this.findAll({
          where: {
            status: ArticleStatus.SCHEDULED,
            scheduledPublishAt: { [Op.lte]: new Date() }
          }
        });

        span.setAttribute('count', articles.length);
        return articles;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error finding scheduled articles', { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async processScheduledArticles(): Promise<void> {
    return tracer.startActiveSpan('repository.Article.processScheduledArticles', async (span) => {
      const transaction = await Article.sequelize!.transaction();
      
      try {
        const articles = await this.findScheduled();
        
        for (const article of articles) {
          await article.update(
            {
              status: ArticleStatus.PUBLISHED,
              publishedAt: new Date(),
              scheduledPublishAt: null
            },
            { transaction }
          );
          
          logger.info(`Scheduled article published: ${article.id}`);
        }

        await transaction.commit();
        span.setAttribute('processed', articles.length);
        logger.info(`Processed ${articles.length} scheduled articles`);
      } catch (error) {
        await transaction.rollback();
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error processing scheduled articles', { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getTopArticles(limit: number = 10, period: 'day' | 'week' | 'month' | 'all' = 'all'): Promise<Article[]> {
    return tracer.startActiveSpan('repository.Article.getTopArticles', async (span) => {
      try {
        span.setAttributes({
          limit,
          period
        });

        const where: any = { status: ArticleStatus.PUBLISHED };
        
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
          where.publishedAt = { [Op.gte]: date };
        }

        const articles = await this.findAll({
          where,
          order: [['viewCount', 'DESC']],
          limit,
          include: ['author']
        });

        span.setAttribute('count', articles.length);
        return articles;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error getting top articles', { error, limit, period });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getAnalytics(dateFrom: Date, dateTo: Date): Promise<{
    totalViews: number;
    uniqueVisitors: number;
    averageTimeOnPage: number;
    bounceRate: number;
    topArticles: any[];
    viewsByDay: any[];
  }> {
    return tracer.startActiveSpan('repository.Article.getAnalytics', async (span) => {
      try {
        span.setAttributes({
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString()
        });

        // This is a simplified version - in production, you'd use a proper analytics service
        const [totalViews, articles] = await Promise.all([
          this.model.sum('viewCount', {
            where: {
              status: ArticleStatus.PUBLISHED,
              publishedAt: { [Op.between]: [dateFrom, dateTo] }
            }
          }),
          this.findAll({
            where: {
              status: ArticleStatus.PUBLISHED,
              publishedAt: { [Op.between]: [dateFrom, dateTo] }
            },
            order: [['viewCount', 'DESC']],
            limit: 10,
            include: ['author']
          })
        ]);

        // Mock data for demonstration
        const analytics = {
          totalViews: totalViews || 0,
          uniqueVisitors: Math.floor((totalViews || 0) * 0.7), // 70% unique visitors
          averageTimeOnPage: 2.5, // minutes
          bounceRate: 45, // percentage
          topArticles: articles.map(article => ({
            id: article.id,
            title: article.title,
            views: article.viewCount,
            author: article.author?.firstName + ' ' + article.author?.lastName
          })),
          viewsByDay: this.generateViewsByDay(dateFrom, dateTo, totalViews || 0)
        };

        span.setAttribute('totalViews', analytics.totalViews);
        return analytics;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error getting article analytics', { error, dateFrom, dateTo });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  private generateViewsByDay(dateFrom: Date, dateTo: Date, totalViews: number): any[] {
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