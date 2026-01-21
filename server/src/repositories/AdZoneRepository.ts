// repositories/AdZoneRepository.ts
import { AdZone } from '@models/AdCampaign';
import AdZoneModel, { AdZoneAttributes, AdZoneStatus } from '@models/AdZones';
import { Op } from 'sequelize';
import { BaseRepository } from './BaseRepository';


export interface IAdZoneRepository {
  // Standard CRUD
  findById(id: string): Promise<AdZoneModel | null>;
  findAll(): Promise<AdZoneModel[]>;
  
  // AdZone specific methods
  findByZone(zone: AdZone): Promise<AdZoneModel | null>;
  findActiveZones(): Promise<AdZoneModel[]>;
  findByType(type: string): Promise<AdZoneModel[]>;
  
  // Price management
  updatePrice(zone: AdZone, pricePerView: number): Promise<boolean>;
  getZonePrice(zone: AdZone): Promise<number | null>;
  getAvailableZonesForBudget(budget: number, impressions: number): Promise<AdZoneModel[]>;
  
  // Status management
  updateStatus(zone: AdZone, status: string): Promise<boolean>;
  
  // Analytics
  getZoneStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    averagePrice: number;
  }>;
}

export class AdZoneRepository extends BaseRepository<AdZoneModel> implements IAdZoneRepository {
  constructor() {
    super(AdZoneModel as any);
  }

  async findByZone(zone: AdZone): Promise<AdZoneModel | null> {
    return await this.findOne({
      where: { zone }
    });
  }

  async findActiveZones(): Promise<AdZoneModel[]> {
    return await this.findAll({
      where: { status: 'active' },
      order: [['pricePerView', 'ASC']]
    });
  }

  async findByType(type: string): Promise<AdZoneModel[]> {
    return await this.findAll({
      where: { type },
      order: [['pricePerView', 'ASC']]
    });
  }

  async updatePrice(zone: AdZone, pricePerView: number): Promise<boolean> {
    const [affectedCount] = await this.update(
      zone,
      { pricePerView },
      { where: { zone } }
    );
    return affectedCount > 0;
  }

  async getZonePrice(zone: AdZone): Promise<number | null> {
    const adZone = await this.findByZone(zone);
    return adZone ? adZone.pricePerView : null;
  }

  async getAvailableZonesForBudget(budget: number, impressions: number): Promise<AdZoneModel[]> {
    // Calculate maximum price per view based on budget and impressions
    const maxPricePerView = budget / impressions;
    
    return await this.findAll({
      where: {
        status: 'active',
        pricePerView: {
          [Op.lte]: Math.floor(maxPricePerView * 100) // Convert to kobo
        }
      },
      order: [['pricePerView', 'DESC']]
    });
  }

  async updateStatus(zone: AdZone, status: AdZoneStatus): Promise<boolean> {
    const [affectedCount] = await this.update(
      zone,
      { status },
      { where: { zone } }
    );
    return affectedCount > 0;
  }

  async getZoneStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    averagePrice: number;
  }> {
    const [total, active, inactive, allZones] = await Promise.all([
      this.count(),
      this.count({ where: { status: 'active' } }),
      this.count({ where: { status: 'inactive' } }),
      this.findAll({ attributes: ['pricePerView'] })
    ]);

    const totalPrice = allZones.reduce((sum, zone) => sum + zone.pricePerView, 0);
    const averagePrice = total > 0 ? Math.round(totalPrice / total) : 0;

    return {
      total,
      active,
      inactive,
      averagePrice
    };
  }

  // Override update to ensure only pricePerView can be updated
  async update(zone: AdZone, data: Partial<AdZoneAttributes>, options?: any): Promise<[number, AdZoneModel[]]> {
    // Filter out fields that shouldn't be updated
    const updatableFields = ['pricePerView', 'updatedAt'];
    const filteredData: any = {};
    
    Object.keys(data).forEach(key => {
      if (updatableFields.includes(key)) {
        filteredData[key] = (data as any)[key];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      throw new Error('Only pricePerView can be updated for AdZone');
    }

    return super.update(zone, filteredData, options);
  }
}