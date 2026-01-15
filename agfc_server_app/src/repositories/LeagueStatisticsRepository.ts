import { 
  LeagueStatistics, 
  LeagueStatisticsAttributes, 
  LeagueStatisticsCreationAttributes 
} from '../models/LeagueStatistics';

import { Op,  Sequelize } from 'sequelize';
import { BaseRepository } from './BaseRepository';
import League from '@models/League';
import tracer from '@utils/tracer';
import logger from '@utils/logger';


export class LeagueStatisticsRepository extends BaseRepository<LeagueStatistics> {
  
  constructor() {
    super(LeagueStatistics);
  }

  async createBulk(data: LeagueStatisticsCreationAttributes[]): Promise<LeagueStatistics[]> {
    return await this.model.bulkCreate(data, { returning: true });
  }

async findAllByLeague(
  leagueId: string,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    includeLeague?: boolean;
  } = {}
): Promise<{ rows: LeagueStatistics[]; count: number }> {
  return tracer.startActiveSpan(`repository.${this.model.name}.findAllByLeague`, async (span) => {
    try {
      span.setAttribute('leagueId', leagueId);
      
      const {
        page = 1,
        limit = 20,
        sortBy = 'points',
        sortOrder = 'DESC',
        includeLeague = false,
      } = options;

      const offset = (page - 1) * limit;

      const include = includeLeague ? [{
        model: League,
        as: 'league',
        attributes: ['id', 'name', 'season'],
      }] : [];

      const result = await this.model.findAndCountAll({
        where: { leagueId },
        include,
        limit,
        offset,
        order: [
          [sortBy, sortOrder],
          ['goalDifference', 'DESC'],
          ['goalsFor', 'DESC'],
          ['team', 'ASC'],
        ],
      });

      span.setAttribute('count', result.count);
      span.setAttribute('rows', result.rows.length);
      return result;
    } catch (error: any) {
      span.setStatus({ code: 2, message: error.message });
      logger.error(`Error finding ${this.model.name} by league: ${leagueId}`, { error });
      throw error;
    } finally {
      span.end();
    }
  });
}

  async findByTeam(leagueId: string, team: string): Promise<LeagueStatistics | null> {
    return await this.model.findOne({
      where: { leagueId, team },
      include: [{
        model: League,
        as: 'league',
        attributes: ['id', 'name', 'season'],
      }],
    });
  }

  async deleteByLeague(leagueId: string): Promise<number> {
    return await this.model.destroy({ where: { leagueId } });
  }

  async getLeagueStandings(leagueId: string): Promise<LeagueStatistics[]> {
    return await this.model.findAll({
      where: { leagueId },
      order: [
        ['points', 'DESC'],
        ['goalDifference', 'DESC'],
        ['goalsFor', 'DESC'],
        ['team', 'ASC'],
      ],
    });
  }

  async getTeamStatistics(leagueId: string, team: string): Promise<LeagueStatistics | null> {
    return await this.model.findOne({
      where: { leagueId, team },
      include: [{
        model: League,
        as: 'league',
        attributes: ['id', 'name', 'season'],
      }],
    });
  }

  async updateTeamStats(
    leagueId: string, 
    team: string, 
    data: Partial<LeagueStatisticsAttributes>
  ): Promise<[number, LeagueStatistics[]]> {
    return await this.model.update(data, {
      where: { leagueId, team },
      returning: true,
    });
  }

  async recalculateStandings(leagueId: string): Promise<void> {
    const statistics = await this.model.findAll({ where: { leagueId } });
    
    for (const stat of statistics) {
      stat.goalDifference = stat.goalsFor - stat.goalsAgainst;
      stat.points = (stat.wins || 0) * 3 + (stat.draws || 0);
      stat.matchesPlayed = (stat.wins || 0) + (stat.draws || 0) + (stat.losses || 0);
      
      if (stat.matchesPlayed > 0) {
        stat.avgGoalsPerMatch = Number((stat.goalsFor / stat.matchesPlayed).toFixed(2));
        stat.avgGoalsConcededPerMatch = Number((stat.goalsAgainst / stat.matchesPlayed).toFixed(2));
      }
      
      await stat.save();
    }
  }

  async getTopScorers(leagueId: string, limit: number = 5): Promise<LeagueStatistics[]> {
    return await this.model.findAll({
      where: { leagueId },
      order: [['goalsFor', 'DESC']],
      limit,
    });
  }

  async getTopDefenses(leagueId: string, limit: number = 5): Promise<LeagueStatistics[]> {
    return await this.model.findAll({
      where: { leagueId },
      order: [['goalsAgainst', 'ASC']],
      limit,
    });
  }

  async getFormTable(leagueId: string): Promise<LeagueStatistics[]> {
    return await this.model.findAll({
      where: { 
        leagueId,
        form: {
          [Op.not]: '',
          [Op.ne]: '',
        },
      },
      order: [
        ['points', 'DESC'],
        ['lastMatchDate', 'DESC'],
      ],
    });
  }

  async getHomeAwayStats(leagueId: string): Promise<any> {
    return await this.model.findAll({
      where: { leagueId },
      attributes: [
        'team',
        'homeGoalsFor',
        'homeGoalsAgainst',
        'awayGoalsFor',
        'awayGoalsAgainst',
        [Sequelize.literal('homeGoalsFor - homeGoalsAgainst'), 'homeGoalDifference'],
        [Sequelize.literal('awayGoalsFor - awayGoalsAgainst'), 'awayGoalDifference'],
      ],
      order: [[Sequelize.literal('homeGoalDifference'), 'DESC']],
    });
  }

async getLeagueSummary(leagueId: string): Promise<{
  totalGoals: number;
  averageGoalsPerMatch: number;
  totalMatches: number;
  totalTeams: number;
  highestScoringTeam: string;
  bestDefenseTeam: string;
  mostCleanSheets: string;
}> {
  return tracer.startActiveSpan(`repository.${this.model.name}.getLeagueSummary`, async (span) => {
    try {
      span.setAttribute('leagueId', leagueId);
    interface AggregateResult {
        totalGoals: number;
        avgGoals: number;
        totalTeams: number;
        totalMatches: number;
      }
      // Run the aggregate query and the three findOne queries in parallel
       const aggregateResult = await this.model.findOne({
        where: { leagueId },
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('goalsFor')), 'totalGoals'],
          [Sequelize.fn('AVG', Sequelize.col('goalsFor')), 'avgGoals'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalTeams'],
          [Sequelize.fn('SUM', Sequelize.col('matchesPlayed')), 'totalMatches'],
        ],
        raw: true,
      }) as unknown as AggregateResult | null;

      // Get individual records in parallel for better performance
      const [highestScoring, bestDefense, mostCleanSheets] = await Promise.all([
        this.model.findOne({
          where: { leagueId },
          order: [['goalsFor', 'DESC']],
          attributes: ['team', 'goalsFor'],
        }),
        this.model.findOne({
          where: { leagueId },
          order: [['goalsAgainst', 'ASC']],
          attributes: ['team', 'goalsAgainst'],
        }),
        this.model.findOne({
          where: { leagueId },
          order: [['cleanSheets', 'DESC']],
          attributes: ['team', 'cleanSheets'],
        }),
      ]);

      // Extract values from the aggregate result with proper default values
      const totalGoals = aggregateResult?.totalGoals || 0;
      const avgGoals = aggregateResult?.avgGoals || 0;
      const totalMatches = aggregateResult?.totalMatches || 0;
      const totalTeams = aggregateResult?.totalTeams || 0;

      // Since each match appears twice in statistics (once for each team), divide by 2 to get actual match count
      const actualMatches = Math.floor(totalMatches / 2);

      const summary = {
        totalGoals,
        averageGoalsPerMatch: parseFloat(avgGoals.toFixed(2)),
        totalMatches: actualMatches,
        totalTeams,
        highestScoringTeam: highestScoring?.get('team') as string || 'N/A',
        bestDefenseTeam: bestDefense?.get('team') as string || 'N/A',
        mostCleanSheets: mostCleanSheets?.get('team') as string || 'N/A',
      };

      span.setAttributes({
        totalGoals: summary.totalGoals,
        averageGoalsPerMatch: summary.averageGoalsPerMatch,
        totalMatches: summary.totalMatches,
        totalTeams: summary.totalTeams,
      });

      return summary;
    } catch (error: any) {
      span.setStatus({ code: 2, message: error.message });
      logger.error(`Error getting league summary for league: ${leagueId}`, { error });
      throw error;
    } finally {
      span.end();
     }
  });
}}