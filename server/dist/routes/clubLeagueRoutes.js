"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LeagueStatisticsController_1 = require("../controllers/LeagueStatisticsController");
const leagueStatistics_validation_1 = require("../validation-schema/leagueStatistics.validation");
const validate_1 = require("../middleware/validate");
const leagueStatisticsController = new LeagueStatisticsController_1.LeagueStatisticsController();
const router = express_1.default.Router();
// Create league statistics
router.post('/', (0, validate_1.validate)(leagueStatistics_validation_1.validateLeagueStatistics.create), leagueStatisticsController.createStatistics.bind(leagueStatisticsController));
// Get all statistics for a league
router.get('/league/:leagueId', (0, validate_1.validate)(leagueStatistics_validation_1.validateLeagueStatistics.getAll), leagueStatisticsController.getAllStatistics.bind(leagueStatisticsController));
// Get league standings
router.get('/league/:leagueId/standings', leagueStatisticsController.getLeagueStandings.bind(leagueStatisticsController));
// Get single statistics
router.get('/:id', (0, validate_1.validate)(leagueStatistics_validation_1.validateLeagueStatistics.getById), leagueStatisticsController.getStatisticsById.bind(leagueStatisticsController));
// Get team statistics
router.get('/league/:leagueId/team/:team', (0, validate_1.validate)(leagueStatistics_validation_1.validateLeagueStatistics.getTeamStats), leagueStatisticsController.getTeamStatistics.bind(leagueStatisticsController));
// Update statistics
router.put('/:id', (0, validate_1.validate)(leagueStatistics_validation_1.validateLeagueStatistics.update), leagueStatisticsController.updateStatistics.bind(leagueStatisticsController));
// Delete statistics
router.delete('/:id', (0, validate_1.validate)(leagueStatistics_validation_1.validateLeagueStatistics.getById), leagueStatisticsController.deleteStatistics.bind(leagueStatisticsController));
// Update match result
router.post('/league/:leagueId/match', (0, validate_1.validate)(leagueStatistics_validation_1.validateLeagueStatistics.updateFixtureResult), leagueStatisticsController.updateFixtureResult.bind(leagueStatisticsController));
// Get top scorers
router.get('/league/:leagueId/top-scorers', leagueStatisticsController.getTopScorers.bind(leagueStatisticsController));
// Get top defenses
router.get('/league/:leagueId/top-defenses', leagueStatisticsController.getTopDefenses.bind(leagueStatisticsController));
// Get form table
router.get('/league/:leagueId/form', leagueStatisticsController.getFormTable.bind(leagueStatisticsController));
// Get home/away stats
router.get('/league/:leagueId/home-away', leagueStatisticsController.getHomeAwayStats.bind(leagueStatisticsController));
// Get league summary
router.get('/league/:leagueId/summary', leagueStatisticsController.getLeagueSummary.bind(leagueStatisticsController));
exports.default = router;
//# sourceMappingURL=clubLeagueRoutes.js.map