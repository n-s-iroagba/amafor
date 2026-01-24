import { Router } from 'express';
import { AdZoneController } from '../controllers/AdZoneController';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const controller = new AdZoneController();

router.get('/', asyncHandler(controller.getAllZones));
router.get('/active', asyncHandler(controller.getActiveZones));

export default router;
