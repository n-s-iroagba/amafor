// src/seeders/index.ts

import { SeedRunner } from "./seed-runner";

// 1. Base / Independent Entities
import { UserSeeder } from "./user-seeder";
import { PatronSeeder } from "./patron";
import { AdvertiserSeeder } from "./advertiser-seeder";
import { AdZoneSeeder } from "./ad-zone-seeder";
import { LeagueSeeder } from "./league-seeder";
import { RssFeedSourceSeeder } from "./rssfeedsource-seeder";
import { VideoSeeder } from "./video-seeder";
import { TrialistSeeder } from "./trialist-seeder";
import { AcademyStaffSeeder } from "./academy-staff-seeder";
import { CoachSeeder } from "./coach-seeder";

// 2. First-Level Dependencies (Depend on Base Entities)
import { PlayerSeeder } from "./player-seeder"; // Depends on User (createdById)
import { PatronSubscriptionSeeder } from "./patronsubscription-seeder"; // Depends on Patron
import { AdCampaignSeeder } from "./adcampaign-seeder"; // Depends on Advertiser
import { FixtureSeeder } from "./fixture-seeder"; // Depends on League & User
import { ThirdPartyArticleSeeder } from "./third-party-article-seeder"; // Depends on RssFeedSource
import { SystemNotificationSeeder } from "./systemnotification-seeder"; // Depends on User
import { AuditLogSeeder } from "./auditlog-seeder"; // Depends on User
import { ArticleSeeder } from "./article-seeder"; // Depends on User


// 3. Second-Level Dependencies (Depend on Level 1 or 2)
import { GoalSeeder } from "./goal-seeder"; // Depends on Fixture
import { LineupSeeder } from "./lineup-seeder"; // Depends on Fixture & Player
import { MatchImageSeeder } from "./matchimage-seeder"; // Depends on Fixture
import { FixtureStatisticsSeeder } from "./fixture-statistics-seeder"; // Depends on Fixture
import { AdCreativeSeeder } from "./adcreative-seeder"; // Depends on AdCampaign & AdZone
import { PaymentSeeder } from "./payment-seeder"; // Depends on User, AdCampaign, PatronSubscription
import { LeagueStatisticsSeeder } from "./leaguestatistics-seeder"; // Depends on League & Fixture
import { PlayerLeagueStatisticsSeeder } from "./player-league-statistics"; // Depends on Player & League


export const initializeSeeders = (): SeedRunner => {
  const runner = new SeedRunner();
  
  // ==================== LEVEL 1: BASE ENTITIES ====================
  // These have no foreign key dependencies
  runner.register('users', new UserSeeder());
  runner.register('patrons', new PatronSeeder());
  runner.register('advertisers', new AdvertiserSeeder());
  runner.register('adZones', new AdZoneSeeder());
  runner.register('leagues', new LeagueSeeder());
  runner.register('rssFeedSources', new RssFeedSourceSeeder());
  runner.register('videos', new VideoSeeder());
  runner.register('trialists', new TrialistSeeder());
  runner.register('academyStaff', new AcademyStaffSeeder());
  runner.register('coaches', new CoachSeeder());

  // ==================== LEVEL 2: FIRST TIER DEPENDENCIES ====================
  // These depend on Level 1 entities
  
  // Players require Users (for createdById/updatedById)
  runner.register('players', new PlayerSeeder(), ['users']);
  
  // Subscriptions require Patrons
  runner.register('patronSubscriptions', new PatronSubscriptionSeeder(), ['patrons']);
  
  // Campaigns require Advertisers
  runner.register('adCampaigns', new AdCampaignSeeder(), ['advertisers']);
  
  // Fixtures require Leagues and Users
  runner.register('fixtures', new FixtureSeeder(), ['leagues', 'users']);
  
  // Content requiring external sources or authors
  runner.register('thirdPartyArticles', new ThirdPartyArticleSeeder(), ['rssFeedSources']);
  runner.register('articles', new ArticleSeeder(), ['users']);
  
  // System logs and notifications require Users
  runner.register('systemNotifications', new SystemNotificationSeeder(), ['users']);
  runner.register('auditLogs', new AuditLogSeeder(), ['users']);


  // ==================== LEVEL 3: DEEP DEPENDENCIES ====================
  // These depend on Level 2 entities (and sometimes Level 1)

  // Match details depend on Fixtures (and Players for lineups)
  runner.register('goals', new GoalSeeder(), ['fixtures']);
  runner.register('lineups', new LineupSeeder(), ['fixtures', 'players']);
  runner.register('matchImages', new MatchImageSeeder(), ['fixtures']);

  runner.register('fixtureStatistics', new FixtureStatisticsSeeder(), ['fixtures']);
  
  // Ad Creatives depend on Campaigns and Zones
  runner.register('adCreatives', new AdCreativeSeeder(), ['adCampaigns', 'adZones']);
  
  // Payments depend on Users, Campaigns, or Subscriptions
  runner.register('payments', new PaymentSeeder(), ['users', 'adCampaigns', 'patronSubscriptions']);
  
  // Aggregated Statistics depend on Leagues, Fixtures, and Players
  runner.register('leagueStatistics', new LeagueStatisticsSeeder(), ['leagues', 'fixtures']);
  runner.register('playerLeagueStatistics', new PlayerLeagueStatisticsSeeder(), ['players', 'leagues']);
  
  return runner;
};

// Singleton instance
export const seeder = initializeSeeders();