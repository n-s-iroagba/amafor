import { Request, Response, NextFunction } from 'express';
import { FixtureService } from '../services';
import { structuredLogger } from '../utils';
import { League, Lineup, Player, FixtureStatistics, Goal, FixtureImage, PlayerLeagueStatistics } from '@models/index';

/**
 * Map of supported include alias names to their Sequelize model / include config.
 * Supports top-level aliases used by the client (e.g. "league", "lineups", "stats").
 */
function buildFixtureIncludes(includeParam: string): any[] {
  const requested = includeParam.split(',').map(s => s.trim()).filter(Boolean);

  // Normalise: "stats" → "statistics" so the client can use either name
  const aliases = requested.map(a => a === 'stats' ? 'statistics' : a);

  // We collect top-level associations only. Nested ones (lineups.player) are handled below.
  const topLevel = new Map<string, any>();

  for (const alias of aliases) {
    const parts = alias.split('.');
    const top = parts[0];

    if (top === 'league' && !topLevel.has('league')) {
      topLevel.set('league', { model: League, as: 'league' });
    } else if (top === 'lineups' && !topLevel.has('lineups')) {
      topLevel.set('lineups', { model: Lineup, as: 'lineups', include: [] });
    } else if (top === 'statistics' && !topLevel.has('statistics')) {
      topLevel.set('statistics', { model: FixtureStatistics, as: 'statistics' });
    } else if (top === 'goals' && !topLevel.has('goals')) {
      topLevel.set('goals', { model: Goal, as: 'goals' });
    } else if (top === 'images' && !topLevel.has('images')) {
      topLevel.set('images', { model: FixtureImage, as: 'images' });
    }

    // Handle nested: lineups.player
    if (top === 'lineups' && parts.length > 1 && parts[1] === 'player') {
      const lineupEntry = topLevel.get('lineups');
      if (lineupEntry) {
        const alreadyHasPlayer = lineupEntry.include.some((i: any) => i.as === 'player');
        if (!alreadyHasPlayer) {
          lineupEntry.include.push({ model: Player, as: 'player', include: [] });
        }
        // Handle lineups.player.leagueStatistics (client may send lineups.player.stats)
        if (parts.length > 2 && (parts[2] === 'stats' || parts[2] === 'leagueStatistics')) {
          const playerEntry = lineupEntry.include.find((i: any) => i.as === 'player');
          if (playerEntry) {
            const alreadyHasStats = playerEntry.include.some((i: any) => i.as === 'leagueStatistics');
            if (!alreadyHasStats) {
              playerEntry.include.push({ model: PlayerLeagueStatistics, as: 'leagueStatistics' });
            }
          }
        }
      }
    }
  }

  return Array.from(topLevel.values());
}

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

  public getUpcomingFixtures = async (req: Request, res: Response, next: NextFunction) => {
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
      }
      );
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

      // Parse the include query param into proper Sequelize include objects.
      // Never pass raw req.query directly — Sequelize can't use a string alias like
      // "league,lineups.player,stats" and will throw "Association does not exist".
      const findOptions: any = {};
      if (req.query.include) {
        findOptions.include = buildFixtureIncludes(req.query.include as string);
      }

      const match = await this.matchService.findById(id, findOptions);

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