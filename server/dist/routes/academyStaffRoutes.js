"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AcademyStaffController_1 = require("../controllers/AcademyStaffController");
const academyStaffSchema_1 = require("../validation-schema/academyStaffSchema");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
const staffController = new AcademyStaffController_1.AcademyStaffController();
// Public routes
router.get('/', (0, validate_1.validate)(academyStaffSchema_1.academyStaffSchema.queryStaff), staffController.getAllStaff.bind(staffController));
router.get('/:id', staffController.getStaff.bind(staffController));
// Protected routes (require authentication)
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(['admin', 'manager']), (0, validate_1.validate)(academyStaffSchema_1.academyStaffSchema.createStaff), staffController.createStaff.bind(staffController));
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin', 'manager']), (0, validate_1.validate)(academyStaffSchema_1.academyStaffSchema.updateStaff), staffController.updateStaff.bind(staffController));
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin']), staffController.deleteStaff.bind(staffController));
exports.default = router;
//# sourceMappingURL=academyStaffRoutes.js.map