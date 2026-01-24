import { Request, Response, NextFunction } from 'express';
import { FixtureService } from '../services';
import { structuredLogger } from '../utils';

export class FixtureController {
  private matchService: FixtureService;

  constructor() {
    this.matchService = new FixtureService();
  }

  // Admin Only
  public createFixture = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const creatorId = (req as any).user.id;
      // Fixturees service: createFixture(data, creatorId)
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

      // Fixturees service: recordResult(id, data, updaterId)
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

  public getUpcomingFixturees = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      // Fixturees service: getUpcoming(limit)
      const matches = await this.matchService.getUpcoming(limit);

      res.status(200).json({
        success: true,
        data: matches
      });
    } catch (error) {
      next(error);
    }
  };

  public getGallery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fetch fixtures with images. Assuming repository 'findAll' passes options to Sequelize
      // or we use a specific service method. For now, using findAll with query params.
      // Ideally, specific repo support for "has images" is better, but this connects the plumbing.
      const query = {
        ...req.query,
        include: 'images,league' // Assuming standard include param handling in repo/service
      };
      const matches = await this.matchService.findAll(query);

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
      // Fixturees service: calculateLeagueTable(season)
      const table = await this.matchService.calculateLeagueTable(season);

      res.status(200).json({
        success: true,
        data: table
      });
    } catch (error) {
      next(error);
    }
  };

  public listAllFixturees = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fixturees service: findAll(filters)
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
  public getFixtureById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      // Pass query params (like include) to service
      const match = await this.matchService.findById(id, req.query);

      if (!match) {
        res.status(404).json({ success: false, message: 'Fixture not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: match
      });
    } catch (error) {
      next(error);
    }
  };

  public updateFixture = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.matchService.update(id, req.body);

      const updatedMatch = await this.matchService.findById(id);

      res.status(200).json({
        success: true,
        data: updatedMatch
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteFixture = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.matchService.delete(id);

      res.status(200).json({
        success: true,
        message: 'Fixture deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  public getFixturesByLeague = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { leagueId } = req.params;
      const matches = await this.matchService.findByLeague(leagueId);

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