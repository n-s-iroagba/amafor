// repositories/AdPlanRepository.ts
import { BaseRepository } from './BaseRepository';
import { AdPlan } from '../models/AdPlan';

export class AdPlanRepository extends BaseRepository<AdPlan> {
  constructor() {
    super(AdPlan);
  }

  async findActivePlans(): Promise<AdPlan[]> {
    return AdPlan.findAll({ where: { isActive: true } });
  }

  async findByName(name: string): Promise<AdPlan | null> {
    return AdPlan.findOne({ where: { name } });
  }
}