import { Router } from 'express';
import { AdCreativeController } from '../controllers/AdCreativeController';
import { adCreativeSchema } from '../validation-schema/adCreativeSchema';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();
const adCreativeController = new AdCreativeController();

// Public routes (if any needed, e.g. for ad serving, though that might be in specific ad serving controller)
router.get('/', validate(adCreativeSchema.queryAdCreative), adCreativeController.getAllAdCreatives.bind(adCreativeController));
router.get('/:id', adCreativeController.getAdCreativeById.bind(adCreativeController));

// Protected routes (require authentication)
router.post(
    '/',
    authenticate,
    authorize(['admin', 'advertiser']),
    validate(adCreativeSchema.createAdCreative),
    adCreativeController.createAdCreative.bind(adCreativeController)
);

router.put(
    '/:id',
    authenticate,
    authorize(['admin', 'advertiser']),
    validate(adCreativeSchema.updateAdCreative),
    adCreativeController.updateAdCreative.bind(adCreativeController)
);

router.delete(
    '/:id',
    authenticate,
    authorize(['admin']),
    adCreativeController.deleteAdCreative.bind(adCreativeController)
);

export default router;
