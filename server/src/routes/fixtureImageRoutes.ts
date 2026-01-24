import { Router } from 'express';
import { FixtureImageController } from '../controllers/FixtureImageController';
import { validate } from '../middleware/validation';
import {
  createFixtureImageSchema,
  updateFixtureImageSchema,
  getFixtureImageSchema,
  deleteFixtureImageSchema,
  getFixtureImagesByFixtureSchema,
} from '../validations/fixtureImage.schema';

const router = Router();
const fixtureImageController = new FixtureImageController();

router.post('/:fixtureId', fixtureImageController.createFixtureImage);
router.get('/fixture/:fixtureId', validate(getFixtureImagesByFixtureSchema), fixtureImageController.getFixtureImagesByFixture);
router.get('/:id', validate(getFixtureImageSchema), fixtureImageController.getFixtureImage);
router.put('/:id', validate(updateFixtureImageSchema), fixtureImageController.updateFixtureImage);
router.delete('/:id', validate(deleteFixtureImageSchema), fixtureImageController.deleteFixtureImage);

export default router;