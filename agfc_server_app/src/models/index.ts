// models/index.ts
import sequelize from '../config/database';
import AcademyStaff from './AcademyStaff';
import AdCampaign from './AdCampaign';
import AdCreative from './AdCreative';
import { Advertiser } from './Advertiser';
import AdZones from './AdZones';
import Article from './Article';


// Import association setup
import { setupAssociations } from './associations';
import AuditLog from './AuditLog';
import Coach from './Coach';
import Fixture from './Fixture';
import Goal from './Goal';
import League from './League';
import LeagueStatistics from './LeagueStatistics';
import Lineup from './Lineup';
import MatchImage from './MatchImage';
import MatchSummary from './MatchSummary';
import Patron from './Patron';
import PatronSubscription from './PatronSubscription';
import Payment from './Payment';
import Player from './Player';
import RssFeedSource from './RssFeedSource';
import SystemNotification from './SystemNotification';
import { Trialist } from './Trialist';
import User from './User';
import Video from './Video';

// Collection of all models
const models = {
  AcademyStaff,
  AdCampaign,
  AdCreative,
  Advertiser,
  AdZones,
  Article,
  AuditLog,
  Coach,
  Fixture,
  Goal,
  League,
  LeagueStatistics,
  Lineup,
  MatchImage,
  MatchSummary,
  Patron,
  PatronSubscription,
  Payment,
  Player,
  RssFeedSource,
  SystemNotification,
  Trialist,
  User,
  Video
} as const;

// Type for model names
export type ModelName = keyof typeof models;

// Model initialization registry
const initializedModels = new Set<string>();

/**
 * Initialize a single model
 */
function initializeModel<T extends { initialize: () => void }>(model: T, modelName: string): void {
  if (!initializedModels.has(modelName)) {
    if (typeof model.initialize === 'function') {
      model.initialize();
      initializedModels.add(modelName);
      console.log(`✓ Model ${modelName} initialized`);
    } else {
      console.warn(`⚠ Model ${modelName} has no initialize method`);
    }
  }
}

/**
 * Initialize all models
 */
export function initializeModels(): void {
  console.log('🔧 Initializing models...');
  
  // Initialize each model
  Object.entries(models).forEach(([name, model]) => {
    initializeModel(model as any, name);
  });
  
  // Setup associations
  setupAssociations();
  console.log('✅ All models and associations initialized');
}

/**
 * Get model by name
 */
export function getModel<T>(name: ModelName): T {
  const model = models[name];
  if (!model) {
    throw new Error(`Model ${name} not found`);
  }
  return model as T;
}

/**
 * Get all models
 */
export function getAllModels(): typeof models {
  return models;
}

/**
 * Sync all models with database
 */
export async function syncModels(options?: { 
  force?: boolean; 
  alter?: boolean;
  logging?: boolean 
}): Promise<void> {
  const { force = false, alter = false, logging = false } = options || {};
  
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Initialize models if not already done
    if (initializedModels.size === 0) {
      initializeModels();
    }
    
    // Sync all models
    await sequelize.sync({ force, alter });
    
    if (force) {
      console.log('⚠ Database force synced - all data lost!');
    } else if (alter) {
      console.log('✅ Database altered - schema updated');
    } else {
      console.log('✅ Database synchronized');
    }
  } catch (error) {
    console.error('❌ Unable to sync models:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database:', error);
    throw error;
  }
}

/**
 * Reset database (development only)
 */
export async function resetDatabase(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Database reset not allowed in production');
  }
  
  console.log('🔄 Resetting database...');
  await syncModels({ force: true });
}

// Export individual models
export {
  AcademyStaff,
  AdCampaign,
  AdCreative,
  Advertiser,
  AdZones,
  Article,
  AuditLog,
  Coach,
  Fixture,
  Goal,
  League,
  LeagueStatistics,
  Lineup,
  MatchImage,
  MatchSummary,
  Patron,
  PatronSubscription,
  Payment,
  Player,
  RssFeedSource,
  SystemNotification,
  Trialist,
  User,
  Video
};

// Export sequelize instance
export { sequelize };

// Export model types
export type { 
  AcademyStaffAttributes, 
  AcademyStaffCreationAttributes 
} from './AcademyStaff';

export type { 
  AdCampaignAttributes, 
  AdCampaignCreationAttributes 
} from './AdCampaign';

export type { 
  AdCreativeAttributes, 
  AdCreativeCreationAttributes 
} from './AdCreative';


export type { 
  ArticleAttributes, 
  ArticleCreationAttributes 
} from './Article';

export type { 
  AuditLogAttributes, 
  AuditLogCreationAttributes 
} from './AuditLog';

export type { 
  CoachAttributes, 
  CoachCreationAttributes 
} from './Coach';

export type { 
  FixtureAttributes, 
  FixtureCreationAttributes 
} from './Fixture';

export type { 
  GoalAttributes, 
  GoalCreationAttributes 
} from './Goal';

export type { 
  LeagueAttributes, 
  LeagueCreationAttributes 
} from './League';

export type { 
  LeagueStatisticsAttributes, 
  LeagueStatisticsCreationAttributes 
} from './LeagueStatistics';

export type { 
  LineupAttributes, 
  LineupCreationAttributes 
} from './Lineup';

export type { 
  MatchImageAttributes, 
  MatchImageCreationAttributes 
} from './MatchImage';

export type { 
  MatchSummaryAttributes, 
  MatchSummaryCreationAttributes 
} from './MatchSummary';

export type { 
  PatronAttributes, 
  PatronCreationAttributes 
} from './Patron';

export type { 
  PatronSubscriptionAttributes, 
  PatronSubscriptionCreationAttributes 
} from './PatronSubscription';

export type { 
  PaymentAttributes, 
  PaymentCreationAttributes 
} from './Payment';

export type { 
  PlayerAttributes, 
  PlayerCreationAttributes 
} from './Player';

export type { 
  RssFeedSourceAttributes, 
  RssFeedSourceCreationAttributes 
} from './RssFeedSource';

export type { 
  SystemNotificationAttributes, 
  SystemNotificationCreationAttributes 
} from './SystemNotification';

export type { 
  TrialistAttributes, 
  TrialistCreationAttributes 
} from './Trialist';

export type { 
  UserAttributes, 
  UserCreationAttributes 
} from './User';

export type { 
  VideoAttributes, 
  VideoCreationAttributes 
} from './Video';

// Export association types
export type {
  FixtureAssociations,
  LineupAssociations,
  PlayerAssociations,
  LeagueAssociations,
  PatronAssociations,
  UserAssociations
} from './associations';

// Default export of all models
export default models;