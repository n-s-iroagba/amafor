import { Request, Response, NextFunction } from 'express';
import { LeagueStatisticsService, CreateLeagueStatisticsData, UpdateLeagueStatisticsData } from '../services/leagueStatistics.service';
import { AppError } from '../utils/AppError';

export class LeagueStatisticsController {
  private leagueStatisticsService: LeagueStatisticsService;

  constructor(leagueStatisticsService?: LeagueStatisticsService) {
    this.leagueStatisticsService = leagueStatisticsService || new LeagueStatisticsService();
  }

  // Create league statistics
  async createStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { leagueId, team, goalsFor = 0, goalsAgainst = 0 } = req.body;

      const statisticsData: CreateLeagueStatisticsData = {
        leagueId,
        team,
        goalsFor: parseInt(goalsFor as string),
        goalsAgainst: parseInt(goalsAgainst as string),
      };

      const statistics = await this.leagueStatisticsService.createStatistics(statisticsData);

      res.status(201).json({
        success: true,
        message: 'League statistics created successfully',
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all statistics for a league
  async getAllStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { leagueId } = req.params;
      const {
        page = '1',
        limit = '20',
        sortBy = 'points',
        sortOrder = 'DESC',
        includeLeague = 'false'
      } = req.query;

      const options = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'ASC' | 'DESC',
        includeLeague: includeLeague === 'true',
      };

      const result = await this.leagueStatisticsService.getAllStatistics(leagueId, options);

      res.status(200).json({
        success: true,
        message: 'League statistics retrieved successfully',
        data: result.data,
        meta: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit: result.limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get league standings
  async getLeagueStandings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { leagueId } = req.params;

      const standings = await this.leagueStatisticsService.getLeagueStandings(leagueId);

      res.status(200).json({
        success: true,
        message: 'League standings retrieved successfully',
        data: standings,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single statistics
  async getStatisticsById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const statistics = await this.leagueStatisticsService.getStatisticsById(id);

      res.status(200).json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get team statistics
  async getTeamStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { leagueId, team } = req.params;

      const statistics = await this.leagueStatisticsService.getTeamStatistics(leagueId, team);

      res.status(200).json({
        success: true,
        message: 'Team statistics retrieved successfully',
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update statistics
  async updateStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const updateData: UpdateLeagueStatisticsData = req.body;

      const statistics = await this.leagueStatisticsService.updateStatistics(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Statistics updated successfully',
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete statistics
  async deleteStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.leagueStatisticsService.deleteStatistics(id);

      res.status(200).json({
        success: true,
        message: 'Statistics deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Update match result
  async updateFixtureResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { leagueId } = req.params;
      const { homeTeam, awayTeam, homeGoals, awayGoals } = req.body;

      if (!homeTeam || !awayTeam || homeGoals === undefined || awayGoals === undefined) {
        throw new AppError('Missing required fields: homeTeam, awayTeam, homeGoals, awayGoals', 400);
      }

      await this.leagueStatisticsService.updateFixtureResult(
        leagueId,
        homeTeam,
        awayTeam,
        parseInt(homeGoals as string),
        parseInt(awayGoals as string)
      );

      res.status(200).json({
        success: true,
        message: 'Fixture result updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Get top scorers
  async getTopScorers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { leagueId } = req.params;
      const { limit = '5' } = req.query;

      const scorers = await this.leagueStatisticsService.getTopScorers(
        leagueId,
        parseInt(limit as string)
      );

      res.status(200).json({
        success: true,
        message: 'Top scorers retrieved successfully',
        data: scorers,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get top defenses
  async getTopDefenses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { leagueId } = req.params;
      const { limit = '5' } = req.query;

      const defenses = await this.leagueStatisticsService.getTopDefenses(
        leagueId,
        parseInt(limit as string)
      );

      res.status(200).json({
        success: true,
        message: 'Top defenses retrieved successfully',
        data: defenses,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get form table
  async getFormTable(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { leagueId } = req.params;

      const formTable = await this.leagueStatisticsService.getFormTable(leagueId);

      res.status(200).json({
        success: true,
        message: 'Form table retrieved successfully',
        data: formTable,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get home/away stats
  async getHomeAwayStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { leagueId } = req.params;

      const stats = await this.leagueStatisticsService.getHomeAwayStats(leagueId);

      res.status(200).json({
        success: true,
        message: 'Home/away statistics retrieved successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get league summary
  async getLeagueSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { leagueId } = req.params;

      const summary = await this.leagueStatisticsService.getLeagueSummary(leagueId);

      res.status(200).json({
        success: true,
        message: 'League summary retrieved successfully',
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export instance
export const leagueStatisticsController = new LeagueStatisticsController();