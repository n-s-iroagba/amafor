import { IAdZoneRepository, AdZoneRepository } from '../repositories/AdZoneRepository';
import AdZoneModel from '@models/AdZones';
import { structuredLogger, tracer } from '../utils';

export class AdZoneService {
  private adZoneRepository: IAdZoneRepository;

  constructor() {
    this.adZoneRepository = new AdZoneRepository();
  }

  async getAllZones(): Promise<AdZoneModel[]> {
    return tracer.startActiveSpan('service.AdZoneService.getAllZones', async (span) => {
      try {
        const zones = await this.adZoneRepository.findAll();
        span.setAttribute('count', zones.length);
        return zones;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getActiveZones(): Promise<AdZoneModel[]> {
    return tracer.startActiveSpan('service.AdZoneService.getActiveZones', async (span) => {
      try {
        const zones = await this.adZoneRepository.findActiveZones();
        return zones;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getZoneStats() {
    return await this.adZoneRepository.getZoneStats();
  }

  async updateZonePrice(zoneId: string, price: number): Promise<boolean> {
    return tracer.startActiveSpan('service.AdZoneService.updateZonePrice', async (span) => {
      try {
        span.setAttribute('zoneId', zoneId);
        span.setAttribute('price', price);

        // Frontend sends price in Naira, backend expects it in Kobo (based on model name price_per_view being integer usually)
        // Wait, let's check AdZones.ts again. 
        // pricePerView is DataTypes.INTEGER and field is 'price_per_view'.
        // getFormattedPrice says pricePerView / 100.
        // So yes, it's stored in KOBO.
        const priceInKobo = Math.round(price * 100);

        const [affectedCount] = await this.adZoneRepository.update(zoneId as any, { pricePerView: priceInKobo });
        return affectedCount > 0;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}