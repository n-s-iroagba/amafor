import { Router } from 'express';
import { AcademyStaffController } from '@/controllers/AcademyStaffController';
import { 
  createStaffValidation, 
  updateStaffValidation, 
  queryValidation 
} from '@/middleware/staffValidation';
import { authenticate, authorize } from '@/middleware/auth';
import { validate } from '@/middleware/validate';

const router = Router();
const staffController = new AcademyStaffController();

// Public routes
router.get('/', queryValidation, validate, staffController.getAllStaff.bind(staffController));
router.get('/search', staffController.searchStaff.bind(staffController));
router.get('/stats', staffController.getStaffStats.bind(staffController));
router.get('/category/:category', staffController.getStaffByCategory.bind(staffController));
router.get('/:id', staffController.getStaff.bind(staffController));

// Protected routes (require authentication)
router.post(
  '/',
  authenticate,
  authorize(['admin', 'manager']),
  createStaffValidation,
  validate,
  staffController.createStaff.bind(staffController)
);

router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'manager']),
  updateStaffValidation,
  validate,
  staffController.updateStaff.bind(staffController)
);

router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  staffController.deleteStaff.bind(staffController)
);

router.post(
  '/bulk-import',
  authenticate,
  authorize(['admin']),
  staffController.bulkImportStaff.bind(staffController)
);

export default router;