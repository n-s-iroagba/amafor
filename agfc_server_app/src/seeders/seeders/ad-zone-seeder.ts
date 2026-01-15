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
        name: 'Homepage Banner',
        zone: AdZone.HOMEPAGE_BANNER,
        description: 'Primary banner on the homepage, highest visibility',
        pricePerView: 50, // 0.5 NGN per view
        type: AdZoneType.BANNER,
        dimensions: '728x90',
        maxAds: 3,
        status: AdZoneStatus.ACTIVE
      },
      {
        name: 'Top Page Banner',
        zone: AdZone.TOP_PAGE_BANNER,
        description: 'Banner at the top of all pages',
        pricePerView: 30, // 0.3 NGN per view
        type: AdZoneType.BANNER,
        dimensions: '728x90',
        maxAds: 2,
        status: AdZoneStatus.ACTIVE
      },
      {
        name: 'Sidebar Ad',
        zone: AdZone.SIDEBAR,
        description: 'Advertisement in the sidebar',
        pricePerView: 20, // 0.2 NGN per view
        type: AdZoneType.SIDEBAR,
        dimensions: '300x250',
        maxAds: 4,
        status: AdZoneStatus.ACTIVE
      },
      {
        name: 'Article Footer Ad',
        zone: AdZone.ARTICLE_FOOTER,
        description: 'Advertisement at the end of articles',
        pricePerView: 25, // 0.25 NGN per view
        type: AdZoneType.FOOTER,
        dimensions: '728x90',
        maxAds: 2,
        status: AdZoneStatus.ACTIVE
      },
      {
        name: 'Mid Article Ad',
        zone: AdZone.MID_ARTICLE,
        description: 'Advertisement in the middle of article content',
        pricePerView: 40, // 0.4 NGN per view
        type: AdZoneType.INLINE,
        dimensions: '300x250',
        maxAds: 1,
        status: AdZoneStatus.ACTIVE
      }
    ];
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
    
    for (const [zone, price] of Object.entries(newPrices)) {
      const adZone = await this.model.findOne({ where: { zone } });
      if (adZone) {
        await adZone.update({ pricePerView: price });
        updatedCount++;
        logger.info(`Updated price for zone ${zone} to ${price} kobo`);
      }
    }
    
    return updatedCount;
  }

  // Method to reset all zones to default prices
  async resetToDefaultPrices(): Promise<number> {
    const defaultZones = this.getPredefinedZones();
    let updatedCount = 0;
    
    for (const zoneData of defaultZones) {
      const adZone = await this.model.findOne({ where: { zone: zoneData.zone } });
      if (adZone && adZone.pricePerView !== zoneData.pricePerView) {
        await adZone.update({ pricePerView: zoneData.pricePerView });
        updatedCount++;
      }
    }
    
    logger.info(`Reset ${updatedCount} zones to default prices`);
    return updatedCount;
  }
}