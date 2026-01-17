import { Request, Response, NextFunction } from 'express';
import { LeagueStatisticsService } from '../services/leagueStatistics.service';
export declare class LeagueStatisticsController {
    private leagueStatisticsService;
    constructor(leagueStatisticsService?: LeagueStatisticsService);
    createStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
    getLeagueStandings(req: Request, res: Response, next: NextFunction): Promise<void>;
    getStatisticsById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTeamStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateMatchResult(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTopScorers(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTopDefenses(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFormTable(req: Request, res: Response, next: NextFunction): Promise<void>;
    getHomeAwayStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    getLeagueSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const leagueStatisticsController: LeagueStatisticsController;
//# sourceMappingURL=LeagueStatisticsController.d.ts.map