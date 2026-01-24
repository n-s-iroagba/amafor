import { Router } from 'express';
import { FixtureImageController } from '../controllers/FixtureImageController';
import { validate } from '../middleware/validate';
import {
  createFixtureImageSchema,
  updateFixtureImageSchema,
} from '../validation-schema/fixtureImage.schema';
import {
  getFixtureImageSchema,
  deleteFixtureImageSchema,
  getFixtureImagesByFixtureSchema,
} from '../validation-schema/fixtureImage.schema';

const router = Router();
const fixtureImageController = new FixtureImageController();

router.post('/:fixtureId', fixtureImageController.createFixtureImage);
router.get('/fixture/:fixtureId', validate(getFixtureImagesByFixtureSchema), fixtureImageController.getFixtureImagesByFixture);
router.get('/:id', validate(getFixtureImageSchema), fixtureImageController.getFixtureImage);
router.put('/:id', validate(updateFixtureImageSchema), fixtureImageController.updateFixtureImage);
router.delete('/:id', validate(deleteFixtureImageSchema), fixtureImageController.deleteFixtureImage);

export default router;