import { Router } from 'express';
import { LineupController } from '../controllers/LineupController';
import { validate } from '../middleware/validate';
import {
  createLineupSchema,
  updateLineupSchema,
  getLineupSchema,
  deleteLineupSchema,
  getLineupByFixtureSchema,
  batchUpdateLineupSchema,
} from '../validation-schema/lineup.schema';

const router = Router();
const lineupController = new LineupController();

router.post('/', lineupController.createLineup);
router.get('/:fixtureId', lineupController.getLineupByFixture);
router.get('/:fixtureId/starters', lineupController.getStartersByFixture);
router.get('/:fixtureId/substitutes', lineupController.getSubstitutesByFixture);
router.post('/:fixtureId/batch', lineupController.batchUpdateLineup);
router.get('/:id/player', lineupController.getLineupPlayer);
router.put('/:id', lineupController.updateLineupPlayer);
router.delete('/:id', lineupController.deleteLineupPlayer);

export default router;