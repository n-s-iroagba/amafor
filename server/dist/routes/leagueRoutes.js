"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LeagueController_1 = require("../controllers/LeagueController");
const router = express_1.default.Router();
const leagueController = new LeagueController_1.LeagueController();
router.get('/', leagueController.listLeagues);
router.post('/', leagueController.createLeague);
router.get('/tables', leagueController.getLeaguesWithTables); // Specific route must come before :id
router.get('/:id/table', leagueController.getLeagueTable);
router.get('/:id', leagueController.getLeague);
router.put('/:id', leagueController.updateLeague);
router.delete('/:id', leagueController.deleteLeague);
exports.default = router;
//# sourceMappingURL=leagueRoutes.js.map