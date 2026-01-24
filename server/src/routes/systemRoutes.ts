import { Router } from 'express';
import { SystemController } from '../controllers/SystemController';
import { AuditController } from '../controllers/AuditController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const systemController = new SystemController();
const auditController = new AuditController();

router.get('/health', systemController.getHealth);
// router.get('/cookie-consent', systemController.getCookieConsent);
router.post('/diagnostic', authenticate, authorize(['admin']), systemController.runDiagnostic);

// Backup Routes
router.get('/backups', authenticate, authorize(['admin']), systemController.listBackups);
router.post('/backups', authenticate, authorize(['admin']), systemController.createBackup);
router.post('/backups/:id/restore', authenticate, authorize(['admin']), systemController.restoreBackup);
router.delete('/backups/:id', authenticate, authorize(['admin']), systemController.deleteBackup);
router.get('/backups/:id/download', authenticate, authorize(['admin']), systemController.downloadBackup);

// Audit Routes (grouped under system for simplicity)
router.get('/audit/:entityType/:entityId', authenticate, authorize(['admin']), auditController.getEntityHistory);
router.get('/audit', authenticate, authorize(['admin']), systemController.getAuditLogs);

// System Status/Config Routes
router.get('/admin/system-status', authenticate, authorize(['admin']), systemController.getConfig);
router.put('/admin/system-status', authenticate, authorize(['admin']), systemController.updateConfig);

export default router;