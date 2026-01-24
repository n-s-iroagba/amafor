"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PaymentController_1 = require("../controllers/PaymentController");
const PaymentGatewayController_1 = require("../controllers/PaymentGatewayController");
const router = (0, express_1.Router)();
const paymentController = new PaymentController_1.PaymentController();
// PaymentGatewayController methods are static
router.get('/advertiser', (req, res) => paymentController.getAdvertiserPayments(req, res));
router.get('/', (req, res) => paymentController.getAllPayments(req, res));
router.post('/initialize', PaymentGatewayController_1.PaymentGatewayController.initializePayment);
router.post('/verify/:reference', PaymentGatewayController_1.PaymentGatewayController.verifyTransaction);
router.post('/webhook', PaymentGatewayController_1.PaymentGatewayController.handleWebhook);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map