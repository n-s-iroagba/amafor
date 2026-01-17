"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
class MatchController {
    constructor() {
        // Admin Only
        this.createFixture = async (req, res, next) => {
            try {
                const creatorId = req.user.id;
                // Matches service: createFixture(data, creatorId)
                const match = await this.matchService.createFixture(req.body, creatorId);
                res.status(201).json({
                    success: true,
                    data: match
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Admin/Referee
        this.updateResult = async (req, res, next) => {
            try {
                const { id } = req.params;
                const updaterId = req.user.id;
                // Matches service: recordResult(id, data, updaterId)
                const match = await this.matchService.recordResult(id, req.body, updaterId);
                utils_1.structuredLogger.info('MATCH_RESULT_UPDATED', { matchId: id, result: `${match.homeScore}-${match.awayScore}` });
                res.status(200).json({
                    success: true,
                    data: match
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getUpcomingMatches = async (req, res, next) => {
            try {
                const limit = req.query.limit ? parseInt(req.query.limit) : 10;
                // Matches service: getUpcoming(limit)
                const matches = await this.matchService.getUpcoming(limit);
                res.status(200).json({
                    success: true,
                    data: matches
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getLeagueTable = async (req, res, next) => {
            try {
                const season = req.query.season || 'current';
                // Matches service: calculateLeagueTable(season)
                const table = await this.matchService.calculateLeagueTable(season);
                res.status(200).json({
                    success: true,
                    data: table
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.listAllMatches = async (req, res, next) => {
            try {
                // Matches service: findAll(filters)
                const matches = await this.matchService.findAll(req.query);
                res.status(200).json({
                    success: true,
                    results: matches.length,
                    data: matches
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.matchService = new services_1.MatchService();
    }
}
exports.MatchController = MatchController;
//# sourceMappingURL=MatchController.js.map