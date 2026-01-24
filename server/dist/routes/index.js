"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Import all route modules
const articleRoutes_1 = __importDefault(require("./articleRoutes"));
const adCreativeRoutes_1 = __importDefault(require("./adCreativeRoutes"));
const adZoneRoutes_1 = __importDefault(require("./adZoneRoutes"));
const disputeRoutes_1 = __importDefault(require("./disputeRoutes"));
const videoRoutes_1 = __importDefault(require("./videoRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const academyRoutes_1 = __importDefault(require("./academyRoutes"));
const academyStaffRoutes_1 = __importDefault(require("./academyStaffRoutes"));
const clubLeagueRoutes_1 = __importDefault(require("./clubLeagueRoutes"));
const feedsRoutes_1 = __importDefault(require("./feedsRoutes"));
const goalRoutes_1 = __importDefault(require("./goalRoutes"));
const healthRoutes_1 = __importDefault(require("./healthRoutes"));
const lineupRoutes_1 = __importDefault(require("./lineupRoutes"));
const fixtureImageRoutes_1 = __importDefault(require("./fixtureImageRoutes"));
const leagueRoutes_1 = __importDefault(require("./leagueRoutes"));
const scoutRoutes_1 = __importDefault(require("./scoutRoutes"));
const patronageRoutes_1 = __importDefault(require("./patronageRoutes"));
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
const playerRoutes_1 = __importDefault(require("./playerRoutes"));
const systemRoutes_1 = __importDefault(require("./systemRoutes"));
const trialistRoutes_1 = __importDefault(require("./trialistRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const advertisingRoutes_1 = __importDefault(require("./advertisingRoutes"));
const fixtureRoutes_1 = __importDefault(require("./fixtureRoutes"));
const featuredNewsRoutes_1 = __importDefault(require("./featuredNewsRoutes"));
const router = (0, express_1.Router)();
// Wire all routes
router.use('/articles', articleRoutes_1.default);
router.use('/featured-news', featuredNewsRoutes_1.default); // Add this line
router.use('/fixtures', fixtureRoutes_1.default);
router.use('/ad-creatives', adCreativeRoutes_1.default);
router.use('/ads/zones', adZoneRoutes_1.default);
router.use('/ads', advertisingRoutes_1.default);
router.use('/advertiser/disputes', disputeRoutes_1.default);
router.use('/videos', videoRoutes_1.default);
router.use('/auth', authRoutes_1.default);
router.use('/academy', academyRoutes_1.default);
router.use('/academy-staff', academyStaffRoutes_1.default);
router.use('/club-league-stats', clubLeagueRoutes_1.default);
router.use('/leagues', leagueRoutes_1.default);
router.use('/feeds', feedsRoutes_1.default);
router.use('/goals', goalRoutes_1.default);
router.use('/health', healthRoutes_1.default);
router.use('/lineups', lineupRoutes_1.default);
router.use('/match-gallery', fixtureImageRoutes_1.default);
router.use('/patrons', patronageRoutes_1.default);
router.use('/payments', paymentRoutes_1.default);
router.use('/players', playerRoutes_1.default);
router.use('/system', systemRoutes_1.default);
router.use('/trialists', trialistRoutes_1.default);
router.use('/users', userRoutes_1.default);
router.use('/scout', scoutRoutes_1.default);
const analyticsRoutes_1 = __importDefault(require("./analyticsRoutes"));
const notificationRoutes_1 = __importDefault(require("./notificationRoutes"));
// ... (existing imports, keep them essentially)
router.use('/analytics', analyticsRoutes_1.default);
router.use('/notifications', notificationRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map