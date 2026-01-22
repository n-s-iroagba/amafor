"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdCreativeController_1 = require("../controllers/AdCreativeController");
const adCreativeSchema_1 = require("../validation-schema/adCreativeSchema");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
const adCreativeController = new AdCreativeController_1.AdCreativeController();
// Public routes (if any needed, e.g. for ad serving, though that might be in specific ad serving controller)
router.get('/', (0, validate_1.validate)(adCreativeSchema_1.adCreativeSchema.queryAdCreative), adCreativeController.getAllAdCreatives.bind(adCreativeController));
router.get('/:id', adCreativeController.getAdCreativeById.bind(adCreativeController));
// Protected routes (require authentication)
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(['admin', 'advertiser']), (0, validate_1.validate)(adCreativeSchema_1.adCreativeSchema.createAdCreative), adCreativeController.createAdCreative.bind(adCreativeController));
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin', 'advertiser']), (0, validate_1.validate)(adCreativeSchema_1.adCreativeSchema.updateAdCreative), adCreativeController.updateAdCreative.bind(adCreativeController));
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin']), adCreativeController.deleteAdCreative.bind(adCreativeController));
exports.default = router;
//# sourceMappingURL=adCreativeRoutes.js.map