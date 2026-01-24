"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdvertisingController_1 = require("../controllers/AdvertisingController");
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const advertisementSchema_1 = require("../validation-schema/advertisementSchema");
const AdCreativeController_1 = require("../controllers/AdCreativeController");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
const controller = new AdvertisingController_1.AdvertisingController();
const creativeController = new AdCreativeController_1.AdCreativeController();
// Create Campaign
router.post('/campaigns', auth_1.authenticate, (0, auth_1.authorize)(['advertiser', 'admin', 'commercial_manager']), (0, validate_1.validate)(advertisementSchema_1.advertisementSchema.createCampaign), (0, asyncHandler_1.asyncHandler)(controller.createCampaign));
// Update Campaign
router.put('/campaigns/:id', auth_1.authenticate, (0, auth_1.authorize)(['advertiser', 'admin', 'commercial_manager']), (0, validate_1.validate)(advertisementSchema_1.advertisementSchema.updateCampaign), (0, asyncHandler_1.asyncHandler)(controller.updateCampaign));
// Delete Campaign
router.delete('/campaigns/:id', auth_1.authenticate, (0, auth_1.authorize)(['advertiser', 'admin', 'commercial_manager']), (0, asyncHandler_1.asyncHandler)(controller.deleteCampaign));
// Get Campaign Creatives
router.get('/campaigns/:id/creatives', auth_1.authenticate, (0, auth_1.authorize)(['advertiser', 'admin', 'commercial_manager']), (0, asyncHandler_1.asyncHandler)(creativeController.getCreativesByCampaign.bind(creativeController)));
// Get Active Campaigns
router.get('/campaigns/active', auth_1.authenticate, (0, auth_1.authorize)(['advertiser', 'admin', 'commercial_manager']), (0, asyncHandler_1.asyncHandler)(controller.getActiveCampaigns));
// Get Pending Campaigns
router.get('/campaigns/pending', auth_1.authenticate, (0, auth_1.authorize)(['advertiser', 'admin', 'commercial_manager']), (0, asyncHandler_1.asyncHandler)(controller.getPendingCampaigns));
// Get Expired Campaigns
router.get('/campaigns/expired', auth_1.authenticate, (0, auth_1.authorize)(['advertiser', 'admin', 'commercial_manager']), (0, asyncHandler_1.asyncHandler)(controller.getExpiredCampaigns));
// Get Advertiser Reports
router.get('/reports', auth_1.authenticate, (0, auth_1.authorize)(['advertiser', 'admin', 'commercial_manager']), (0, asyncHandler_1.asyncHandler)(controller.getAdvertiserReports));
// Ad Serving (Public)
router.get('/serve/:zone', (0, asyncHandler_1.asyncHandler)(controller.getAdForZone));
// Track Click (Public)
router.get('/track/:id', (0, asyncHandler_1.asyncHandler)(controller.trackClick));
exports.default = router;
//# sourceMappingURL=advertisingRoutes.js.map