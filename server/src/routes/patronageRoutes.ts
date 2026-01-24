import { Router } from 'express';
import { PatronageController } from '../controllers/PatronageController';
import { authenticate as authMiddleware } from '../middleware/auth';

const router = Router();
const controller = new PatronageController();

// Public routes
router.get('/packages', controller.listPackages);

// Secure routes
router.use(authMiddleware);

router.post('/subscribe', controller.subscribe);
router.get('/status', controller.checkStatus);

export default router;