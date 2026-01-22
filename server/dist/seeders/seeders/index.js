"use strict";
// src/seeders/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.seeder = exports.initializeSeeders = void 0;
const seed_runner_1 = require("./seed-runner");
// 1. Base / Independent Entities
const user_seeder_1 = require("./user-seeder");
const patron_1 = require("./patron");
const advertiser_seeder_1 = require("./advertiser-seeder");
const ad_zone_seeder_1 = require("./ad-zone-seeder");
const league_seeder_1 = require("./league-seeder");
const rssfeedsource_seeder_1 = require("./rssfeedsource-seeder");
const video_seeder_1 = require("./video-seeder");
const trialist_seeder_1 = require("./trialist-seeder");
const academy_staff_seeder_1 = require("./academy-staff-seeder");
const coach_seeder_1 = require("./coach-seeder");
// 2. First-Level Dependencies (Depend on Base Entities)
const player_seeder_1 = require("./player-seeder"); // Depends on User (createdById)
const patronsubscription_seeder_1 = require("./patronsubscription-seeder"); // Depends on Patron
const adcampaign_seeder_1 = require("./adcampaign-seeder"); // Depends on Advertiser
const fixture_seeder_1 = require("./fixture-seeder"); // Depends on League & User
const third_party_article_seeder_1 = require("./third-party-article-seeder"); // Depends on RssFeedSource
const systemnotification_seeder_1 = require("./systemnotification-seeder"); // Depends on User
const auditlog_seeder_1 = require("./auditlog-seeder"); // Depends on User
const article_seeder_1 = require("./article-seeder"); // Depends on User
// 3. Second-Level Dependencies (Depend on Level 1 or 2)
const goal_seeder_1 = require("./goal-seeder"); // Depends on Fixture
const lineup_seeder_1 = require("./lineup-seeder"); // Depends on Fixture & Player
const matchimage_seeder_1 = require("./matchimage-seeder"); // Depends on Fixture
const fixture_statistics_seeder_1 = require("./fixture-statistics-seeder"); // Depends on Fixture
const adcreative_seeder_1 = require("./adcreative-seeder"); // Depends on AdCampaign & AdZone
const payment_seeder_1 = require("./payment-seeder"); // Depends on User, AdCampaign, PatronSubscription
const leaguestatistics_seeder_1 = require("./leaguestatistics-seeder"); // Depends on League & Fixture
const player_league_statistics_1 = require("./player-league-statistics"); // Depends on Player & League
const initializeSeeders = () => {
    const runner = new seed_runner_1.SeedRunner();
    // ==================== LEVEL 1: BASE ENTITIES ====================
    // These have no foreign key dependencies
    runner.register('users', new user_seeder_1.UserSeeder());
    runner.register('patrons', new patron_1.PatronSeeder());
    runner.register('advertisers', new advertiser_seeder_1.AdvertiserSeeder());
    runner.register('adZones', new ad_zone_seeder_1.AdZoneSeeder());
    runner.register('leagues', new league_seeder_1.LeagueSeeder());
    runner.register('rssFeedSources', new rssfeedsource_seeder_1.RssFeedSourceSeeder());
    runner.register('videos', new video_seeder_1.VideoSeeder());
    runner.register('trialists', new trialist_seeder_1.TrialistSeeder());
    runner.register('academyStaff', new academy_staff_seeder_1.AcademyStaffSeeder());
    runner.register('coaches', new coach_seeder_1.CoachSeeder());
    // ==================== LEVEL 2: FIRST TIER DEPENDENCIES ====================
    // These depend on Level 1 entities
    // Players require Users (for createdById/updatedById)
    runner.register('players', new player_seeder_1.PlayerSeeder(), ['users']);
    // Subscriptions require Patrons
    runner.register('patronSubscriptions', new patronsubscription_seeder_1.PatronSubscriptionSeeder(), ['patrons']);
    // Campaigns require Advertisers
    runner.register('adCampaigns', new adcampaign_seeder_1.AdCampaignSeeder(), ['advertisers']);
    // Fixtures require Leagues and Users
    runner.register('fixtures', new fixture_seeder_1.FixtureSeeder(), ['leagues', 'users']);
    // Content requiring external sources or authors
    runner.register('featuredNewss', new third_party_article_seeder_1.FeaturedNewsSeeder(), ['rssFeedSources']);
    runner.register('articles', new article_seeder_1.ArticleSeeder(), ['users']);
    // System logs and notifications require Users
    runner.register('systemNotifications', new systemnotification_seeder_1.SystemNotificationSeeder(), ['users']);
    runner.register('auditLogs', new auditlog_seeder_1.AuditLogSeeder(), ['users']);
    // ==================== LEVEL 3: DEEP DEPENDENCIES ====================
    // These depend on Level 2 entities (and sometimes Level 1)
    // Fixture details depend on Fixtures (and Players for lineups)
    runner.register('goals', new goal_seeder_1.GoalSeeder(), ['fixtures']);
    runner.register('lineups', new lineup_seeder_1.LineupSeeder(), ['fixtures', 'players']);
    runner.register('fixtureImages', new matchimage_seeder_1.FixtureImageSeeder(), ['fixtures']);
    runner.register('fixtureStatistics', new fixture_statistics_seeder_1.FixtureStatisticsSeeder(), ['fixtures']);
    // Ad Creatives depend on Campaigns and Zones
    runner.register('adCreatives', new adcreative_seeder_1.AdCreativeSeeder(), ['adCampaigns', 'adZones']);
    // Payments depend on Users, Campaigns, or Subscriptions
    runner.register('payments', new payment_seeder_1.PaymentSeeder(), ['users', 'adCampaigns', 'patronSubscriptions']);
    // Aggregated Statistics depend on Leagues, Fixtures, and Players
    runner.register('leagueStatistics', new leaguestatistics_seeder_1.LeagueStatisticsSeeder(), ['leagues', 'fixtures']);
    runner.register('playerLeagueStatistics', new player_league_statistics_1.PlayerLeagueStatisticsSeeder(), ['players', 'leagues']);
    return runner;
};
exports.initializeSeeders = initializeSeeders;
// Singleton instance
exports.seeder = (0, exports.initializeSeeders)();
//# sourceMappingURL=index.js.map