import express from 'express';
import { trialistController } from '../controllers/TrialistController';
import { trialistValidationSchemas } from '../validation-schema/trialistSchema';
import { validate } from '@middleware/validate';



const router = express.Router();

// Create trialist (with file upload)
router.post(
  '/',

  validate(trialistValidationSchemas.createTrialist),
  trialistController.createTrialist
);

// Get all trialists with filters
router.get(
  '/',
  validate(trialistValidationSchemas.filterQuery),
  trialistController.getAllTrialists
);

// Get trialist by ID
router.get(
  '/:id',
  validate(trialistValidationSchemas.trialistIdParam),
  trialistController.getTrialistById
);

// Update trialist
router.put(
  '/:id',

  validate(trialistValidationSchemas.updateTrialist),
  trialistController.updateTrialist
);

// Delete trialist
router.delete(
  '/:id',
  validate(trialistValidationSchemas.trialistIdParam),
  trialistController.deleteTrialist
);

// Update trialist status
router.patch(
  '/:id/status',
  validate(trialistValidationSchemas.updateStatus),
  trialistController.updateStatus
);

// Search trialists
router.get(
  '/search',
  validate(trialistValidationSchemas.searchQuery),
  trialistController.searchTrialists
);

// Get statistics
router.get(
  '/stats',
  trialistController.getStatistics
);

export default router;