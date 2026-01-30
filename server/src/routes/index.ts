import { Router } from 'express';

// Import all route modules
import articleRoutes from './articleRoutes';
import adCreativeRoutes from './adCreativeRoutes';
import adZoneRoutes from './adZoneRoutes';
import disputeRoutes from './disputeRoutes';

import videoRoutes from './videoRoutes';
import authRoutes from './authRoutes';

import academyStaffRoutes from './academyStaffRoutes';
import clubLeagueRoutes from './clubLeagueRoutes';
import feedsRoutes from './feedsRoutes';
import goalRoutes from './goalRoutes';
import healthRoutes from './healthRoutes';
import lineupRoutes from './lineupRoutes';
import fixtureImageRoutes from './fixtureImageRoutes';
import leagueRoutes from './leagueRoutes';
import scoutRoutes from './scoutRoutes';

import patronageRoutes from './patronageRoutes';
import paymentRoutes from './paymentRoutes';
import playerRoutes from './playerRoutes';
import systemRoutes from './systemRoutes';
import trialistRoutes from './trialistRoutes';
import userRoutes from './userRoutes';
import advertisingRoutes from './advertisingRoutes';

import fixtureRoutes from './fixtureRoutes';
import featuredNewsRoutes from './featuredNewsRoutes';

const router = Router();

// Wire all routes
router.use('/articles', articleRoutes);
router.use('/featured-news', featuredNewsRoutes); // Add this line
router.use('/fixtures', fixtureRoutes);
router.use('/ad-creatives', adCreativeRoutes);
router.use('/ads/zones', adZoneRoutes);
router.use('/ads', advertisingRoutes);
router.use('/disputes', disputeRoutes);
router.use('/videos', videoRoutes);
router.use('/auth', authRoutes);

router.use('/academy-staff', academyStaffRoutes);
router.use('/club-league-stats', clubLeagueRoutes);
router.use('/leagues', leagueRoutes);
router.use('/feeds', feedsRoutes);
router.use('/goals', goalRoutes);
router.use('/health', healthRoutes);
router.use('/lineups', lineupRoutes);
router.use('/match-gallery', fixtureImageRoutes);
router.use('/patrons', patronageRoutes);
router.use('/payments', paymentRoutes);
router.use('/players', playerRoutes);
router.use('/system', systemRoutes);
router.use('/trialists', trialistRoutes);
router.use('/users', userRoutes);
router.use('/scout', scoutRoutes);

import analyticsRoutes from './analyticsRoutes';
import notificationRoutes from './notificationRoutes';

// ... (existing imports, keep them essentially)

router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);

export default router;