import { Router } from 'express';
import { AdvertisingController } from '../controllers/AdvertisingController';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { advertisementSchema } from '../validation-schema/advertisementSchema';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const controller = new AdvertisingController();

// Create Campaign
router.post(
    '/campaigns',
    authenticate,
    authorize(['advertiser', 'admin', 'commercial_manager']),
    validate(advertisementSchema.createCampaign),
    asyncHandler(controller.createCampaign)
);

// Update Campaign
router.put(
    '/campaigns/:id',
    authenticate,
    authorize(['advertiser', 'admin', 'commercial_manager']),
    validate(advertisementSchema.updateCampaign),
    asyncHandler(controller.updateCampaign)
);

// Delete Campaign
router.delete(
    '/campaigns/:id',
    authenticate,
    authorize(['advertiser', 'admin', 'commercial_manager']),
    asyncHandler(controller.deleteCampaign)
);

// Get Active Campaigns
router.get(
    '/campaigns/active',
    authenticate,
    authorize(['advertiser', 'admin', 'commercial_manager']),
    asyncHandler(controller.getActiveCampaigns)
);

// Get Pending Campaigns
router.get(
    '/campaigns/pending',
    authenticate,
    authorize(['advertiser', 'admin', 'commercial_manager']),
    asyncHandler(controller.getPendingCampaigns)
);

// Get Expired Campaigns
router.get(
    '/campaigns/expired',
    authenticate,
    authorize(['advertiser', 'admin', 'commercial_manager']),
    asyncHandler(controller.getExpiredCampaigns)
);

// Ad Serving (Public)
router.get(
    '/serve/:zone',
    asyncHandler(controller.getAdForZone)
);

// Track Click (Public)
router.get(
    '/track/:id',
    asyncHandler(controller.trackClick)
);

export default router;
