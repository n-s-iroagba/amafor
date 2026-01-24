import express from 'express';
import { FixtureController } from '../controllers/FixtureController';

const router = express.Router();
const fixtureController = new FixtureController();

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
router.get('/next-upcoming', fixtureController.getNextUpcoming);
router.get('/gallery', fixtureController.getGallery);
router.get('/league/:leagueId', fixtureController.getFixturesByLeague);
router.get('/one/:id', fixtureController.getFixtureById);
router.put('/:id', fixtureController.updateFixture);
router.delete('/:id', fixtureController.deleteFixture);

// Specific actions
router.patch('/:id/result', fixtureController.updateResult);
router.get('/table', fixtureController.getLeagueTable);

export default router;
