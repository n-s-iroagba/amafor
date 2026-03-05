import { Router } from 'express';
import { MatchSummaryController } from '../controllers/MatchSummaryController';

const router = Router();
const matchSummaryController = new MatchSummaryController();

router.post('/:fixtureId', matchSummaryController.createMatchSummary);
router.get('/fixture/:fixtureId', matchSummaryController.getMatchSummaryByFixture);
router.get('/:id', matchSummaryController.getMatchSummaryById);
router.put('/:id', matchSummaryController.updateMatchSummary);
router.delete('/:id', matchSummaryController.deleteMatchSummary);

export default router;
