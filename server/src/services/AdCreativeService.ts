import AdCreative, { AdCreativeCreationAttributes } from "@models/AdCreative";
import { AdCreativeRepository } from "@repositories/AdCreativeRepository";
import logger from "@utils/logger";

export class AdCreativeService {
    private adCreativeRepository: AdCreativeRepository;

    constructor() {
        this.adCreativeRepository = new AdCreativeRepository();
    }

    async getAllAdCreatives(): Promise<AdCreative[]> {
        return await this.adCreativeRepository.findAll();
    }

    async getAdCreativeById(id: string): Promise<AdCreative | null> {
        return await this.adCreativeRepository.findById(id);
    }

    async getAdCreativesByCampaign(campaignId: string): Promise<AdCreative[]> {
        return await this.adCreativeRepository.findAll({
            where: { campaignId }
        });
    }

    async getActiveAdCreatives(): Promise<AdCreative[]> {
        return await this.adCreativeRepository.findAll({
            where: { status: 'active' }
        });
    }

    async createAdCreative(adCreativeData: AdCreativeCreationAttributes): Promise<AdCreative> {
        const adCreative = await this.adCreativeRepository.create(adCreativeData);
        logger.info('AdCreative created', { id: adCreative.id });
        return adCreative;
    }

    async updateAdCreative(id: string, adCreativeData: Partial<AdCreative>): Promise<AdCreative | null> {
        const [affectedCount, updatedRecords] = await this.adCreativeRepository.update(id, adCreativeData);
        if (affectedCount === 0) {
            return null;
        }
        return updatedRecords[0] || null;
    }

    async deleteAdCreative(id: string): Promise<boolean> {
        const result = await this.adCreativeRepository.delete(id);
        return result > 0;
    }



    async incrementAdViews(id: string): Promise<void> {
        const ad = await this.adCreativeRepository.findById(id);
        if (ad) {
            await this.adCreativeRepository.update(id, {
                numberOfViews: ad.numberOfViews + 1
            });
        }
    }
}
