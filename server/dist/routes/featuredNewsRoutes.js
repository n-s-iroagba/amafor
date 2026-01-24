"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FeaturedNewsController_1 = require("../controllers/FeaturedNewsController");
// import { authenticate } from '../middleware/auth'; 
const router = (0, express_1.Router)();
const controller = new FeaturedNewsController_1.FeaturedNewsController();
// Public routes
router.get('/homepage', controller.getHomepageNews);
router.get('/', controller.listNews);
exports.default = router;
//# sourceMappingURL=featuredNewsRoutes.js.map