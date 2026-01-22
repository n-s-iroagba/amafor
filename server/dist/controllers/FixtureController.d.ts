import { Request, Response, NextFunction } from 'express';
export declare class FixtureController {
    private matchService;
    constructor();
    createFixture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateResult: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUpcomingFixturees: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLeagueTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listAllFixturees: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=FixtureController.d.ts.map