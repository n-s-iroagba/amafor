"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PaymentController_1 = require("../controllers/PaymentController");
const PaymentGatewayController_1 = require("../controllers/PaymentGatewayController");
const router = (0, express_1.Router)();
router.get('/advertiser', PaymentController_1.PaymentController.getPaymentsByAdvertiserId);
router.get('/', PaymentController_1.PaymentController.getAllPayments);
router.post('/initialize', PaymentGatewayController_1.PaymentGatewayController.initializePayment);
router.post('/verify/:reference', PaymentGatewayController_1.PaymentGatewayController.verifyTransaction);
router.post('/webhook', PaymentGatewayController_1.PaymentGatewayController.handleWebhook);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map