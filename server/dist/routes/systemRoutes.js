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
// router.get('/cookie-consent', systemController.getCookieConsent);
router.post('/diagnostic', auth_1.authenticate, (0, auth_1.authorize)(['admin']), systemController.runDiagnostic);
// Backup Routes
router.get('/backups', auth_1.authenticate, (0, auth_1.authorize)(['admin']), systemController.listBackups);
router.post('/backups', auth_1.authenticate, (0, auth_1.authorize)(['admin']), systemController.createBackup);
router.post('/backups/:id/restore', auth_1.authenticate, (0, auth_1.authorize)(['admin']), systemController.restoreBackup);
router.delete('/backups/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin']), systemController.deleteBackup);
router.get('/backups/:id/download', auth_1.authenticate, (0, auth_1.authorize)(['admin']), systemController.downloadBackup);
// Audit Routes (grouped under system for simplicity)
router.get('/audit/:entityType/:entityId', auth_1.authenticate, (0, auth_1.authorize)(['admin']), auditController.getEntityHistory);
router.get('/audit', auth_1.authenticate, (0, auth_1.authorize)(['admin']), systemController.getAuditLogs);
// System Status/Config Routes
router.get('/admin/system-status', auth_1.authenticate, (0, auth_1.authorize)(['admin']), systemController.getConfig);
router.put('/admin/system-status', auth_1.authenticate, (0, auth_1.authorize)(['admin']), systemController.updateConfig);
exports.default = router;
//# sourceMappingURL=systemRoutes.js.map