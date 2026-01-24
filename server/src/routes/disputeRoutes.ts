import { Router } from 'express';
import { DisputeController } from '../controllers/DisputeController';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const controller = new DisputeController();

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
