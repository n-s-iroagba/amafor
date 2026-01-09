import { Router } from 'express';
import { AcademyController } from '../controllers/AcademyController';
import { authMiddleware, rbacMiddleware } from '../middlewares';

const router = Router();
const controller = new AcademyController();

// Public
router.get('/news', controller.getAcademyNews);
router.post('/register', controller.registerTrialist);

// Protected
router.use(authMiddleware);
router.get('/applications', rbacMiddleware(['admin', 'academy_manager']), controller.listApplications);
router.patch('/applications/:id', rbacMiddleware(['admin', 'academy_manager']), controller.updateApplicationStatus);

export default router;