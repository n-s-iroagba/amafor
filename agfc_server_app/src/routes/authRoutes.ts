import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
// We assume a validate middleware exists that uses your schema validation
import { validateRequest } from '../middleware/validation'; 
import userSchemas from '../schemas/user'; // Assuming schema structure based on project contents

const router = Router();
const authController = new AuthController();

router.post('/register', validateRequest(userSchemas.register), authController.register);
router.post('/login', validateRequest(userSchemas.login), authController.login);
router.post('/logout', authController.logout);

export default router;