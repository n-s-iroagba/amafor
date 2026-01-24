"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedsController = void 0;
const RssFeedSourceService_1 = require("../services/RssFeedSourceService");
const RssFeedFetcherService_1 = require("@services/RssFeedFetcherService");
const FeaturedNewsService_1 = require("../services/FeaturedNewsService");
class FeedsController {
    constructor() {
        /**
         * List feed sources
         * @api GET /feeds
         * @apiName API-FEED-002
         * @apiGroup RSS Feeds
         * @srsRequirement REQ-ADM-07
         */
        this.getFeedSources = async (req, res, next) => {
            try {
                const feedSources = await this.rssFeedSourceService.getAllFeedSources();
                res.json(feedSources);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Add RSS feed source
         * @api POST /feeds
         * @apiName API-FEED-001
         * @apiGroup RSS Feeds
         * @srsRequirement REQ-PUB-04, REQ-ADM-07
         */
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
                const feedSource = await this.rssFeedSourceService.getFeedSourceById(id);
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
        /**
         * Update feed source
         * @api PUT /feeds/:id
         * @apiName API-FEED-004
         * @apiGroup RSS Feeds
         * @srsRequirement REQ-ADM-07
         */
        this.updateFeedSource = async (req, res, next) => {
            try {
                const { id } = req.params;
                const feedSource = await this.rssFeedSourceService.updateFeedSource(id, req.body);
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
        /**
         * Delete feed source
         * @api DELETE /feeds/:id
         * @apiName API-FEED-005
         * @apiGroup RSS Feeds
         * @srsRequirement REQ-ADM-07
         */
        this.deleteFeedSource = async (req, res, next) => {
            try {
                const { id } = req.params;
                const success = await this.rssFeedSourceService.deleteFeedSource(id);
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
        this.featuredNewsService = new FeaturedNewsService_1.FeaturedNewsService();
        this.rssFeedFetcherService = new RssFeedFetcherService_1.RssFeedFetcherService();
    }
}
exports.FeedsController = FeedsController;
//# sourceMappingURL=FeedsController.js.map