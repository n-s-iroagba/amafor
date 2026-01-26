import { Router } from 'express';
import { PatronageController } from '../controllers/PatronageController';
import { authenticate as authMiddleware, authorize } from '../middleware/auth';

const router = Router();
const controller = new PatronageController();

// Public routes
router.get('/packages', controller.listPackages);
router.get('/packages/:id', controller.getPackage);
router.get('/', controller.getPublicPatrons);
router.get('/top', controller.getTopPatrons);

// Secure routes
router.use(authMiddleware);

// Admin routes
router.post('/packages', authorize(['admin']), controller.createPackage);
router.put('/packages/:id', authorize(['admin']), controller.updatePackage);
router.delete('/packages/:id', authorize(['admin']), controller.deletePackage);

router.post('/subscribe', controller.subscribe);
router.get('/status', controller.checkStatus);

export default router;