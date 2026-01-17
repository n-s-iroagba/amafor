export declare class LineupController {
    private lineupService;
    constructor();
    createLineupPlayer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLineupPlayer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLineupByFixture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getStartersByFixture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSubstitutesByFixture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateLineupPlayer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteLineupPlayer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    batchUpdateLineup: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=LineupController.d.ts.map