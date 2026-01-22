"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AcademyController_1 = require("../controllers/AcademyController");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
const controller = new AcademyController_1.AcademyController();
// Public
router.get('/news', controller.getAcademyNews);
router.post('/register', controller.registerTrialist);
// Protected
router.use(middlewares_1.authMiddleware);
router.get('/applications', (0, middlewares_1.rbacMiddleware)(['admin', 'academy_manager']), controller.listApplications);
router.patch('/applications/:id', (0, middlewares_1.rbacMiddleware)(['admin', 'academy_manager']), controller.updateApplicationStatus);
exports.default = router;
//# sourceMappingURL=academyRoutes.js.map