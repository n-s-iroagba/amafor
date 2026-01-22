"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SystemController_1 = require("../controllers/SystemController");
const AuditController_1 = require("../controllers/AuditController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const systemController = new SystemController_1.SystemController();
const auditController = new AuditController_1.AuditController();
router.get('/health', systemController.getHealth);
router.get('/cookie-consent', systemController.getCookieConsent);
// Audit Routes (grouped under system for simplicity)
router.get('/audit/:entityType/:entityId', auth_1.authenticate, (0, auth_1.authorize)(['admin']), auditController.getEntityHistory);
exports.default = router;
//# sourceMappingURL=systemRoutes.js.map