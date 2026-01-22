import { FeaturedNews, FeaturedNewsCreationAttributes } from '../models/FeaturedNews';
import { BaseRepository } from './BaseRepository';

export class FeaturedNewsRepository extends BaseRepository<FeaturedNews> {
    constructor() {
        super(FeaturedNews);
    }

    async createOrUpdateNews(data: FeaturedNewsCreationAttributes): Promise<{ article: FeaturedNews; created: boolean }> {
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

    async findBySourceId(rssFeedSourceId: number): Promise<FeaturedNews[]> {
        return await this.findAll({
            where: { rssFeedSourceId },
            order: [['publishedAt', 'DESC']]
        });
    }

    async findRecentNews(limit: number = 5): Promise<FeaturedNews[]> {
        return await this.findAll({
            order: [['publishedAt', 'DESC']],
            limit
        });
    }
}
