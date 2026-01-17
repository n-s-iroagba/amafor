"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedsController = void 0;
const RssFeedSourceService_1 = require("../services/RssFeedSourceService");
const ThirdPartyArticleService_1 = require("../services/ThirdPartyArticleService");
const RssFeedFetcherService_1 = require("../services/RssFeedFetcherService");
class FeedsController {
    constructor() {
        // Feed Source methods
        this.getFeedSources = async (req, res, next) => {
            try {
                const feedSources = await this.rssFeedSourceService.getAllFeedSources();
                res.json(feedSources);
            }
            catch (error) {
                next(error);
            }
        };
        this.createFeedSource = async (req, res, next) => {
            try {
                const feedSource = await this.rssFeedSourceService.createFeedSource(req.body);
                res.status(201).json(feedSource);
            }
            catch (error) {
                next(error);
            }
        };
        this.getFeedSource = async (req, res, next) => {
            try {
                const { id } = req.params;
                const feedSource = await this.rssFeedSourceService.getFeedSourceById(parseInt(id));
                if (!feedSource) {
                    res.status(404).json({ error: 'Feed source not found' });
                    return;
                }
                res.json(feedSource);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateFeedSource = async (req, res, next) => {
            try {
                const { id } = req.params;
                const feedSource = await this.rssFeedSourceService.updateFeedSource(parseInt(id), req.body);
                if (!feedSource) {
                    res.status(404).json({ error: 'Feed source not found' });
                    return;
                }
                res.json(feedSource);
            }
            catch (error) {
                res.status(400).json({ error });
            }
        };
        this.deleteFeedSource = async (req, res, next) => {
            try {
                const { id } = req.params;
                const success = await this.rssFeedSourceService.deleteFeedSource(parseInt(id));
                if (!success) {
                    res.status(404).json({ error: 'Feed source not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.rssFeedSourceService = new RssFeedSourceService_1.RssFeedSourceService();
        this.thirdPartyArticleService = new ThirdPartyArticleService_1.ThirdPartyArticleService();
        this.rssFeedFetcherService = new RssFeedFetcherService_1.RssFeedFetcherService();
    }
}
exports.FeedsController = FeedsController;
//# sourceMappingURL=FeedsController.js.map