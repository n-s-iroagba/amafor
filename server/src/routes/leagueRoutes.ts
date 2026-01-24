
import express from 'express';
import { LeagueController } from '../controllers/LeagueController';

const router = express.Router();
const leagueController = new LeagueController();

router.get('/', leagueController.listLeagues);
router.post('/', leagueController.createLeague);
router.get('/tables', leagueController.getLeaguesWithTables); // Specific route must come before :id
router.get('/:id/table', leagueController.getLeagueTable);
router.get('/:id', leagueController.getLeague);
router.put('/:id', leagueController.updateLeague);
router.delete('/:id', leagueController.deleteLeague);

export default router;
