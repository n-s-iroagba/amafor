"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueStatisticsRepository = void 0;
const LeagueStatistics_1 = require("../models/LeagueStatistics");
const sequelize_1 = require("sequelize");
const BaseRepository_1 = require("./BaseRepository");
const League_1 = __importDefault(require("@models/League"));
const tracer_1 = __importDefault(require("@utils/tracer"));
const logger_1 = __importDefault(require("@utils/logger"));
class LeagueStatisticsRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(LeagueStatistics_1.LeagueStatistics);
    }
    async createBulk(data) {
        return await this.model.bulkCreate(data, { returning: true });
    }
    async findAllByLeague(leagueId, options = {}) {
        return tracer_1.default.startActiveSpan(`repository.${this.model.name}.findAllByLeague`, async (span) => {
            try {
                span.setAttribute('leagueId', leagueId);
                const { page = 1, limit = 20, sortBy = 'points', sortOrder = 'DESC', includeLeague = false, } = options;
                const offset = (page - 1) * limit;
                const include = includeLeague ? [{
                        model: League_1.default,
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
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error(`Error finding ${this.model.name} by league: ${leagueId}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findByTeam(leagueId, team) {
        return await this.model.findOne({
            where: { leagueId, team },
            include: [{
                    model: League_1.default,
                    as: 'league',
                    attributes: ['id', 'name', 'season'],
                }],
        });
    }
    async deleteByLeague(leagueId) {
        return await this.model.destroy({ where: { leagueId } });
    }
    async getLeagueStandings(leagueId) {
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
    async getTeamStatistics(leagueId, team) {
        return await this.model.findOne({
            where: { leagueId, team },
            include: [{
                    model: League_1.default,
                    as: 'league',
                    attributes: ['id', 'name', 'season'],
                }],
        });
    }
    async updateTeamStats(leagueId, team, data) {
        return await this.model.update(data, {
            where: { leagueId, team },
            returning: true,
        });
    }
    async recalculateStandings(leagueId) {
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
    async getTopScorers(leagueId, limit = 5) {
        return await this.model.findAll({
            where: { leagueId },
            order: [['goalsFor', 'DESC']],
            limit,
        });
    }
    async getTopDefenses(leagueId, limit = 5) {
        return await this.model.findAll({
            where: { leagueId },
            order: [['goalsAgainst', 'ASC']],
            limit,
        });
    }
    async getFormTable(leagueId) {
        return await this.model.findAll({
            where: {
                leagueId,
                form: {
                    [sequelize_1.Op.not]: '',
                    [sequelize_1.Op.ne]: '',
                },
            },
            order: [
                ['points', 'DESC'],
                ['lastMatchDate', 'DESC'],
            ],
        });
    }
    async getHomeAwayStats(leagueId) {
        return await this.model.findAll({
            where: { leagueId },
            attributes: [
                'team',
                'homeGoalsFor',
                'homeGoalsAgainst',
                'awayGoalsFor',
                'awayGoalsAgainst',
                [sequelize_1.Sequelize.literal('homeGoalsFor - homeGoalsAgainst'), 'homeGoalDifference'],
                [sequelize_1.Sequelize.literal('awayGoalsFor - awayGoalsAgainst'), 'awayGoalDifference'],
            ],
            order: [[sequelize_1.Sequelize.literal('homeGoalDifference'), 'DESC']],
        });
    }
    async getLeagueSummary(leagueId) {
        return tracer_1.default.startActiveSpan(`repository.${this.model.name}.getLeagueSummary`, async (span) => {
            try {
                span.setAttribute('leagueId', leagueId);
                // Run the aggregate query and the three findOne queries in parallel
                const aggregateResult = await this.model.findOne({
                    where: { leagueId },
                    attributes: [
                        [sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.col('goalsFor')), 'totalGoals'],
                        [sequelize_1.Sequelize.fn('AVG', sequelize_1.Sequelize.col('goalsFor')), 'avgGoals'],
                        [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('id')), 'totalTeams'],
                        [sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.col('matchesPlayed')), 'totalMatches'],
                    ],
                    raw: true,
                });
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
                    highestScoringTeam: highestScoring?.get('team') || 'N/A',
                    bestDefenseTeam: bestDefense?.get('team') || 'N/A',
                    mostCleanSheets: mostCleanSheets?.get('team') || 'N/A',
                };
                span.setAttributes({
                    totalGoals: summary.totalGoals,
                    averageGoalsPerMatch: summary.averageGoalsPerMatch,
                    totalMatches: summary.totalMatches,
                    totalTeams: summary.totalTeams,
                });
                return summary;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error(`Error getting league summary for league: ${leagueId}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.LeagueStatisticsRepository = LeagueStatisticsRepository;
//# sourceMappingURL=LeagueStatisticsRepository.js.map