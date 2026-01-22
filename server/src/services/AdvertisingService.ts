import AdCampaign, { AdCampaignCreationAttributes } from '@models/AdCampaign';
import { AdCampaignRepository } from '../repositories';

import { structuredLogger, tracer } from '../utils';
import { Op } from 'sequelize';

export class AdvertisingService {
  private adRepository: AdCampaignRepository;

  constructor() {
    this.adRepository = new AdCampaignRepository();
  }

  public async createCampaign(data: AdCampaignCreationAttributes, advertiserId: string): Promise<AdCampaign> {
    return tracer.startActiveSpan('service.AdvertisingService.createCampaign', async (span) => {
      try {


        const campaign = await this.adRepository.create({
          ...data,
          advertiserId,
          status: 'PENDING_PAYMENT', // Default start state
          currentImpressions: 0,
          currentClicks: 0
        });

        structuredLogger.business('AD_CAMPAIGN_CREATED', data.budget || 0, advertiserId, {
          campaignId: campaign.id,
          zone: data.id
        });

        return campaign;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async updateCampaign(id: string, updates: Partial<AdCampaignCreationAttributes>): Promise<AdCampaign | null> {
    return tracer.startActiveSpan('service.AdvertisingService.updateCampaign', async (span) => {
      try {
        span.setAttribute('campaignId', id);
        const campaign = await this.adRepository.findById(id);

        if (!campaign) {
          return null;
        }

        const [updatedCount] = await this.adRepository.update(id, updates);

        if (updatedCount === 0 && Object.keys(updates).length > 0) {
          // If we tried to update but nothing changed (maybe no fields passed?), just return original.
          // But if updates were passed and count is 0, it might mean DB error or no row found (but we checked findById).
          // It usually means values were same.
        }

        const updatedCampaign = await this.adRepository.findById(id);

        structuredLogger.business('AD_CAMPAIGN_UPDATED', 0, campaign.advertiserId, {
          campaignId: id,
          updates: Object.keys(updates)
        });

        return updatedCampaign;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async deleteCampaign(id: string): Promise<boolean> {
    return tracer.startActiveSpan('service.AdvertisingService.deleteCampaign', async (span) => {
      try {
        span.setAttribute('campaignId', id);
        const deletedCount = await this.adRepository.delete(id);
        return deletedCount > 0;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getActiveCampaigns(advertiserId?: string): Promise<AdCampaign[]> {
    return tracer.startActiveSpan('service.AdvertisingService.getActiveCampaigns', async (span) => {
      try {
        const where: any = {
          status: 'active',
          startDate: { [Op.lte]: new Date() },
          endDate: { [Op.gte]: new Date() }
        };

        if (advertiserId) {
          where.advertiserId = advertiserId;
        }

        return await this.adRepository.findAll({ where });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getExpiredCampaigns(advertiserId?: string): Promise<AdCampaign[]> {
    return tracer.startActiveSpan('service.AdvertisingService.getExpiredCampaigns', async (span) => {
      try {
        const where: any = {
          endDate: { [Op.lt]: new Date() }
        };

        if (advertiserId) {
          where.advertiserId = advertiserId;
        }

        return await this.adRepository.findAll({ where });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getPendingCampaigns(advertiserId?: string): Promise<AdCampaign[]> {
    return tracer.startActiveSpan('service.AdvertisingService.getPendingCampaigns', async (span) => {
      try {
        const where: any = {
          status: { [Op.in]: ['DRAFT', 'PENDING_PAYMENT'] }
        };

        if (advertiserId) {
          where.advertiserId = advertiserId;
        }

        return await this.adRepository.findAll({ where });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getAdForZone(zone: string): Promise<AdCampaign | null> {
    return tracer.startActiveSpan('service.AdvertisingService.getAdForZone', async (span) => {
      try {
        const where: any = {
          // zone, // Assuming zone column exists
          status: 'active',
          startDate: { [Op.lte]: new Date() },
          endDate: { [Op.gte]: new Date() }
        };
        // Add zone filter if possible. Using casting to avoid TS error if model def is strict but DB has it.
        (where as any).zone = zone;

        const ads = await this.adRepository.findAll({ where });
        if (ads.length === 0) return null;

        // Simple rotation strategy: random
        const ad = ads[Math.floor(Math.random() * ads.length)];

        // Track impression (async, don't wait)
        this.trackImpression(ad.id).catch(err => console.error('Impression tracking failed', err));

        return ad;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }



  async trackImpression(id: string): Promise<void> {
    try {
      const ad = await this.adRepository.findById(id);
      if (ad) {
        await this.adRepository.update(id, { viewsDelivered: (ad.viewsDelivered || 0) + 1 });
      }
    } catch (error) {
      console.error('Failed to track impression', error);
    }
  }
}