import { Router } from 'express';
import { PatronageController } from '../controllers/PatronageController';
import { authMiddleware } from '../middlewares';

const router = Router();
const controller = new PatronageController();

// All patronage routes require authentication
router.use(authMiddleware);

router.post('/subscribe', controller.subscribe);
router.get('/status', controller.checkStatus);

export default router;