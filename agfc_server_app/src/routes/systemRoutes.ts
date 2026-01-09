import { Router } from 'express';
import { SystemController } from '../controllers/SystemController';
import { AuditController } from '../controllers/AuditController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const systemController = new SystemController();
const auditController = new AuditController();

router.get('/health', systemController.getHealth);
router.get('/cookie-consent', systemController.getCookieConsent);

// Audit Routes (grouped under system for simplicity)
router.get('/audit/:entityType/:entityId', authenticate, authorize(['admin']), auditController.getEntityHistory);

export default router;