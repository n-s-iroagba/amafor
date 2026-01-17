"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const AuthController_1 = require("../controllers/AuthController");
const authController = new AuthController_1.AuthController();
const router = express_1.default.Router();
router.post('/signup', authController.signupAdvertiser);
router.post('/signup/admin', authController.signupAdmin);
router.post('/signup/sports-admin', authController.createSportsAdmin);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification-code', authController.resendCode);
router.post('/refresh-token', authController.refreshToken);
router.get('/me', auth_1.authenticateToken, authController.getMe);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map