import { Router } from 'express';
import { PlayerController } from '../controllers/PlayerController';
import { authenticate as authMiddleware, authorize as rbacMiddleware } from '../middleware/auth';

const router = Router();
const controller = new PlayerController();

// Public
router.get('/', controller.listPlayers);
router.get('/:id', controller.getPlayerProfile);

// Admin/Scout Protected
router.use(authMiddleware);
router.post('/', rbacMiddleware(['admin', 'scout']), controller.createPlayer);
router.patch('/:id/stats', rbacMiddleware(['admin', 'academy_staff']), controller.updateStats);
router.get('/:id/report', rbacMiddleware(['admin', 'scout']), controller.generateScoutReport);

export default router;