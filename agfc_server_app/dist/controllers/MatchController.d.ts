export declare class MatchController {
    private matchService;
    constructor();
    createFixture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateResult: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUpcomingMatches: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLeagueTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listAllMatches: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=MatchController.d.ts.map