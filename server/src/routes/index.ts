import { Router } from 'express';

// Import all route modules
import articleRoutes from './articleRoutes';
import adCreativeRoutes from './adCreativeRoutes';
import advertisementRoutes from './advertisementRoutes';
import videoRoutes from './videoRoutes';
import authRoutes from './authRoutes';
import academyRoutes from './academyRoutes';
import academyStaffRoutes from './academyStaffRoutes';
import clubLeagueRoutes from './clubLeagueRoutes';
import feedsRoutes from './feedsRoutes';
import goalRoutes from './goalRoutes';
import healthRoutes from './healthRoutes';
import lineupRoutes from './lineupRoutes';
import fixtureImageRoutes from './fixtureImageRoutes';
import matchSummaryRoutes from './matchSummaryRoutes';
import patronageRoutes from './patronageRoutes';
import paymentRoutes from './paymentRoutes';
import playerRoutes from './playerRoutes';
import systemRoutes from './systemRoutes';
import trialistRoutes from './trialistRoutes';
import userRoutes from './userRoutes';

const router = Router();

// Wire all routes
router.use('/articles', articleRoutes);
router.use('/ad-creatives', adCreativeRoutes);
router.use('/ads', advertisementRoutes);
router.use('/videos', videoRoutes);
router.use('/auth', authRoutes);
router.use('/academy', academyRoutes);
router.use('/academy-staff', academyStaffRoutes);
router.use('/club-league-stats', clubLeagueRoutes);
router.use('/feeds', feedsRoutes);
router.use('/goals', goalRoutes);
router.use('/health', healthRoutes);
router.use('/lineups', lineupRoutes);
router.use('/match-gallery', fixtureImageRoutes);
router.use('/match-summary', matchSummaryRoutes);
router.use('/patrons', patronageRoutes);
router.use('/payments', paymentRoutes);
router.use('/players', playerRoutes);
router.use('/system', systemRoutes);
router.use('/trialists', trialistRoutes);
router.use('/users', userRoutes);

export default router;