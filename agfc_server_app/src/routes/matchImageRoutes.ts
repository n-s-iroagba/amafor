import { Router } from 'express';
import { FixtureImageController } from '../controllers/FixtureImageController';
import { validate } from '../middleware/validation';
import {
  createFixtureImageSchema,
  updateFixtureImageSchema,
  getFixtureImageSchema,
  deleteFixtureImageSchema,
  getFixtureImagesByFixtureSchema,
} from '../validations/matchImage.schema';

const router = Router();
const matchImageController = new FixtureImageController();

router.post('/:fixtureId', matchImageController.createFixtureImage);
router.get('/fixture/:fixtureId', validate(getFixtureImagesByFixtureSchema), matchImageController.getFixtureImagesByFixture);
router.get('/:id', validate(getFixtureImageSchema), matchImageController.getFixtureImage);
router.put('/:id', validate(updateFixtureImageSchema), matchImageController.updateFixtureImage);
router.delete('/:id', validate(deleteFixtureImageSchema), matchImageController.deleteFixtureImage);

export default router;