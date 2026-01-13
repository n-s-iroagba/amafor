import { 
  LeagueStatistics, 
  LeagueStatisticsAttributes, 
  LeagueStatisticsCreationAttributes 
} from '../models/LeagueStatistics';
import { League } from '../models/League';
import { BaseRepository } from './base.repository';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import sequelize from '../config/database';

export interface ILeagueStatisticsRepository {
  create(data: LeagueStatisticsCreationAttributes): Promise<LeagueStatistics>;
  createBulk(data: LeagueStatisticsCreationAttributes[]): Promise<LeagueStatistics[]>;
  findAll(leagueId: string, options?: any): Promise<{ rows: LeagueStatistics[]; count: number }>;
  findById(id: string): Promise<LeagueStatistics | null>;
  findByTeam(leagueId: string, team: string): Promise<LeagueStatistics | null>;
  update(id: string, data: Partial<LeagueStatisticsAttributes>): Promise<[number, LeagueStatistics[]]>;
  delete(id: string): Promise<number>;
  deleteByLeague(leagueId: string): Promise<number>;
  getLeagueStandings(leagueId: string): Promise<LeagueStatistics[]>;
  getTeamStatistics(leagueId: string, team: string): Promise<LeagueStatistics | null>;
  updateTeamStats(
    leagueId: string, 
    team: string, 
    data: Partial<LeagueStatisticsAttributes>
  ): Promise<[number, LeagueStatistics[]]>;
  recalculateStandings(leagueId: string): Promise<void>;
  getTopScorers(leagueId: string, limit?: number): Promise<LeagueStatistics[]>;
  getTopDefenses(leagueId: string, limit?: number): Promise<LeagueStatistics[]>;
  getFormTable(leagueId: string): Promise<LeagueStatistics[]>;
  getHomeAwayStats(leagueId: string): Promise<any>;
  getLeagueSummary(leagueId: string): Promise<{
    totalGoals: number;
    averageGoalsPerMatch: number;
    totalMatches: number;
    totalTeams: number;
    highestScoringTeam: string;
    bestDefenseTeam: string;
    mostCleanSheets: string;
  }>;
}

export class LeagueStatisticsRepository extends BaseRepository<LeagueStatistics> implements ILeagueStatisticsRepository {
  
  constructor() {
    super(LeagueStatistics);
  }

  async createBulk(data: LeagueStatisticsCreationAttributes[]): Promise<LeagueStatistics[]> {
    return await this.model.bulkCreate(data, { returning: true });
  }

  async findAll(
    leagueId: string,
    options: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      includeLeague?: boolean;
    } = {}
  ): Promise<{ rows: LeagueStatistics[]; count: number }> {
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

    return await this.model.findAndCountAll({
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
          [Op.not]: null,
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
    const result = await this.model.findOne({
      where: { leagueId },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('goalsFor')), 'totalGoals'],
        [Sequelize.fn('AVG', Sequelize.col('goalsFor')), 'avgGoals'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalTeams'],
        [Sequelize.fn('SUM', Sequelize.col('matchesPlayed')), 'totalMatches'],
      ],
      raw: true,
    });

    const highestScoring = await this.model.findOne({
      where: { leagueId },
      order: [['goalsFor', 'DESC']],
      attributes: ['team', 'goalsFor'],
    });

    const bestDefense = await this.model.findOne({
      where: { leagueId },
      order: [['goalsAgainst', 'ASC']],
      attributes: ['team', 'goalsAgainst'],
    });

    const mostCleanSheets = await this.model.findOne({
      where: { leagueId },
      order: [['cleanSheets', 'DESC']],
      attributes: ['team', 'cleanSheets'],
    });

    return {
      totalGoals: Number(result?.totalGoals) || 0,
      averageGoalsPerMatch: parseFloat((Number(result?.avgGoals) || 0).toFixed(2)),
      totalMatches: Number(result?.totalMatches) || 0,
      totalTeams: Number(result?.totalTeams) || 0,
      highestScoringTeam: highestScoring?.team || 'N/A',
      bestDefenseTeam: bestDefense?.team || 'N/A',
      mostCleanSheets: mostCleanSheets?.team || 'N/A',
    };
  }
}