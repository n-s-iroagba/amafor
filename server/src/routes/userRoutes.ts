import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate, authorize } from '../middleware/auth';
// import { validateRequest } from '../middleware/validation';
// import userSchemas from '../schemas/user';

const router = Router();
const userController = new UserController();

// Public/Private mixed routes (handled by controller logic or auth middleware)
router.get('/profile', authenticate, userController.getProfile);
router.patch('/profile', authenticate, /* validateRequest(userSchemas.updateProfile), */ userController.updateProfile);

// Admin Routes
router.patch('/:userId/verify', authenticate, authorize(['admin']), userController.verifyUser);

export default router;