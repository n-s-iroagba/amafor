"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ScoutController_1 = require("../controllers/ScoutController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new ScoutController_1.ScoutController();
// Public Application Route
router.post('/applications', controller.submitApplication);
// Protected Routes
router.use(auth_1.authenticate);
// Reports
router.get('/reports', (0, auth_1.authorize)(['scout', 'admin']), controller.listReports);
router.post('/reports', (0, auth_1.authorize)(['scout']), controller.createReport);
router.get('/reports/:id', (0, auth_1.authorize)(['scout', 'admin']), controller.getReport);
router.delete('/reports/:id', (0, auth_1.authorize)(['admin']), controller.deleteReport);
exports.default = router;
//# sourceMappingURL=scoutRoutes.js.map