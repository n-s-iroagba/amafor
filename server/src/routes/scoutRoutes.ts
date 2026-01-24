
import { Router } from 'express';
import { ScoutController } from '../controllers/ScoutController';
import { authenticate as authMiddleware, authorize as rbacMiddleware } from '../middleware/auth';

const router = Router();
const controller = new ScoutController();

// Public Application Route
router.post('/applications', controller.submitApplication);

// Protected Routes
router.use(authMiddleware);

// Reports
router.get('/reports', rbacMiddleware(['scout', 'admin']), controller.listReports);
router.post('/reports', rbacMiddleware(['scout']), controller.createReport);
router.get('/reports/:id', rbacMiddleware(['scout', 'admin']), controller.getReport);
router.delete('/reports/:id', rbacMiddleware(['admin']), controller.deleteReport);

export default router;
