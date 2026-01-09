import { Request, Response, NextFunction } from 'express';
import { MatchService } from '../services';
import { structuredLogger } from '../utils';

export class MatchController {
  private matchService: MatchService;

  constructor() {
    this.matchService = new MatchService();
  }

  // Admin Only
  public createFixture = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const creatorId = (req as any).user.id;
      // Matches service: createFixture(data, creatorId)
      const match = await this.matchService.createFixture(req.body, creatorId);
      
      res.status(201).json({
        success: true,
        data: match
      });
    } catch (error) {
      next(error);
    }
  };

  // Admin/Referee
  public updateResult = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updaterId = (req as any).user.id;
      
      // Matches service: recordResult(id, data, updaterId)
      const match = await this.matchService.recordResult(id, req.body, updaterId);

      structuredLogger.info('MATCH_RESULT_UPDATED', { matchId: id, result: `${match.homeScore}-${match.awayScore}` });

      res.status(200).json({
        success: true,
        data: match
      });
    } catch (error) {
      next(error);
    }
  };

  public getUpcomingMatches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      // Matches service: getUpcoming(limit)
      const matches = await this.matchService.getUpcoming(limit);
      
      res.status(200).json({
        success: true,
        data: matches
      });
    } catch (error) {
      next(error);
    }
  };

  public getLeagueTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const season = req.query.season as string || 'current';
      // Matches service: calculateLeagueTable(season)
      const table = await this.matchService.calculateLeagueTable(season);
      
      res.status(200).json({
        success: true,
        data: table
      });
    } catch (error) {
      next(error);
    }
  };

  public listAllMatches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Matches service: findAll(filters)
      const matches = await this.matchService.findAll(req.query);
      
      res.status(200).json({
        success: true,
        results: matches.length,
        data: matches
      });
    } catch (error) {
      next(error);
    }
  };
}