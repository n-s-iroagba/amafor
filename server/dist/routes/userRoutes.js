"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const auth_1 = require("../middleware/auth");
// import { validateRequest } from '../middleware/validation';
// import userSchemas from '../schemas/user';
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
// Public/Private mixed routes (handled by controller logic or auth middleware)
router.get('/profile', auth_1.authenticate, userController.getProfile);
router.patch('/profile', auth_1.authenticate, /* validateRequest(userSchemas.updateProfile), */ userController.updateProfile);
// Admin Routes
router.get('/pending-advertisers', auth_1.authenticate, (0, auth_1.authorize)(['admin']), userController.getPendingAdvertisers);
router.patch('/:userId/verify', auth_1.authenticate, (0, auth_1.authorize)(['admin']), userController.verifyUser);
// General User Management (Admin)
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(['admin']), userController.listUsers);
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(['admin']), userController.createUser);
router.get('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin', 'scout', 'advertiser']), userController.getUser); // Allow view for detailed profiles if needed
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin']), userController.updateProfile); // Using existing update logic but might need generic update
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin']), userController.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map