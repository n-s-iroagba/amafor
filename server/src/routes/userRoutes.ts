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
router.get('/pending-advertisers', authenticate, authorize(['admin']), userController.getPendingAdvertisers);
router.patch('/:userId/verify', authenticate, authorize(['admin']), userController.verifyUser);

// General User Management (Admin)
router.get('/', authenticate, authorize(['admin']), userController.listUsers);
router.post('/', authenticate, authorize(['admin']), userController.createUser);
router.get('/:id', authenticate, authorize(['admin', 'scout', 'advertiser']), userController.getUser); // Allow view for detailed profiles if needed
router.put('/:id', authenticate, authorize(['admin']), userController.updateProfile); // Using existing update logic but might need generic update
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUser);

export default router;