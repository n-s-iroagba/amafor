"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/feeds.routes.ts
const express_1 = require("express");
const FeedsController_1 = require("../controllers/FeedsController");
// import { authenticateToken, authorizeRoles } from '../middleware/auth';
const router = (0, express_1.Router)();
const feedsController = new FeedsController_1.FeedsController();
// Admin routes
router.get('/', 
// authenticateToken, 
// authorizeRoles(['general-admin', 'sports-admin']), 
feedsController.getFeedSources);
router.post('/', 
// authenticateToken, 
// authorizeRoles(['general-admin', 'sports-admin']), 
// validate(RssFeedSourceSchema),
feedsController.createFeedSource);
router.get('/:id', 
// authenticateToken, 
// authorizeRoles(['general-admin', 'sports-admin']), 
// validate(FeedSourceIdParamSchema),
feedsController.getFeedSource);
router.put('/:id', 
// authenticateToken, 
// authorizeRoles(['general-admin', 'sports-admin']), 
// validate(FeedSourceIdParamSchema),
// validate(RssFeedSourceSchema),
feedsController.updateFeedSource);
router.delete('/:id', 
// authenticateToken, 
// authorizeRoles(['general-admin', 'sports-admin']), 
// validate(FeedSourceIdParamSchema),
feedsController.deleteFeedSource);
exports.default = router;
//# sourceMappingURL=feedsRoutes.js.map