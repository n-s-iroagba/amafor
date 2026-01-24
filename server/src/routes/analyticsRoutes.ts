import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const analyticsController = new AnalyticsController();

router.get('/dashboard', authenticate, authorize(['admin']), (req, res, next) => analyticsController.getDashboardStats(req, res, next));
router.get('/revenue', authenticate, authorize(['admin']), (req, res, next) => analyticsController.getRevenueStats(req, res, next));

export default router;
