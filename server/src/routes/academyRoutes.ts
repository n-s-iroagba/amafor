import { Router } from 'express';
import { AcademyController } from '../controllers/AcademyController';
import { authenticate as authMiddleware } from '../middleware/auth';

const router = Router();
const controller = new AcademyController();

router.use(authMiddleware);

router.get('/sessions', controller.getSessions);
router.post('/attendance', controller.logAttendance);

router.get('/:group(trialists|guardians|all)', controller.getRecipients);
router.post('/communications/send', controller.sendCommunications);

export default router;
