// models/associations.ts

import sequelize from '@config/database';
import { Model } from 'sequelize';

import Fixture from './Fixture';
import Goal from './Goal';
import PatronSubscription from './PatronSubscription';
import Payment from './Payment';
import Player from './Player';
import User from './User';
import AdCampaign from './AdCampaign';
import AdCreative from './AdCreative';

import Article from './Article';
import AuditLog from './AuditLog';
import RssFeedSource from './RssFeedSource';
import SystemNotification from './SystemNotification';

import AcademyStaff from './AcademyStaff';
import AdZones from './AdZones';
import Coach from './Coach';
import League from './League';
import LeagueStatistics from './LeagueStatistics';
import Lineup from './Lineup';
import MatchImage from './MatchImage';
import MatchSummary from './MatchSummary';
import Patron from './Patron';
import ThirdPartyArticle from './ThirdPartyArticle';
import Advertiser from './Advertiser';


export async function setupAssociations(): Promise<void> {
  console.log('=== MODEL IMPORTS DEBUG ===');
  console.log('Fixture:', Fixture);
  console.log('Goal:', Goal);
  console.log('PatronSubscription:', PatronSubscription);
  console.log('Payment:', Payment);
  console.log('Player:', Player);
  console.log('User:', User);
  console.log('AdCampaign:', AdCampaign);
  console.log('AdCreative:', AdCreative);
  console.log('Article:', Article);
  console.log('AuditLog:', AuditLog);
  console.log('RssFeedSource:', RssFeedSource);
  console.log('SystemNotification:', SystemNotification);
  console.log('AcademyStaff:', AcademyStaff);
  console.log('AdZones:', AdZones);
  console.log('Coach:', Coach);
  console.log('League:', League);
  console.log('LeagueStatistics:', LeagueStatistics);
  console.log('Lineup:', Lineup);
  console.log('MatchImage:', MatchImage);
  console.log('MatchSummary:', MatchSummary);
  console.log('Patron:', Patron);
  console.log('ThirdPartyArticle:', ThirdPartyArticle);
  console.log('Advertiser:', Advertiser);
  console.log('=== END DEBUG ===\n');
  console.log('=== SEQUELIZE INSTANCE DEBUG ===');
  console.log('Fixture.sequelize:', Fixture.sequelize);
  console.log('Goal.sequelize:', Goal.sequelize);
  console.log('Fixture.sequelize?.Sequelize:', Fixture.sequelize?.Sequelize);
  console.log('Goal.sequelize?.Sequelize:', Goal.sequelize?.Sequelize);
  console.log('typeof Fixture.sequelize:', typeof Fixture.sequelize);
  console.log('typeof Goal.sequelize:', typeof Goal.sequelize);
  console.log('=== END SEQUELIZE DEBUG ===\n');

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

  Fixture.hasMany(MatchImage, {
    foreignKey: 'fixtureId',
    as: 'images',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  MatchImage.belongsTo(Fixture, {
    foreignKey: 'fixtureId',
    as: 'imageFixture',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Fixture.hasOne(MatchSummary, {
    foreignKey: 'fixtureId',
    as: 'summary',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  MatchSummary.belongsTo(Fixture, {
    foreignKey: 'fixtureId',
    as: 'summaryFixture',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Fixture.belongsTo(League, {
    foreignKey: 'leagueId',
    as: 'league',
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
  
  League.hasOne(LeagueStatistics, {
    foreignKey: 'leagueId',
    as: 'statistics',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  LeagueStatistics.belongsTo(League, {
    foreignKey: 'leagueId',
    as: 'statisticsLeague',
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
  RssFeedSource.hasMany(ThirdPartyArticle, {
    foreignKey: 'sourceId',
    as: 'articles',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  ThirdPartyArticle.belongsTo(RssFeedSource, {
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
  league: () => Promise<any | null>;
}

export interface LineupAssociations {
  fixture: () => Promise<any>;
  player: () => Promise<any>;
}

export interface PlayerAssociations {
  lineups: () => Promise<any[]>;
}

export interface LeagueAssociations {
  fixtures: () => Promise<any[]>;
  statistics: () => Promise<any | null>;
}

export interface PatronAssociations {
  subscription: () => Promise<any | null>;
}

export interface UserAssociations {
  coachProfile: () => Promise<any | null>;
  academyStaffProfile: () => Promise<any | null>;
  articles: () => Promise<any[]>;
  auditLogs: () => Promise<any[]>;
  notifications: () => Promise<any[]>;
  payments: () => Promise<any[]>;
}

export const syncDatabase = async (force: boolean = false) => {
  try {
    await setupAssociations()
    await sequelize.sync({ force });
     
    console.log('✅ Database synchronized successfully');
  } catch (error) {
     console.log('Fixture:', Fixture);
  console.log('Goal:', Goal);
  console.log('Is Fixture a Model?', Fixture?.prototype instanceof Model);
    console.error('❌ Database synchronization failed:', error);
    throw error;
  }
};