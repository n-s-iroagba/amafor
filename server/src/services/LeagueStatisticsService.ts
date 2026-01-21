import {
  LeagueStatisticsAttributes,
  LeagueStatisticsCreationAttributes
} from '../models/LeagueStatistics';

import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize';
import { LeagueStatisticsRepository } from '@repositories/LeagueStatisticsRepository';
import { AppError } from '@utils/errors';
import { PaginatedData } from 'src/types';

export interface CreateLeagueStatisticsData extends Omit<LeagueStatisticsCreationAttributes, 'id'> {
  leagueId: string;
  team: string;
  goalsFor?: number;
  goalsAgainst?: number;
}

export interface UpdateLeagueStatisticsData extends Partial<Omit<LeagueStatisticsAttributes, 'id' | 'leagueId'>> { }

export class LeagueStatisticsService {
  private repository: ILeagueStatisticsRepository;

  constructor(repository?: ILeagueStatisticsRepository) {
    this.repository = repository || new LeagueStatisticsRepository();
  }

  async createStatistics(data: CreateLeagueStatisticsData): Promise<LeagueStatisticsAttributes> {
    const existing = await this.repository.findByTeam(data.leagueId, data.team);
    if (existing) {
      throw new AppError('Statistics for this team already exist in this league', 409);
    }

    const statisticsData: LeagueStatisticsCreationAttributes = {
      ...data,
      id: uuidv4(),
      goalsFor: data.goalsFor || 0,
      goalsAgainst: data.goalsAgainst || 0,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
      goalDifference: (data.goalsFor || 0) - (data.goalsAgainst || 0),
      homeGoalsFor: 0,
      homeGoalsAgainst: 0,
      awayGoalsFor: 0,
      awayGoalsAgainst: 0,
      cleanSheets: 0,
      failedToScore: 0,
      avgGoalsPerFixture: 0,
      avgGoalsConcededPerFixture: 0,
    };

    return await this.repository.create(statisticsData);
  }

  async getStatisticsById(id: string): Promise<LeagueStatisticsAttributes> {
    const statistics = await this.repository.findById(id);
    if (!statistics) {
      throw new AppError('League statistics not found', 404);
    }
    return statistics;
  }

  async getAllStatistics(
    leagueId: string,
    options: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      includeLeague?: boolean;
    } = {}
  ): Promise<PaginatedData<LeagueStatisticsAttributes>> {
    const { rows: statistics, count: total } = await this.repository.findAll(leagueId, options);

    const page = options.page || 1;
    const limit = options.limit || 20;
    const totalPages = Math.ceil(total / limit);

    return {
      data: statistics,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async getLeagueStandings(leagueId: string): Promise<LeagueStatisticsAttributes[]> {
    return await this.repository.getLeagueStandings(leagueId);
  }

  async updateStatistics(id: string, data: UpdateLeagueStatisticsData): Promise<LeagueStatisticsAttributes> {
    const statistics = await this.repository.findById(id);
    if (!statistics) {
      throw new AppError('League statistics not found', 404);
    }

    await this.repository.update(id, data);
    return await this.repository.findById(id) as LeagueStatisticsAttributes;
  }

  async deleteStatistics(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result === 0) {
      throw new AppError('League statistics not found', 404);
    }
  }

  async updateFixtureResult(
    leagueId: string,
    homeTeam: string,
    awayTeam: string,
    homeGoals: number,
    awayGoals: number
  ): Promise<void> {
    const homeResult = homeGoals > awayGoals ? 'W' : homeGoals === awayGoals ? 'D' : 'L';
    const awayResult = homeGoals < awayGoals ? 'W' : homeGoals === awayGoals ? 'D' : 'L';

    const homeUpdate = this.calculateFixtureUpdate(homeTeam, homeGoals, awayGoals, true, homeResult);
    const awayUpdate = this.calculateFixtureUpdate(awayTeam, awayGoals, homeGoals, false, awayResult);

    await Promise.all([
      this.applyFixtureUpdate(leagueId, homeTeam, homeUpdate),
      this.applyFixtureUpdate(leagueId, awayTeam, awayUpdate),
    ]);
  }

  async getTeamStatistics(leagueId: string, team: string): Promise<LeagueStatisticsAttributes> {
    const statistics = await this.repository.getTeamStatistics(leagueId, team);
    if (!statistics) {
      throw new AppError('Team statistics not found', 404);
    }
    return statistics;
  }

  async getTopScorers(leagueId: string, limit: number = 5): Promise<LeagueStatisticsAttributes[]> {
    return await this.repository.getTopScorers(leagueId, limit);
  }

  async getTopDefenses(leagueId: string, limit: number = 5): Promise<LeagueStatisticsAttributes[]> {
    return await this.repository.getTopDefenses(leagueId, limit);
  }

  async getFormTable(leagueId: string): Promise<LeagueStatisticsAttributes[]> {
    return await this.repository.getFormTable(leagueId);
  }

  async getHomeAwayStats(leagueId: string): Promise<any> {
    return await this.repository.getHomeAwayStats(leagueId);
  }

  async getLeagueSummary(leagueId: string): Promise<{
    totalGoals: number;
    averageGoalsPerFixture: number;
    totalFixturees: number;
    totalTeams: number;
    highestScoringTeam: string;
    bestDefenseTeam: string;
    mostCleanSheets: string;
  }> {
    return await this.repository.getLeagueSummary(leagueId);
  }

  private calculateFixtureUpdate(
    team: string,
    goalsFor: number,
    goalsAgainst: number,
    isHome: boolean,
    result: 'W' | 'D' | 'L'
  ): any {
    const update: any = {
      goalsFor: Sequelize.literal(`goalsFor + ${goalsFor}`),
      goalsAgainst: Sequelize.literal(`goalsAgainst + ${goalsAgainst}`),
      matchesPlayed: Sequelize.literal('matchesPlayed + 1'),
      goalDifference: Sequelize.literal(`goalDifference + ${goalsFor - goalsAgainst}`),
      lastFixtureDate: new Date(),
    };

    // Update wins/draws/losses
    if (result === 'W') {
      update.wins = Sequelize.literal('wins + 1');
      update.points = Sequelize.literal('points + 3');
    } else if (result === 'D') {
      update.draws = Sequelize.literal('draws + 1');
      update.points = Sequelize.literal('points + 1');
    } else {
      update.losses = Sequelize.literal('losses + 1');
    }

    // Update home/away stats
    if (isHome) {
      update.homeGoalsFor = Sequelize.literal(`homeGoalsFor + ${goalsFor}`);
      update.homeGoalsAgainst = Sequelize.literal(`homeGoalsAgainst + ${goalsAgainst}`);
    } else {
      update.awayGoalsFor = Sequelize.literal(`awayGoalsFor + ${goalsFor}`);
      update.awayGoalsAgainst = Sequelize.literal(`awayGoalsAgainst + ${goalsAgainst}`);
    }

    // Update clean sheets and failed to score
    if (goalsAgainst === 0) {
      update.cleanSheets = Sequelize.literal('cleanSheets + 1');
    }
    if (goalsFor === 0) {
      update.failedToScore = Sequelize.literal('failedToScore + 1');
    }

    // Update form (last 5 matches)
    update.form = Sequelize.literal(`
      CASE 
        WHEN form IS NULL THEN '${result}'
        WHEN LENGTH(form) < 5 THEN CONCAT('${result}', form)
        ELSE CONCAT('${result}', LEFT(form, 4))
      END
    `);

    return update;
  }

  private async applyFixtureUpdate(
    leagueId: string,
    team: string,
    update: any
  ): Promise<void> {
    await this.repository.updateTeamStats(leagueId, team, update);
  }
}