"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RssFeedSourceService = void 0;
const index_1 = require("@repositories/index");
class RssFeedSourceService {
    constructor() {
        this.rssFeedSourceRepository = new index_1.RssFeedSourceRepository();
    }
    async getAllFeedSources() {
        return (await this.rssFeedSourceRepository.findAll());
    }
    async getFeedSourceById(id) {
        return await this.rssFeedSourceRepository.findById(id);
    }
    async createFeedSource(feedSourceData) {
        return await this.rssFeedSourceRepository.create(feedSourceData);
    }
    async updateFeedSource(id, feedSourceData) {
        return await this.rssFeedSourceRepository.update(id, feedSourceData);
    }
    async deleteFeedSource(id) {
        return await this.rssFeedSourceRepository.delete(id);
    }
    async updateFetchStatus(id, status) {
        await this.rssFeedSourceRepository.update(id, status);
    }
    async getFeedsNeedingUpdate(thresholdMinutes = 30) {
        return await this.rssFeedSourceRepository.getFeedsNeedingUpdate(thresholdMinutes);
    }
}
exports.RssFeedSourceService = RssFeedSourceService;
//# sourceMappingURL=RssFeedSourceService.js.map