import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validate';
import userSchemas from '../validation-schema/userSchema';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

router.post('/signup', validate(userSchemas.register), (req, res, next) => authController.signupAdvertiser(req, res, next));
router.post('/login', validate(userSchemas.login), (req, res, next) => authController.login(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));
router.post('/verify-email', (req, res, next) => authController.verifyEmail(req, res, next));
router.post('/resend-code', (req, res, next) => authController.resendCode(req, res, next));
router.post('/forgot-password', (req, res, next) => authController.forgotPassword(req, res, next));
router.post('/reset-password', (req, res, next) => authController.resetPassword(req, res, next));
router.post('/refresh-token', (req, res, next) => authController.refreshToken(req, res, next));
router.get('/me', authenticate, (req, res, next) => authController.getMe(req, res, next));

// Admin-only: invite a new non-fan user (scout, academy_staff, admin, etc.)
router.post('/invite', authenticate, requireAdmin, (req, res, next) => authController.inviteUser(req, res, next));

export default router;