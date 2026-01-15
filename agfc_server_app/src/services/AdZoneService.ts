// services/AdZoneService.ts
import { AdZone } from '@models/AdCampaign';
import { AdZoneAttributes } from '@models/AdZones';
import { AdZoneRepository, IAdZoneRepository } from '@repositories/AdZoneRepository';

import logger from '@utils/logger';

export interface ZonePriceUpdateData {
  zone: AdZone;
  pricePerView: number;
  updatedBy: string;
}

export interface ZoneAvailabilityCheck {
  zone: AdZone;
  budget: number;
  impressions: number;
}

export interface ZoneSelectionResult {
  zone: AdZoneAttributes;
  totalCost: number;
  costPerImpression: number;
  fitsBudget: boolean;
}

export class AdZoneService {
  private repository: IAdZoneRepository;

  constructor(repository?: IAdZoneRepository) {
    this.repository = repository || new AdZoneRepository();
  }

  async getAllZones(): Promise<AdZoneAttributes[]> {
    try {
      const zones = await this.repository.findAll();
      return zones.map(zone => zone.toJSON() as AdZoneAttributes);
    } catch (error: any) {
      logger.error('Failed to get all zones', { error: error.message });
      throw error;
    }
  }

  async getZoneByType(zone: AdZone): Promise<AdZoneAttributes> {
    try {
      const adZone = await this.repository.findByZone(zone);
      if (!adZone) {
        throw new AppError(`Zone ${zone} not found`, 404);
      }
      return adZone.toJSON() as AdZoneAttributes;
    } catch (error: any) {
      logger.error('Failed to get zone', { zone, error: error.message });
      throw error;
    }
  }

  async getActiveZones(): Promise<AdZoneAttributes[]> {
    try {
      const zones = await this.repository.findActiveZones();
      return zones.map(zone => zone.toJSON() as AdZoneAttributes);
    } catch (error: any) {
      logger.error('Failed to get active zones', { error: error.message });
      throw error;
    }
  }

  async updateZonePrice(data: ZonePriceUpdateData): Promise<AdZoneAttributes> {
    try {
      const { zone, pricePerView, updatedBy } = data;
      
      // Validate price
      if (pricePerView < 1) {
        throw new AppError('Price per view must be at least 1 kobo', 400);
      }

      // Check if zone exists
      const existingZone = await this.repository.findByZone(zone);
      if (!existingZone) {
        throw new AppError(`Zone ${zone} not found`, 404);
      }

      // Update price
      const updated = await this.repository.updatePrice(zone, pricePerView);
      if (!updated) {
        throw new AppError('Failed to update zone price', 500);
      }

      // Get updated zone
      const updatedZone = await this.repository.findByZone(zone);
      if (!updatedZone) {
        throw new AppError('Failed to retrieve updated zone', 500);
      }

      logger.info('Zone price updated', {
        zone,
        oldPrice: existingZone.pricePerView,
        newPrice: pricePerView,
        updatedBy
      });

      return updatedZone.toJSON() as AdZoneAttributes;
    } catch (error: any) {
      logger.error('Failed to update zone price', {
        error: error.message,
        data
      });
      throw error;
    }
  }

  async calculateCampaignCost(zone: AdZone, impressions: number): Promise<{
    totalCost: number;
    costPerImpression: number;
    formattedCost: string;
  }> {
    try {
      const adZone = await this.repository.findByZone(zone);
      if (!adZone) {
        throw new AppError(`Zone ${zone} not found`, 404);
      }

      if (!adZone.isAvailable()) {
        throw new AppError(`Zone ${zone} is not available`, 400);
      }

      const costPerImpression = adZone.pricePerView; // In kobo
      const totalCost = costPerImpression * impressions; // In kobo

      // Convert to Naira for display
      const formattedCost = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format(totalCost / 100);

      return {
        totalCost,
        costPerImpression,
        formattedCost
      };
    } catch (error: any) {
      logger.error('Failed to calculate campaign cost', {
        zone,
        impressions,
        error: error.message
      });
      throw error;
    }
  }

  async checkZoneAvailability(data: ZoneAvailabilityCheck): Promise<ZoneSelectionResult> {
    try {
      const { zone, budget, impressions } = data;
      
      const adZone = await this.repository.findByZone(zone);
      if (!adZone) {
        throw new AppError(`Zone ${zone} not found`, 404);
      }

      if (!adZone.isAvailable()) {
        throw new AppError(`Zone ${zone} is not available`, 400);
      }

      const totalCost = adZone.pricePerView * impressions;
      const costPerImpression = adZone.pricePerView;
      const fitsBudget = totalCost <= budget * 100; // Convert budget to kobo

      return {
        zone: adZone.toJSON() as AdZoneAttributes,
        totalCost,
        costPerImpression,
        fitsBudget
      };
    } catch (error: any) {
      logger.error('Failed to check zone availability', {
        data,
        error: error.message
      });
      throw error;
    }
  }

  async getBestZoneForBudget(budget: number, impressions: number): Promise<ZoneSelectionResult | null> {
    try {
      const availableZones = await this.repository.getAvailableZonesForBudget(budget, impressions);
      
      if (availableZones.length === 0) {
        return null;
      }

      // Select the zone with the highest price (best visibility)
      const bestZone = availableZones[0];
      const totalCost = bestZone.pricePerView * impressions;

      return {
        zone: bestZone.toJSON() as AdZoneAttributes,
        totalCost,
        costPerImpression: bestZone.pricePerView,
        fitsBudget: true
      };
    } catch (error: any) {
      logger.error('Failed to find best zone for budget', {
        budget,
        impressions,
        error: error.message
      });
      throw error;
    }
  }

  async getZoneStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    averagePrice: number;
    zones: AdZoneAttributes[];
  }> {
    try {
      const [stats, zones] = await Promise.all([
        this.repository.getZoneStats(),
        this.repository.findAll()
      ]);

      return {
        ...stats,
        zones: zones.map(zone => zone.toJSON() as AdZoneAttributes)
      };
    } catch (error: any) {
      logger.error('Failed to get zone stats', { error: error.message });
      throw error;
    }
  }

  async validateZoneForCampaign(zone: AdZone, adDimensions: string): Promise<{
    isValid: boolean;
    message?: string;
    zoneDetails?: AdZoneAttributes;
  }> {
    try {
      const adZone = await this.repository.findByZone(zone);
      if (!adZone) {
        return {
          isValid: false,
          message: `Zone ${zone} not found`
        };
      }

      if (!adZone.isAvailable()) {
        return {
          isValid: false,
          message: `Zone ${zone} is not available`
        };
      }

      // Check if ad dimensions match zone dimensions
      if (adZone.dimensions !== adDimensions) {
        return {
          isValid: false,
          message: `Ad dimensions (${adDimensions}) do not match zone dimensions (${adZone.dimensions})`
        };
      }

      return {
        isValid: true,
        zoneDetails: adZone.toJSON() as AdZoneAttributes
      };
    } catch (error: any) {
      logger.error('Failed to validate zone for campaign', {
        zone,
        adDimensions,
        error: error.message
      });
      return {
        isValid: false,
        message: 'Failed to validate zone'
      };
    }
  }
}

// Helper class for application errors
class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.name = 'AppError';
  }
}