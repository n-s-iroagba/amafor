// models/associations.ts

import sequelize from '../config/database';


// Base Entities
import User from './User';
import League from './League';
import Advertiser from './Advertiser';
import AdZones from './AdZones';
import RssFeedSource from './RssFeedSource';
import Video from './Video'; // Added
import Trialist from './Trialist'; // Added

// Content & Staff
import Article from './Article';
import FeaturedNews from './FeaturedNews';
import AcademyStaff from './AcademyStaff';
import Coach from './Coach';

// Fixture & Team
import Fixture from './Fixture';
import FixtureStatistics from './FixtureStatistics'; // Added
import Goal from './Goal';
import Lineup from './Lineup';
import FixtureImage from './FixtureImage';

import LeagueStatistics from './LeagueStatistics';
import Player from './Player';
import PlayerLeagueStatistics from './PlayerLeagueStatistics'; // Added

// Commercial & System
import Patron from './Patron';
import PatronSubscription from './PatronSubscription';
import Payment from './Payment';
import AdCampaign from './AdCampaign';
import AdCreative from './AdCreative';
import AuditLog from './AuditLog';
import SystemNotification from './SystemNotification';
import ScoutReport from './ScoutReport';
import ScoutApplication from './ScoutApplication';

export async function setupAssociations(): Promise<void> {

  // ==================== FIXTURE ASSOCIATIONS ====================
  Fixture.hasMany(Goal, {
    foreignKey: 'fixtureId',
    as: 'goals',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Goal.belongsTo(Fixture, {
    foreignKey: 'fixtureId',
    as: 'goalFixture',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Fixture.hasMany(Lineup, {
    foreignKey: 'fixtureId',
    as: 'lineups',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Lineup.belongsTo(Fixture, {
    foreignKey: 'fixtureId',
    as: 'fixture',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Fixture.hasMany(FixtureImage, {
    foreignKey: 'fixtureId',
    as: 'images',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  FixtureImage.belongsTo(Fixture, {
    foreignKey: 'fixtureId',
    as: 'imageFixture',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // NEW: Fixture Statistics (One-to-One)
  Fixture.hasOne(FixtureStatistics, {
    foreignKey: 'fixtureId',
    as: 'statistics',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  FixtureStatistics.belongsTo(Fixture, {
    foreignKey: 'fixtureId',
    as: 'fixture',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });



  Fixture.belongsTo(League, {
    foreignKey: 'leagueId',
    as: 'league',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // Relation to Article (Fixture Report)
  Article.hasOne(Fixture, {
    foreignKey: 'matchReportArticleId',
    as: 'matchReportArticle',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Fixture.belongsTo(Article, {
    foreignKey: 'matchReportArticleId',
    as: 'matchReportArticle',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // ==================== LEAGUE ASSOCIATIONS ====================
  League.hasMany(Fixture, {
    foreignKey: 'leagueId',
    as: 'fixtures',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  League.hasMany(LeagueStatistics, {
    foreignKey: 'leagueId',
    as: 'teamStatistics',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  LeagueStatistics.belongsTo(League, {
    foreignKey: 'leagueId',
    as: 'league',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // NEW: Player League Statistics (via League)
  League.hasMany(PlayerLeagueStatistics, {
    foreignKey: 'leagueId',
    as: 'playerStatistics',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  PlayerLeagueStatistics.belongsTo(League, {
    foreignKey: 'leagueId',
    as: 'league',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // ==================== PLAYER ASSOCIATIONS ====================
  Player.hasMany(Lineup, {
    foreignKey: 'playerId',
    as: 'lineups',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Lineup.belongsTo(Player, {
    foreignKey: 'playerId',
    as: 'player',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Player.hasMany(Goal, {
    foreignKey: 'playerId',
    as: 'goalsScored',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Goal.belongsTo(Player, {
    foreignKey: 'playerId',
    as: 'goalScorer',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // NEW: Player League Statistics (via Player)
  Player.hasMany(PlayerLeagueStatistics, {
    foreignKey: 'playerId',
    as: 'leagueStatistics',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  PlayerLeagueStatistics.belongsTo(Player, {
    foreignKey: 'playerId',
    as: 'player',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // ==================== PATRON ASSOCIATIONS ====================
  Patron.hasOne(PatronSubscription, {
    foreignKey: 'patronId',
    as: 'subscription',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  PatronSubscription.belongsTo(Patron, {
    foreignKey: 'patronId',
    as: 'patron',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  PatronSubscription.hasMany(Payment, {
    foreignKey: 'subscriptionId',
    as: 'payments',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Payment.belongsTo(PatronSubscription, {
    foreignKey: 'subscriptionId',
    as: 'subscription',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // ==================== ADVERTISING ASSOCIATIONS ====================
  Advertiser.hasMany(AdCampaign, {
    foreignKey: 'advertiserId',
    as: 'campaigns',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  AdCampaign.belongsTo(Advertiser, {
    foreignKey: 'advertiserId',
    as: 'advertiser',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  AdCampaign.hasMany(AdCreative, {
    foreignKey: 'campaignId',
    as: 'creatives',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  AdCreative.belongsTo(AdCampaign, {
    foreignKey: 'campaignId',
    as: 'campaign',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  AdCampaign.hasMany(Payment, {
    foreignKey: 'adCampaignId',
    as: 'payments',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Payment.belongsTo(AdCampaign, {
    foreignKey: 'adCampaignId',
    as: 'adCampaign',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  AdZones.hasMany(AdCreative, {
    foreignKey: 'zoneId',
    as: 'creatives',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  AdCreative.belongsTo(AdZones, {
    foreignKey: 'zoneId',
    as: 'zone',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // ==================== USER ASSOCIATIONS ====================
  User.hasMany(Article, {
    foreignKey: 'authorId',
    as: 'articles',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Article.belongsTo(User, {
    foreignKey: 'authorId',
    as: 'author',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  User.hasMany(AuditLog, {
    foreignKey: 'userId',
    as: 'auditLogs',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  AuditLog.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  User.hasMany(SystemNotification, {
    foreignKey: 'userId',
    as: 'notifications',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  SystemNotification.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // ==================== COACH & STAFF ASSOCIATIONS ====================
  Coach.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  User.hasOne(Coach, {
    foreignKey: 'userId',
    as: 'coachProfile',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  AcademyStaff.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  User.hasOne(AcademyStaff, {
    foreignKey: 'userId',
    as: 'academyStaffProfile',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // ==================== CONTENT ASSOCIATIONS ====================
  RssFeedSource.hasMany(FeaturedNews, {
    foreignKey: 'sourceId',
    as: 'articles',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  FeaturedNews.belongsTo(RssFeedSource, {
    foreignKey: 'sourceId',
    as: 'source',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  console.log('✅ All associations configured');
}

// Association interfaces for type safety
export interface FixtureAssociations {
  lineups: () => Promise<any[]>;
  goals: () => Promise<any[]>;
  images: () => Promise<any[]>;
  summary: () => Promise<any | null>;
  statistics: () => Promise<any | null>; // Added
  league: () => Promise<any | null>;
}

export interface PlayerAssociations {
  lineups: () => Promise<any[]>;
  leagueStatistics: () => Promise<any[]>; // Added
}

export interface LeagueAssociations {
  fixtures: () => Promise<any[]>;
  teamStatistics: () => Promise<any[]>;
  playerStatistics: () => Promise<any[]>; // Added
}

export const syncDatabase = async (force: boolean = false) => {
  try {
    await setupAssociations()

    await sequelize.sync({ force });

    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    // Debug logging for troubleshooting specific model issues
    console.log('Model Verification:');
    console.log('Video Loaded:', !!Video);
    console.log('Trialist Loaded:', !!Trialist);
    console.log('PlayerStats Loaded:', !!PlayerLeagueStatistics);
    throw error;
  }
};