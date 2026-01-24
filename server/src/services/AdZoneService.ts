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
}