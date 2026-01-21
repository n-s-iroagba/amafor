import { ThirdPartyArticle, ThirdPartyArticleCreationAttributes } from '../models/ThirdPartyArticle';
import { BaseRepository } from './BaseRepository';

export class ThirdPartyArticleRepository extends BaseRepository<ThirdPartyArticle> {
    constructor() {
        super(ThirdPartyArticle);
    }

    async createOrUpdateArticle(data: ThirdPartyArticleCreationAttributes): Promise<{ article: ThirdPartyArticle; created: boolean }> {
        const [article, created] = await this.model.findOrCreate({
            where: {
                rssFeedSourceId: data.rssFeedSourceId,
                originalId: data.originalId
            },
            defaults: data
        });

        if (!created) {
            // Update existing article
            await article.update({
                title: data.title,
                summary: data.summary,
                content: data.content,
                publishedAt: data.publishedAt,
                thumbnailUrl: data.thumbnailUrl
            });
        }

        return { article, created };
    }

    async findBySourceId(rssFeedSourceId: number): Promise<ThirdPartyArticle[]> {
        return await this.findAll({
            where: { rssFeedSourceId },
            order: [['publishedAt', 'DESC']]
        });
    }

    async findRecentArticles(limit: number = 50): Promise<ThirdPartyArticle[]> {
        return await this.findAll({
            order: [['publishedAt', 'DESC']],
            limit
        });
    }
}
