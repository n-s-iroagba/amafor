import { LeagueStatisticsService } from '@services/LeagueStatisticsService';
import { Request, Response, NextFunction } from 'express';
export declare class LeagueStatisticsController {
    private leagueStatisticsService;
    constructor(leagueStatisticsService?: LeagueStatisticsService);
    /**
     * Create league statistics
     * @api POST /club-league-stats
     * @apiName API-LEAGUE-001
     * @apiGroup League Statistics
     * @srsRequirement REQ-ADM-02
     */
    createStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get all statistics for a league
     * @api GET /club-league-stats/league/:leagueId
     * @apiName API-LEAGUE-002
     * @apiGroup League Statistics
     * @srsRequirement REQ-PUB-06
     */
    getAllStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get league standings
     * @api GET /club-league-stats/league/:leagueId/standings
     * @apiName API-LEAGUE-003
     * @apiGroup League Statistics
     * @srsRequirement REQ-PUB-06
     */
    getLeagueStandings(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get statistics by ID
     * @api GET /club-league-stats/:id
     * @apiName API-LEAGUE-004
     * @apiGroup League Statistics
     * @srsRequirement REQ-PUB-06
     */
    getStatisticsById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get team statistics
     * @api GET /club-league-stats/league/:leagueId/team/:team
     * @apiName API-LEAGUE-005
     * @apiGroup League Statistics
     * @srsRequirement REQ-PUB-06
     */
    getTeamStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update statistics
     * @api PUT /club-league-stats/:id
     * @apiName API-LEAGUE-006
     * @apiGroup League Statistics
     * @srsRequirement REQ-ADM-02
     */
    updateStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete statistics
     * @api DELETE /club-league-stats/:id
     * @apiName API-LEAGUE-007
     * @apiGroup League Statistics
     * @srsRequirement REQ-ADM-02
     */
    deleteStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update match result
     * @api POST /club-league-stats/league/:leagueId/match
     * @apiName API-LEAGUE-008
     * @apiGroup League Statistics
     * @srsRequirement REQ-PUB-01, REQ-ADM-03
     */
    updateFixtureResult(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get top scorers
     * @api GET /club-league-stats/league/:leagueId/top-scorers
     * @apiName API-LEAGUE-009
     * @apiGroup League Statistics
     * @srsRequirement REQ-PUB-06
     */
    getTopScorers(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get top defenses
     * @api GET /club-league-stats/league/:leagueId/top-defenses
     * @apiName API-LEAGUE-010
     * @apiGroup League Statistics
     * @srsRequirement REQ-PUB-06
     */
    getTopDefenses(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get form table
     * @api GET /club-league-stats/league/:leagueId/form
     * @apiName API-LEAGUE-011
     * @apiGroup League Statistics
     * @srsRequirement REQ-PUB-06
     */
    getFormTable(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get home/away statistics
     * @api GET /club-league-stats/league/:leagueId/home-away
     * @apiName API-LEAGUE-012
     * @apiGroup League Statistics
     * @srsRequirement REQ-PUB-06
     */
    getHomeAwayStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get league summary
     * @api GET /club-league-stats/league/:leagueId/summary
     * @apiName API-LEAGUE-013
     * @apiGroup League Statistics
     * @srsRequirement REQ-PUB-06
     */
    getLeagueSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const leagueStatisticsController: LeagueStatisticsController;
//# sourceMappingURL=LeagueStatisticsController.d.ts.map