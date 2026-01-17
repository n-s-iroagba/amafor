"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RssFeedSourceService = void 0;
// services/RssFeedSourceService.ts
const RssFeedSourceRepository_1 = require("../repositories/RssFeedSourceRepository");
class RssFeedSourceService {
    constructor() {
        this.rssFeedSourceRepository = new RssFeedSourceRepository_1.RssFeedSourceRepository();
    }
    async getAllFeedSources() {
        return (await this.rssFeedSourceRepository.findAll());
    }
    async getFeedSourceById(id) {
        return await this.rssFeedSourceRepository.findById(id);
    }
    async getFeedSourceByUrl(feedUrl) {
        return await this.rssFeedSourceRepository.findByUrl(feedUrl);
    }
    async createFeedSource(feedSourceData) {
        return await this.rssFeedSourceRepository.create(feedSourceData);
    }
    async updateFeedSource(id, feedSourceData) {
        return await this.rssFeedSourceRepository.updateById(id, feedSourceData);
    }
    async deleteFeedSource(id) {
        return await this.rssFeedSourceRepository.deleteById(id);
    }
    async getFeedsByCategory(category) {
        return await this.rssFeedSourceRepository.findByCategory(category);
    }
    async updateFetchStatus(id, status) {
        await this.rssFeedSourceRepository.updateFetchStatus(id, status);
    }
    async getFeedsNeedingUpdate(thresholdMinutes = 30) {
        return await this.rssFeedSourceRepository.getFeedsNeedingUpdate(thresholdMinutes);
    }
}
exports.RssFeedSourceService = RssFeedSourceService;
//# sourceMappingURL=RssFeedSourceService.js.map