"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DisputeController_1 = require("../controllers/DisputeController");
const auth_1 = require("../middleware/auth");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
const controller = new DisputeController_1.DisputeController();
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(['advertiser']), (0, asyncHandler_1.asyncHandler)(controller.createDispute));
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(['advertiser']), (0, asyncHandler_1.asyncHandler)(controller.getMyDisputes));
router.get('/:id', auth_1.authenticate, (0, auth_1.authorize)(['advertiser', 'admin']), (0, asyncHandler_1.asyncHandler)(controller.getDispute));
exports.default = router;
//# sourceMappingURL=disputeRoutes.js.map