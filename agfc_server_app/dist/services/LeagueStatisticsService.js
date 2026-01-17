"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueStatisticsService = void 0;
const leagueStatistics_repository_1 = require("../repositories/leagueStatistics.repository");
const AppError_1 = require("../utils/AppError");
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
class LeagueStatisticsService {
    constructor(repository) {
        this.repository = repository || new leagueStatistics_repository_1.LeagueStatisticsRepository();
    }
    async createStatistics(data) {
        const existing = await this.repository.findByTeam(data.leagueId, data.team);
        if (existing) {
            throw new AppError_1.AppError('Statistics for this team already exist in this league', 409);
        }
        const statisticsData = {
            ...data,
            id: (0, uuid_1.v4)(),
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
            avgGoalsPerMatch: 0,
            avgGoalsConcededPerMatch: 0,
        };
        return await this.repository.create(statisticsData);
    }
    async getStatisticsById(id) {
        const statistics = await this.repository.findById(id);
        if (!statistics) {
            throw new AppError_1.AppError('League statistics not found', 404);
        }
        return statistics;
    }
    async getAllStatistics(leagueId, options = {}) {
        const { rows: statistics, count: total } = await this.repository.findAll(leagueId, options);
        const page = options.page || 1;
        const limit = options.limit || 20;
        const totalPages = Math.ceil(total / limit);
        return {
            statistics,
            total,
            page,
            totalPages,
        };
    }
    async getLeagueStandings(leagueId) {
        return await this.repository.getLeagueStandings(leagueId);
    }
    async updateStatistics(id, data) {
        const statistics = await this.repository.findById(id);
        if (!statistics) {
            throw new AppError_1.AppError('League statistics not found', 404);
        }
        await this.repository.update(id, data);
        return await this.repository.findById(id);
    }
    async deleteStatistics(id) {
        const result = await this.repository.delete(id);
        if (result === 0) {
            throw new AppError_1.AppError('League statistics not found', 404);
        }
    }
    async updateMatchResult(leagueId, homeTeam, awayTeam, homeGoals, awayGoals) {
        const homeResult = homeGoals > awayGoals ? 'W' : homeGoals === awayGoals ? 'D' : 'L';
        const awayResult = homeGoals < awayGoals ? 'W' : homeGoals === awayGoals ? 'D' : 'L';
        const homeUpdate = this.calculateMatchUpdate(homeTeam, homeGoals, awayGoals, true, homeResult);
        const awayUpdate = this.calculateMatchUpdate(awayTeam, awayGoals, homeGoals, false, awayResult);
        await Promise.all([
            this.applyMatchUpdate(leagueId, homeTeam, homeUpdate),
            this.applyMatchUpdate(leagueId, awayTeam, awayUpdate),
        ]);
    }
    async getTeamStatistics(leagueId, team) {
        const statistics = await this.repository.getTeamStatistics(leagueId, team);
        if (!statistics) {
            throw new AppError_1.AppError('Team statistics not found', 404);
        }
        return statistics;
    }
    async getTopScorers(leagueId, limit = 5) {
        return await this.repository.getTopScorers(leagueId, limit);
    }
    async getTopDefenses(leagueId, limit = 5) {
        return await this.repository.getTopDefenses(leagueId, limit);
    }
    async getFormTable(leagueId) {
        return await this.repository.getFormTable(leagueId);
    }
    async getHomeAwayStats(leagueId) {
        return await this.repository.getHomeAwayStats(leagueId);
    }
    async getLeagueSummary(leagueId) {
        return await this.repository.getLeagueSummary(leagueId);
    }
    calculateMatchUpdate(team, goalsFor, goalsAgainst, isHome, result) {
        const update = {
            goalsFor: sequelize_1.Sequelize.literal(`goalsFor + ${goalsFor}`),
            goalsAgainst: sequelize_1.Sequelize.literal(`goalsAgainst + ${goalsAgainst}`),
            matchesPlayed: sequelize_1.Sequelize.literal('matchesPlayed + 1'),
            goalDifference: sequelize_1.Sequelize.literal(`goalDifference + ${goalsFor - goalsAgainst}`),
            lastMatchDate: new Date(),
        };
        // Update wins/draws/losses
        if (result === 'W') {
            update.wins = sequelize_1.Sequelize.literal('wins + 1');
            update.points = sequelize_1.Sequelize.literal('points + 3');
        }
        else if (result === 'D') {
            update.draws = sequelize_1.Sequelize.literal('draws + 1');
            update.points = sequelize_1.Sequelize.literal('points + 1');
        }
        else {
            update.losses = sequelize_1.Sequelize.literal('losses + 1');
        }
        // Update home/away stats
        if (isHome) {
            update.homeGoalsFor = sequelize_1.Sequelize.literal(`homeGoalsFor + ${goalsFor}`);
            update.homeGoalsAgainst = sequelize_1.Sequelize.literal(`homeGoalsAgainst + ${goalsAgainst}`);
        }
        else {
            update.awayGoalsFor = sequelize_1.Sequelize.literal(`awayGoalsFor + ${goalsFor}`);
            update.awayGoalsAgainst = sequelize_1.Sequelize.literal(`awayGoalsAgainst + ${goalsAgainst}`);
        }
        // Update clean sheets and failed to score
        if (goalsAgainst === 0) {
            update.cleanSheets = sequelize_1.Sequelize.literal('cleanSheets + 1');
        }
        if (goalsFor === 0) {
            update.failedToScore = sequelize_1.Sequelize.literal('failedToScore + 1');
        }
        // Update form (last 5 matches)
        update.form = sequelize_1.Sequelize.literal(`
      CASE 
        WHEN form IS NULL THEN '${result}'
        WHEN LENGTH(form) < 5 THEN CONCAT('${result}', form)
        ELSE CONCAT('${result}', LEFT(form, 4))
      END
    `);
        return update;
    }
    async applyMatchUpdate(leagueId, team, update) {
        await this.repository.updateTeamStats(leagueId, team, update);
    }
}
exports.LeagueStatisticsService = LeagueStatisticsService;
//# sourceMappingURL=LeagueStatisticsService.js.map