// Import all models
import { User } from './User';
import { Player } from './Player';
import { Fixture } from './Fixture';
import { Article } from './Article';
import { AdCampaign } from './AdCampaign';
import { Donation } from './Donation';
import { PatronSubscription } from './PatronSubscription';
import { SystemNotification } from './SystemNotification';
import { AuditLog } from './AuditLog';
import { Trialist } from './Trialist'; // Added

// Initialize associations (if any)
// Example: User.hasMany(Article); Article.belongsTo(User);

// Export all models
export {
  User,
  Player,
  Fixture,
  Article,
  AdCampaign,
  Donation,
  PatronSubscription,
  SystemNotification,
  AuditLog,
  Trialist, // Exported
};

// Export types
export * from './User';
export * from './Player';
export * from './Fixture';
export * from './Article';
export * from './AdCampaign';
export * from './Donation';
export * from './PatronSubscription';
export * from './SystemNotification';
export * from './AuditLog';
export * from './Trialist'; // Exported