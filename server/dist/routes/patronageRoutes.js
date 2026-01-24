"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PatronageController_1 = require("../controllers/PatronageController");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
const controller = new PatronageController_1.PatronageController();
// Public routes
router.get('/packages', controller.listPackages);
// Secure routes
router.use(middlewares_1.authMiddleware);
router.post('/subscribe', controller.subscribe);
router.get('/status', controller.checkStatus);
exports.default = router;
//# sourceMappingURL=patronageRoutes.js.map