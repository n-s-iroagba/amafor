"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AcademyStaffController_1 = require("@/controllers/AcademyStaffController");
const staffValidation_1 = require("@/middleware/staffValidation");
const auth_1 = require("@/middleware/auth");
const validate_1 = require("@/middleware/validate");
const router = (0, express_1.Router)();
const staffController = new AcademyStaffController_1.AcademyStaffController();
// Public routes
router.get('/', staffValidation_1.queryValidation, validate_1.validate, staffController.getAllStaff.bind(staffController));
router.get('/search', staffController.searchStaff.bind(staffController));
router.get('/stats', staffController.getStaffStats.bind(staffController));
router.get('/category/:category', staffController.getStaffByCategory.bind(staffController));
router.get('/:id', staffController.getStaff.bind(staffController));
// Protected routes (require authentication)
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(['admin', 'manager']), staffValidation_1.createStaffValidation, validate_1.validate, staffController.createStaff.bind(staffController));
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin', 'manager']), staffValidation_1.updateStaffValidation, validate_1.validate, staffController.updateStaff.bind(staffController));
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin']), staffController.deleteStaff.bind(staffController));
router.post('/bulk-import', auth_1.authenticate, (0, auth_1.authorize)(['admin']), staffController.bulkImportStaff.bind(staffController));
exports.default = router;
//# sourceMappingURL=academyStaffRoutes.js.map