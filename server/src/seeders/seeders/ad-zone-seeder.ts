// src/seeders/seeders/ad-zone-seeder.ts

import { CreationAttributes } from 'sequelize';
import logger from '@utils/logger';
import { AdZone } from '@models/AdCampaign';
import AdZoneModel, { AdZoneType, AdZoneStatus } from '@models/AdZones';
import { BaseSeeder } from './base-seeder';

export class AdZoneSeeder extends BaseSeeder<AdZoneModel> {
  constructor() {
    super(AdZoneModel, 'ad-zones');
  }

  async getData(environment: string): Promise<CreationAttributes<AdZoneModel>[]> {
    logger.info(`Loading ${this.name} data for ${environment} environment`);
    
    // Ad zones are the same for all environments since they're predefined
    return this.getPredefinedZones();
  }

  private getPredefinedZones(): CreationAttributes<AdZoneModel>[] {
    return [
      {
    id: 'TP_BAN',
    name: 'Top Page Banner',

    dimensions: '970x250',
    maxSize: '2MB',
    type: AdZoneType.BANNER,
    description: 'Top of content pages across the site for maximum visibility',
    pricePerView: 500,

    status: AdZoneStatus.ACTIVE,
    tags: ['general', 'sports'],
  },
  {
    id: 'SIDEBAR',
    name: 'Sidebar',

    dimensions: '300x250',
    maxSize: '1MB',
    type: AdZoneType.SIDEBAR,
    description: 'Persistent sidebar placement on content pages for sustained exposure',
    pricePerView: 250,
  
    status: AdZoneStatus.ACTIVE,
    tags: ['news', 'features'],
  },
  {
    id: 'ART_FOOT',
    name: 'Article Footer',

    dimensions: '728x90',
    maxSize: '1.5MB',
    type: AdZoneType.FOOTER,
    description: 'Banner at the bottom of article pages after content',
    pricePerView: 150,
  
    status: AdZoneStatus.ACTIVE,
    tags: ['editorial'],
  },
  {
    id: 'MID_ART',
    name: 'Mid-Article Banner',
  
    dimensions: '640x360',
    maxSize: '2MB',
    type: AdZoneType.INLINE,
    description: 'Video ad embedded within article content after first 100 words',
    pricePerView: 400,

    status: AdZoneStatus.ACTIVE,
    tags: ['video', 'engagement'],
  }
]
  }

  // Override seed method to ensure zones are only seeded if table is empty
  async seed(options: any = {}): Promise<number> {
    // Check if zones already exist
    const existingCount = await this.model.count();
    
    if (existingCount > 0) {
      logger.info(`Skipping ${this.name} seeder - ${existingCount} zones already exist`);
      return 0;
    }

    logger.info('Seeding predefined ad zones...');
    return super.seed(options);
  }

  // Override clear method to prevent accidental deletion
  async clear(transaction?: any): Promise<number> {
    logger.warn('Ad zones are predefined and should not be cleared');
    return 0;
  }

  // Method to update prices if needed
  async updateZonePrices(newPrices: Record<AdZone, number>): Promise<number> {
    let updatedCount = 0;
    
    for (const [type, price] of Object.entries(newPrices)) {
      const adZone = await this.model.findOne({ where: { type } });
      if (adZone) {
        await adZone.update({ pricePerView: price });
        updatedCount++;
        logger.info(`Updated price for zone ${type} to ${price} kobo`);
      }
    }
    
    return updatedCount;
  }

  // Method to reset all zones to default prices
  async resetToDefaultPrices(): Promise<number> {
    const defaultZones = this.getPredefinedZones();
    let updatedCount = 0;
    
    for (const zoneData of defaultZones) {
      const adZone = await this.model.findOne({ where: { type: zoneData.type } });
      if (adZone && adZone.pricePerView !== zoneData.pricePerView) {
        await adZone.update({ pricePerView: zoneData.pricePerView });
        updatedCount++;
      }
    }
    
    logger.info(`Reset ${updatedCount} zones to default prices`);
    return updatedCount;
  }
}