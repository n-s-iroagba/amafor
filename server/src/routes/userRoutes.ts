import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// ── Self-service (any authenticated user) ──
router.get('/profile', authenticate, userController.getProfile);
router.patch('/profile', authenticate, userController.updateProfile);  // strips roles/passwordHash internally

// ── Admin-only: pending advertiser queue ──
router.get('/pending-advertisers', authenticate, requireAdmin, userController.getPendingAdvertisers);

// ── Admin-only: status verification (approve / suspend) ──
router.patch('/:userId/verify', authenticate, requireAdmin, userController.verifyUser);

// ── Admin-only: full user management ──
router.get('/', authenticate, requireAdmin, userController.listUsers);
router.post('/', authenticate, requireAdmin, userController.createUser);
router.get('/:id', authenticate, requireAdmin, userController.getUser);          // admin-only — was leaking to scouts/advertisers
router.put('/:id', authenticate, requireAdmin, userController.updateUser);       // new admin update (allows role changes)
router.delete('/:id', authenticate, requireAdmin, userController.deleteUser);

export default router;