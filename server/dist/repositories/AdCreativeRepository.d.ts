import { AdCreative, AdCreativeAttributes, AdCreativeCreationAttributes } from '@models/AdCreative';
import { BaseRepository } from './BaseRepository';
export interface IAdCreativeRepository {
    findById(id: string): Promise<AdCreative | null>;
    findAll(options?: any): Promise<AdCreative[]>;
    findOne(options?: any): Promise<AdCreative | null>;
    create(data: AdCreativeCreationAttributes): Promise<AdCreative>;
    update(id: string, data: Partial<AdCreativeAttributes>): Promise<[number, AdCreative[]]>;
    delete(id: string): Promise<number>;
    count(options?: any): Promise<number>;
    paginate(page: number, limit: number, options?: any): Promise<any>;
    exists(id: string): Promise<boolean>;
    findByCampaignId(campaignId: string): Promise<AdCreative[]>;
    findByZoneId(zoneId: string): Promise<AdCreative[]>;
    findByType(type: 'image' | 'video'): Promise<AdCreative[]>;
    findByFormat(format: string): Promise<AdCreative[]>;
    findActiveCreatives(zoneId?: string): Promise<AdCreative[]>;
    getCreativeStats(campaignId?: string): Promise<{
        total: number;
        images: number;
        videos: number;
        totalViews: number;
        averageViews: number;
    }>;
    getTopPerformers(limit?: number): Promise<AdCreative[]>;
    getCreativesByCampaign(campaignId: string): Promise<AdCreative[]>;
    incrementViews(id: string, count?: number): Promise<void>;
    resetViews(id: string): Promise<void>;
    updateCreativeUrl(id: string, url: string): Promise<void>;
    bulkUpdateCampaignCreatives(campaignId: string, updates: Partial<AdCreativeAttributes>): Promise<number>;
    deleteByCampaignId(campaignId: string): Promise<number>;
    searchCreatives(query: string): Promise<AdCreative[]>;
    filterByDimensions(minWidth?: number, minHeight?: number): Promise<AdCreative[]>;
}
export declare class AdCreativeRepository extends BaseRepository<AdCreative> implements IAdCreativeRepository {
    private adZoneRepository;
    constructor();
    findByCampaignId(campaignId: string): Promise<AdCreative[]>;
    findByZoneId(zoneId: string): Promise<AdCreative[]>;
    findByType(type: 'image' | 'video'): Promise<AdCreative[]>;
    findByFormat(format: string): Promise<AdCreative[]>;
    findActiveCreatives(zoneId?: string): Promise<AdCreative[]>;
    getCreativeStats(campaignId?: string): Promise<{
        total: number;
        images: number;
        videos: number;
        totalViews: number;
        averageViews: number;
    }>;
    getTopPerformers(limit?: number): Promise<AdCreative[]>;
    getCreativesByCampaign(campaignId: string): Promise<AdCreative[]>;
    incrementViews(id: string, count?: number): Promise<void>;
    resetViews(id: string): Promise<void>;
    updateCreativeUrl(id: string, url: string): Promise<void>;
    bulkUpdateCampaignCreatives(campaignId: string, updates: Partial<AdCreativeAttributes>): Promise<number>;
    deleteByCampaignId(campaignId: string): Promise<number>;
    searchCreatives(query: string): Promise<AdCreative[]>;
    filterByDimensions(minWidth?: number, minHeight?: number): Promise<AdCreative[]>;
    create(data: AdCreativeCreationAttributes): Promise<AdCreative>;
    update(id: string, data: Partial<AdCreativeAttributes>): Promise<[number, AdCreative[]]>;
    private validateCreativeType;
    private getDefaultDimensions;
}
//# sourceMappingURL=AdCreativeRepository.d.ts.map