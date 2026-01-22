import { NextFunction, Request, Response } from 'express';
export declare class FeedsController {
    private rssFeedSourceService;
    private featuredNewsService;
    private rssFeedFetcherService;
    constructor();
    /**
     * List feed sources
     * @api GET /feeds
     * @apiName API-FEED-002
     * @apiGroup RSS Feeds
     * @srsRequirement REQ-ADM-07
     */
    getFeedSources: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Add RSS feed source
     * @api POST /feeds
     * @apiName API-FEED-001
     * @apiGroup RSS Feeds
     * @srsRequirement REQ-PUB-04, REQ-ADM-07
     */
    createFeedSource: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getFeedSource: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update feed source
     * @api PUT /feeds/:id
     * @apiName API-FEED-004
     * @apiGroup RSS Feeds
     * @srsRequirement REQ-ADM-07
     */
    updateFeedSource: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Delete feed source
     * @api DELETE /feeds/:id
     * @apiName API-FEED-005
     * @apiGroup RSS Feeds
     * @srsRequirement REQ-ADM-07
     */
    deleteFeedSource: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=FeedsController.d.ts.map