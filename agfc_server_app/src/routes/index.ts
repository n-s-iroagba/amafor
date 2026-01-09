import { Router } from 'express';

// Phase 1: Foundation
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import systemRoutes from './systemRoutes'; // Assuming you implemented this based on the plan
// import auditRoutes from './auditRoutes'; // If audit needs direct routes (e.g., export logs)

// Phase 2: Football Operations
import playerRoutes from './playerRoutes';
import matchRoutes from './matchRoutes';
import academyRoutes from './academyRoutes';

// Phase 3: Revenue Engines
import contentRoutes from './contentRoutes';
import donationRoutes from './donationRoutes';
import patronageRoutes from './patronageRoutes';

// Phase 4: Advanced Systems
import advertisingRoutes from './advertisingRoutes';
import analyticsRoutes from './analyticsRoutes';

const router = Router();

// --- MOUNTING ROUTES ---

// Phase 1: Foundation
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/system', systemRoutes);
// router.use('/audit', auditRoutes);

// Phase 2: Football Operations
router.use('/players', playerRoutes);
router.use('/matches', matchRoutes);
router.use('/academy', academyRoutes);

// Phase 3: Revenue Engines
router.use('/content', contentRoutes);
router.use('/donations', donationRoutes);
router.use('/patronage', patronageRoutes);

// Phase 4: Advanced Systems
router.use('/ads', advertisingRoutes);
router.use('/analytics', analyticsRoutes);

export default router;