import { Router } from 'express';
import { MatchSummaryController } from '../controllers/MatchSummaryController';
import { validate } from '../middleware/validation';
import {
  createMatchSummarySchema,
  updateMatchSummarySchema,
  getMatchSummarySchema,
  deleteMatchSummarySchema,
  getMatchSummaryByFixtureSchema,
} from '../validations/matchSummary.schema';

const router = Router();
const matchSummaryController = new MatchSummaryController();

router.post('/:fixtureId', matchSummaryController.createMatchSummary);
router.get('/fixture/:fixtureId', validate(getMatchSummaryByFixtureSchema), matchSummaryController.getMatchSummaryByFixture);
router.get('/:id', validate(getMatchSummarySchema), matchSummaryController.getMatchSummary);
router.put('/:id', validate(updateMatchSummarySchema), matchSummaryController.updateMatchSummary);
router.delete('/:id', validate(deleteMatchSummarySchema), matchSummaryController.deleteMatchSummary);

export default router;  