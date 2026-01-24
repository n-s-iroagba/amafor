import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validate';
import userSchemas from '../validation-schema/userSchema';

const router = Router();
const authController = new AuthController();

router.post('/signup', validate(userSchemas.register), (req, res, next) => authController.signupAdvertiser(req, res, next));
router.post('/login', validate(userSchemas.login), (req, res, next) => authController.login(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));

export default router;