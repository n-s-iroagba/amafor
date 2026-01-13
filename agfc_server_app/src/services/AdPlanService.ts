// services/AdPlanService.ts
import { AdPlanRepository } from '../repositories/AdPlanRepository';
import { AdPlan } from '../models/AdPlan';

export class AdPlanService {
  private adPlanRepository: AdPlanRepository;

  constructor() {
    this.adPlanRepository = new AdPlanRepository();
  }

  async getAllAdPlans(): Promise<AdPlan[]> {
    return (await this.adPlanRepository.findAll()).data;
  }

  async getAdPlanById(id: number): Promise<AdPlan | null> {
    return await this.adPlanRepository.findById(id);
  }

  async getActiveAdPlans(): Promise<AdPlan[]> {
    return await this.adPlanRepository.findActivePlans();
  }

  async createAdPlan(adPlanData: Partial<AdPlan>): Promise<AdPlan> {
    return await this.adPlanRepository.create(adPlanData);
  }

  async updateAdPlan(id: number, adPlanData: Partial<AdPlan>): Promise<AdPlan | null> {
    return await this.adPlanRepository.updateById(id, adPlanData);
  }

  async deleteAdPlan(id: number): Promise<boolean> {
    return await this.adPlanRepository.deleteById(id);
  }
}