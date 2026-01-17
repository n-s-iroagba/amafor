export declare class ContentController {
    private contentService;
    constructor();
    createArticle: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    publishArticle: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPublicNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getArticleDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteArticle: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=ContentController.d.ts.map