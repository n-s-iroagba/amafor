"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdZoneController_1 = require("../controllers/AdZoneController");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
const controller = new AdZoneController_1.AdZoneController();
router.get('/', (0, asyncHandler_1.asyncHandler)(controller.getAllZones));
router.get('/active', (0, asyncHandler_1.asyncHandler)(controller.getActiveZones));
exports.default = router;
//# sourceMappingURL=adZoneRoutes.js.map