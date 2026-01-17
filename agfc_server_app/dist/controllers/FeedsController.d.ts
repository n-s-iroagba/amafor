export declare class FeedsController {
    private rssFeedSourceService;
    private thirdPartyArticleService;
    private rssFeedFetcherService;
    constructor();
    getFeedSources: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createFeedSource: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getFeedSource: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateFeedSource: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteFeedSource: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=FeedsController.d.ts.map