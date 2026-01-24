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

  public getNextUpcoming = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get the single next upcoming fixture
      const matches = await this.matchService.getUpcoming(1);

      res.status(200).json({
        success: true,
        data: matches.length > 0 ? matches[0] : null
      });
    } catch (error) {
      next(error);
    }
  };

  public getGallery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, sort, include, ...filters } = req.query;
      const options: any = {};

      // Handle pagination
      if (limit) options.limit = parseInt(limit as string, 10);
      if (offset) options.offset = parseInt(offset as string, 10);

      // Handle sorting
      if (sort) {
        const sortStr = sort as string;
        if (sortStr.startsWith('-')) {
          options.order = [[sortStr.substring(1), 'DESC']];
        } else {
          options.order = [[sortStr, 'ASC']];
        }
      } else {
        options.order = [['matchDate', 'DESC']];
      }

      // Handle includes
      // Force include images for gallery, plus any requested includes
      const requestedIncludes = include ? (include as string).split(',').map(i => i.trim()) : [];
      const uniqueIncludes = Array.from(new Set([...requestedIncludes, 'images', 'league'])); // Ensure images and league are present
      options.include = uniqueIncludes;

      // Handle filters
      const where: any = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          where[key] = filters[key];
        }
      });
      if (Object.keys(where).length > 0) {
        options.where = where;
      }

      const matches = await this.matchService.findAll(options);

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
      const { limit, offset, sort, include, ...filters } = req.query;

      const options: any = {};

      // Handle pagination
      if (limit) options.limit = parseInt(limit as string, 10);
      if (offset) options.offset = parseInt(offset as string, 10);

      // Handle sorting
      if (sort) {
        const sortStr = sort as string;
        if (sortStr.startsWith('-')) {
          options.order = [[sortStr.substring(1), 'DESC']];
        } else {
          options.order = [[sortStr, 'ASC']];
        }
      } else {
        // Default sort
        options.order = [['matchDate', 'DESC']];
      }

      // Handle includes
      if (include) {
        const includeStr = include as string;
        // Handle comma-separated includes
        options.include = includeStr.split(',').map(i => i.trim());
      }

      // Handle filters (where clause)
      // Remove any undefined or empty strings
      const where: any = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          // Simple equality check for now. 
          // TODO: Implement more complex filtering if needed (e.g. ranges)
          where[key] = filters[key];
        }
      });

      if (Object.keys(where).length > 0) {
        options.where = where;
      }

      // Fixturees service: findAll(options)
      const matches = await this.matchService.findAll(options);

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