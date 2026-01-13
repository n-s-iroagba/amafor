import { Router } from 'express';
import { MatchImageController } from '../controllers/MatchImageController';
import { validate } from '../middleware/validation';
import {
  createMatchImageSchema,
  updateMatchImageSchema,
  getMatchImageSchema,
  deleteMatchImageSchema,
  getMatchImagesByFixtureSchema,
} from '../validations/matchImage.schema';

const router = Router();
const matchImageController = new MatchImageController();

router.post('/:fixtureId',  matchImageController.createMatchImage);
router.get('/fixture/:fixtureId', validate(getMatchImagesByFixtureSchema), matchImageController.getMatchImagesByFixture);
router.get('/:id', validate(getMatchImageSchema), matchImageController.getMatchImage);
router.put('/:id', validate(updateMatchImageSchema), matchImageController.updateMatchImage);
router.delete('/:id', validate(deleteMatchImageSchema), matchImageController.deleteMatchImage);

export default router;