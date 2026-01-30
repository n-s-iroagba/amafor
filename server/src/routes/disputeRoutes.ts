import { Router } from 'express';
import { DisputeController } from '../controllers/DisputeController';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const controller = new DisputeController();

// Admin Routes
router.get(
    '/admin/all',
    authenticate,
    authorize(['admin', 'sports-admin']),
    asyncHandler(controller.getAllDisputes)
);

router.put(
    '/admin/:id/resolve',
    authenticate,
    authorize(['admin', 'sports-admin']),
    asyncHandler(controller.resolveDispute)
);

router.post(
    '/',
    authenticate,
    authorize(['advertiser']),
    asyncHandler(controller.createDispute)
);

router.get(
    '/',
    authenticate,
    authorize(['advertiser']),
    asyncHandler(controller.getMyDisputes)
);

router.get(
    '/:id',
    authenticate,
    authorize(['advertiser', 'admin']),
    asyncHandler(controller.getDispute)
);

export default router;
