"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const FixtureController_1 = require("../controllers/FixtureController");
const router = express_1.default.Router();
const fixtureController = new FixtureController_1.FixtureController();
// Create fixture (POST /fixtures/:leagueId)
// Note: Client calls /fixtures/:leagueId, controller extracts leagueId from body or params?
// Controller uses req.body. Service uses data. leagueId is likely in data.
// API_ROUTES.FIXTURES.CREATE(leagueId) -> /fixtures/leagueId
// Wait, client API_ROUTES.FIXTURES.CREATE is `/fixtures/${leagueId}`.
// So route should be `/:leagueId`.
// Actually, `FixtureController.createFixture` expects `req.body`.
// The client Hook `usePost` sends `body`. The URL is primarily for endpoint identification.
// If the controller ignores `req.params.leagueId`, it's fine, but better to match.
router.post('/:leagueId', fixtureController.createFixture);
router.get('/', fixtureController.listAllFixturees);
router.get('/upcoming', fixtureController.getUpcomingFixturees);
router.get('/gallery', fixtureController.getGallery);
router.get('/league/:leagueId', fixtureController.getFixturesByLeague);
router.get('/one/:id', fixtureController.getFixtureById);
router.put('/:id', fixtureController.updateFixture);
router.delete('/:id', fixtureController.deleteFixture);
// Specific actions
router.patch('/:id/result', fixtureController.updateResult);
router.get('/table', fixtureController.getLeagueTable);
exports.default = router;
//# sourceMappingURL=fixtureRoutes.js.map