"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PatronageController_1 = require("../controllers/PatronageController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new PatronageController_1.PatronageController();
// Public routes
router.get('/packages', controller.listPackages);
// Secure routes
router.use(auth_1.authenticate);
router.post('/subscribe', controller.subscribe);
router.get('/status', controller.checkStatus);
exports.default = router;
//# sourceMappingURL=patronageRoutes.js.map