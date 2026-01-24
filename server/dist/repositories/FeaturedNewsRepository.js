"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturedNewsRepository = void 0;
const FeaturedNews_1 = require("../models/FeaturedNews");
const BaseRepository_1 = require("./BaseRepository");
class FeaturedNewsRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(FeaturedNews_1.FeaturedNews);
    }
    async createOrUpdateNews(data) {
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
    async findBySourceId(rssFeedSourceId) {
        return await this.findAll({
            where: { rssFeedSourceId },
            order: [['publishedAt', 'DESC']]
        });
    }
    async findRecentNews(limit = 5) {
        return await this.findAll({
            order: [['publishedAt', 'DESC']],
            limit
        });
    }
}
exports.FeaturedNewsRepository = FeaturedNewsRepository;
//# sourceMappingURL=FeaturedNewsRepository.js.map