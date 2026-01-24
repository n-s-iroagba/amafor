import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authenticate } from '../middleware/auth';

const router = Router();
const notificationController = new NotificationController();

router.get('/', authenticate, (req, res) => notificationController.listNotifications(req, res));
router.put('/:id/read', authenticate, (req, res) => notificationController.markAsRead(req, res));
router.put('/read-all', authenticate, (req, res) => notificationController.markAllAsRead(req, res));

export default router;
