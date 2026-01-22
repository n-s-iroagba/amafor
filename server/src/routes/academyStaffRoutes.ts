import { Router } from 'express';
import { AcademyStaffController } from '../controllers/AcademyStaffController';
import { academyStaffSchema } from '../validation-schema/academyStaffSchema';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();
const staffController = new AcademyStaffController();

// Public routes
router.get('/', validate(academyStaffSchema.queryStaff), staffController.getAllStaff.bind(staffController));
router.get('/:id', staffController.getStaff.bind(staffController));

// Protected routes (require authentication)
router.post(
  '/',
  authenticate,
  authorize(['admin', 'manager']),
  validate(academyStaffSchema.createStaff),
  staffController.createStaff.bind(staffController)
);

router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'manager']),
  validate(academyStaffSchema.updateStaff),
  staffController.updateStaff.bind(staffController)
);

router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  staffController.deleteStaff.bind(staffController)
);

export default router;