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
router.patch('/:userId/verify', auth_1.authenticate, (0, auth_1.authorize)(['admin']), userController.verifyUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map