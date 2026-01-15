// src/seeders/index.ts

import { AdZoneSeeder } from "./ad-zone-seeder";
import { AdCampaignSeeder } from "./adcampaign-seeder";
import { AdCreativeSeeder } from "./adcreative-seeder";
import { PaymentSeeder } from "./payment-seeder";
import { PlayerSeeder } from "./player-seeder";
import { UserSeeder } from "./user-seeder";


export const initializeSeeders = (): SeedRunner => {
  const runner = new SeedRunner();
  
  // Register seeders with dependencies
  runner.register('users', new UserSeeder());
  runner.register('players', new PlayerSeeder(), ['users']);
  runner.register('adZones', new AdZoneSeeder()); // No dependencies
  runner.register('adCampaigns', new AdCampaignSeeder(), ['users', 'adZones']);
  runner.register('adCreatives', new AdCreativeSeeder(), ['adCampaigns']);
  runner.register('payments', new PaymentSeeder(), ['users', 'adCampaigns']);
  // ... other registrations
  
  return runner;
};

// Singleton instance
export const seeder = initializeSeeders();