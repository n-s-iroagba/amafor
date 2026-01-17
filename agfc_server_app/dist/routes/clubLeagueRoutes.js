"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leagueStatistics_controller_1 = require("../controllers/leagueStatistics.controller");
const leagueStatistics_validation_1 = require("../validations/leagueStatistics.validation");
const router = express_1.default.Router();
// Create league statistics
router.post('/', leagueStatistics_validation_1.validateLeagueStatistics.create, leagueStatistics_controller_1.leagueStatisticsController.createStatistics.bind(leagueStatistics_controller_1.leagueStatisticsController));
// Get all statistics for a league
router.get('/league/:leagueId', leagueStatistics_validation_1.validateLeagueStatistics.getAll, leagueStatistics_controller_1.leagueStatisticsController.getAllStatistics.bind(leagueStatistics_controller_1.leagueStatisticsController));
// Get league standings
router.get('/league/:leagueId/standings', leagueStatistics_controller_1.leagueStatisticsController.getLeagueStandings.bind(leagueStatistics_controller_1.leagueStatisticsController));
// Get single statistics
router.get('/:id', leagueStatistics_validation_1.validateLeagueStatistics.getById, leagueStatistics_controller_1.leagueStatisticsController.getStatisticsById.bind(leagueStatistics_controller_1.leagueStatisticsController));
// Get team statistics
router.get('/league/:leagueId/team/:team', leagueStatistics_validation_1.validateLeagueStatistics.getTeamStats, leagueStatistics_controller_1.leagueStatisticsController.getTeamStatistics.bind(leagueStatistics_controller_1.leagueStatisticsController));
// Update statistics
router.put('/:id', leagueStatistics_validation_1.validateLeagueStatistics.update, leagueStatistics_controller_1.leagueStatisticsController.updateStatistics.bind(leagueStatistics_controller_1.leagueStatisticsController));
// Delete statistics
router.delete('/:id', leagueStatistics_validation_1.validateLeagueStatistics.getById, leagueStatistics_controller_1.leagueStatisticsController.deleteStatistics.bind(leagueStatistics_controller_1.leagueStatisticsController));
// Update match result
router.post('/league/:leagueId/match', leagueStatistics_validation_1.validateLeagueStatistics.updateMatchResult, leagueStatistics_controller_1.leagueStatisticsController.updateMatchResult.bind(leagueStatistics_controller_1.leagueStatisticsController));
// Get top scorers
router.get('/league/:leagueId/top-scorers', leagueStatistics_controller_1.leagueStatisticsController.getTopScorers.bind(leagueStatistics_controller_1.leagueStatisticsController));
// Get top defenses
router.get('/league/:leagueId/top-defenses', leagueStatistics_controller_1.leagueStatisticsController.getTopDefenses.bind(leagueStatistics_controller_1.leagueStatisticsController));
// Get form table
router.get('/league/:leagueId/form', leagueStatistics_controller_1.leagueStatisticsController.getFormTable.bind(leagueStatistics_controller_1.leagueStatisticsController));
// Get home/away stats
router.get('/league/:leagueId/home-away', leagueStatistics_controller_1.leagueStatisticsController.getHomeAwayStats.bind(leagueStatistics_controller_1.leagueStatisticsController));
// Get league summary
router.get('/league/:leagueId/summary', leagueStatistics_controller_1.leagueStatisticsController.getLeagueSummary.bind(leagueStatistics_controller_1.leagueStatisticsController));
exports.default = router;
//# sourceMappingURL=clubLeagueRoutes.js.map