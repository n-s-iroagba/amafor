"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
class FixtureController {
    constructor() {
        // Admin Only
        this.createFixture = async (req, res, next) => {
            try {
                const creatorId = req.user.id;
                // Fixturees service: createFixture(data, creatorId)
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
                // Fixturees service: recordResult(id, data, updaterId)
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
        this.getUpcomingFixturees = async (req, res, next) => {
            try {
                const limit = req.query.limit ? parseInt(req.query.limit) : 10;
                // Fixturees service: getUpcoming(limit)
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
        this.getGallery = async (req, res, next) => {
            try {
                // Fetch fixtures with images. Assuming repository 'findAll' passes options to Sequelize
                // or we use a specific service method. For now, using findAll with query params.
                // Ideally, specific repo support for "has images" is better, but this connects the plumbing.
                const query = {
                    ...req.query,
                    include: 'images,league' // Assuming standard include param handling in repo/service
                };
                const matches = await this.matchService.findAll(query);
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
                // Fixturees service: calculateLeagueTable(season)
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
        this.listAllFixturees = async (req, res, next) => {
            try {
                // Fixturees service: findAll(filters)
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
        this.getFixtureById = async (req, res, next) => {
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
            }
            catch (error) {
                next(error);
            }
        };
        this.updateFixture = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this.matchService.update(id, req.body);
                const updatedMatch = await this.matchService.findById(id);
                res.status(200).json({
                    success: true,
                    data: updatedMatch
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteFixture = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this.matchService.delete(id);
                res.status(200).json({
                    success: true,
                    message: 'Fixture deleted successfully'
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getFixturesByLeague = async (req, res, next) => {
            try {
                const { leagueId } = req.params;
                const matches = await this.matchService.findByLeague(leagueId);
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
        this.matchService = new services_1.FixtureService();
    }
}
exports.FixtureController = FixtureController;
//# sourceMappingURL=FixtureController.js.map