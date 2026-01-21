import { Router } from 'express';
import { FixtureSummaryController } from '../controllers/FixtureSummaryController';
import { validate } from '../middleware/validation';
import {
  createFixtureSummarySchema,
  updateFixtureSummarySchema,
  getFixtureSummarySchema,
  deleteFixtureSummarySchema,
  getFixtureSummaryByFixtureSchema,
} from '../validations/matchSummary.schema';

const router = Router();
const matchSummaryController = new FixtureSummaryController();

router.post('/:fixtureId', matchSummaryController.createFixtureSummary);
router.get('/fixture/:fixtureId', validate(getFixtureSummaryByFixtureSchema), matchSummaryController.getFixtureSummaryByFixture);
router.get('/:id', validate(getFixtureSummarySchema), matchSummaryController.getFixtureSummary);
router.put('/:id', validate(updateFixtureSummarySchema), matchSummaryController.updateFixtureSummary);
router.delete('/:id', validate(deleteFixtureSummarySchema), matchSummaryController.deleteFixtureSummary);

export default router;  