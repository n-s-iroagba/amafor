"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leagueStatisticsController = exports.LeagueStatisticsController = void 0;
const leagueStatistics_service_1 = require("../services/leagueStatistics.service");
const AppError_1 = require("../utils/AppError");
class LeagueStatisticsController {
    constructor(leagueStatisticsService) {
        this.leagueStatisticsService = leagueStatisticsService || new leagueStatistics_service_1.LeagueStatisticsService();
    }
    // Create league statistics
    async createStatistics(req, res, next) {
        try {
            const { leagueId, team, goalsFor = 0, goalsAgainst = 0 } = req.body;
            const statisticsData = {
                leagueId,
                team,
                goalsFor: parseInt(goalsFor),
                goalsAgainst: parseInt(goalsAgainst),
            };
            const statistics = await this.leagueStatisticsService.createStatistics(statisticsData);
            res.status(201).json({
                success: true,
                message: 'League statistics created successfully',
                data: statistics,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get all statistics for a league
    async getAllStatistics(req, res, next) {
        try {
            const { leagueId } = req.params;
            const { page = '1', limit = '20', sortBy = 'points', sortOrder = 'DESC', includeLeague = 'false' } = req.query;
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sortBy: sortBy,
                sortOrder: sortOrder,
                includeLeague: includeLeague === 'true',
            };
            const result = await this.leagueStatisticsService.getAllStatistics(leagueId, options);
            res.status(200).json({
                success: true,
                message: 'League statistics retrieved successfully',
                data: result.statistics,
                meta: {
                    total: result.total,
                    page: result.page,
                    totalPages: result.totalPages,
                    limit: options.limit,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get league standings
    async getLeagueStandings(req, res, next) {
        try {
            const { leagueId } = req.params;
            const standings = await this.leagueStatisticsService.getLeagueStandings(leagueId);
            res.status(200).json({
                success: true,
                message: 'League standings retrieved successfully',
                data: standings,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get single statistics
    async getStatisticsById(req, res, next) {
        try {
            const { id } = req.params;
            const statistics = await this.leagueStatisticsService.getStatisticsById(id);
            res.status(200).json({
                success: true,
                message: 'Statistics retrieved successfully',
                data: statistics,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get team statistics
    async getTeamStatistics(req, res, next) {
        try {
            const { leagueId, team } = req.params;
            const statistics = await this.leagueStatisticsService.getTeamStatistics(leagueId, team);
            res.status(200).json({
                success: true,
                message: 'Team statistics retrieved successfully',
                data: statistics,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Update statistics
    async updateStatistics(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const statistics = await this.leagueStatisticsService.updateStatistics(id, updateData);
            res.status(200).json({
                success: true,
                message: 'Statistics updated successfully',
                data: statistics,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Delete statistics
    async deleteStatistics(req, res, next) {
        try {
            const { id } = req.params;
            await this.leagueStatisticsService.deleteStatistics(id);
            res.status(200).json({
                success: true,
                message: 'Statistics deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Update match result
    async updateMatchResult(req, res, next) {
        try {
            const { leagueId } = req.params;
            const { homeTeam, awayTeam, homeGoals, awayGoals } = req.body;
            if (!homeTeam || !awayTeam || homeGoals === undefined || awayGoals === undefined) {
                throw new AppError_1.AppError('Missing required fields: homeTeam, awayTeam, homeGoals, awayGoals', 400);
            }
            await this.leagueStatisticsService.updateMatchResult(leagueId, homeTeam, awayTeam, parseInt(homeGoals), parseInt(awayGoals));
            res.status(200).json({
                success: true,
                message: 'Match result updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get top scorers
    async getTopScorers(req, res, next) {
        try {
            const { leagueId } = req.params;
            const { limit = '5' } = req.query;
            const scorers = await this.leagueStatisticsService.getTopScorers(leagueId, parseInt(limit));
            res.status(200).json({
                success: true,
                message: 'Top scorers retrieved successfully',
                data: scorers,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get top defenses
    async getTopDefenses(req, res, next) {
        try {
            const { leagueId } = req.params;
            const { limit = '5' } = req.query;
            const defenses = await this.leagueStatisticsService.getTopDefenses(leagueId, parseInt(limit));
            res.status(200).json({
                success: true,
                message: 'Top defenses retrieved successfully',
                data: defenses,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get form table
    async getFormTable(req, res, next) {
        try {
            const { leagueId } = req.params;
            const formTable = await this.leagueStatisticsService.getFormTable(leagueId);
            res.status(200).json({
                success: true,
                message: 'Form table retrieved successfully',
                data: formTable,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get home/away stats
    async getHomeAwayStats(req, res, next) {
        try {
            const { leagueId } = req.params;
            const stats = await this.leagueStatisticsService.getHomeAwayStats(leagueId);
            res.status(200).json({
                success: true,
                message: 'Home/away statistics retrieved successfully',
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get league summary
    async getLeagueSummary(req, res, next) {
        try {
            const { leagueId } = req.params;
            const summary = await this.leagueStatisticsService.getLeagueSummary(leagueId);
            res.status(200).json({
                success: true,
                message: 'League summary retrieved successfully',
                data: summary,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.LeagueStatisticsController = LeagueStatisticsController;
// Export instance
exports.leagueStatisticsController = new LeagueStatisticsController();
//# sourceMappingURL=LeagueStatisticsController.js.map