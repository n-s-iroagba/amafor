// repositories/AdCreativeRepository.ts
import { BaseRepository } from './BaseRepository';
import { AdCreative } from '../models/AdCreative';

export class AdCreativeRepository extends BaseRepository<AdCreative> {
  constructor() {
    super(AdCreative);
  }

  async findBySubscription(subscriptionId: number): Promise<AdCreative[]> {
    return AdCreative.findAll({ where: { subscriptionId: subscriptionId } });
  }

  async findActiveCreatives(where:any={isActive:true}): Promise<AdCreative[]> {
    return AdCreative.findAll({ 
      where
    });
  }

  async findByAdsZone(zoneIdentifier: string): Promise<AdCreative[]> {
    // This would need additional logic to match creatives to zones
    // For now, returning all active creatives
    return this.findActiveCreatives({
   
    
    });
  }
}