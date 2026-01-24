import { Request, Response, NextFunction } from 'express';
export declare class LeagueController {
    private leagueService;
    constructor();
    listLeagues: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLeague: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createLeague: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateLeague: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteLeague: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLeaguesWithTables: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLeagueTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=LeagueController.d.ts.map