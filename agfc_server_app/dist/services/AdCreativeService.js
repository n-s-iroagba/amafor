"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdCreativeService = void 0;
const AdCreativeRepository_1 = require("@repositories/AdCreativeRepository");
class AdCreativeService {
    constructor() {
        this.adCreativeRepository = new AdCreativeRepository_1.AdCreativeRepository();
        this.subscriptionService = new SubscriptionService();
    }
    async getAllAdCreatives() {
        return (await this.adCreativeRepository.findAll()).data;
    }
    async getAdCreativeById(id) {
        return await this.adCreativeRepository.findById(id);
    }
    async getAdCreativesBySubscription(subscriptionId) {
        return await this.adCreativeRepository.findBySubscription(subscriptionId);
    }
    async getActiveAdCreatives() {
        return await this.adCreativeRepository.findActiveCreatives();
    }
    async createAdCreative(adCreativeData) {
        // Verify the subscription is valid
        if (adCreativeData.subscriptionId) {
            const isValid = await this.subscriptionService.checkSubscriptionValidity(adCreativeData.subscriptionId);
            if (!isValid) {
                throw new Error('Subscription is not valid or active');
            }
        }
        return await this.adCreativeRepository.create(adCreativeData);
    }
    async updateAdCreative(id, adCreativeData) {
        return await this.adCreativeRepository.updateById(id, adCreativeData);
    }
    async deleteAdCreative(id) {
        return await this.adCreativeRepository.deleteById(id);
    }
    async getAdCreativeForZone(zoneIdentifier) {
        const ads = await this.adCreativeRepository.findByAdsZone(zoneIdentifier);
        console.log('ads', ads);
        if (!ads || ads.length === 0) {
            console.warn(`No ads found for zone: ${zoneIdentifier}`);
            return null;
        }
        const ad = ads.reduce((minAd, currentAd) => currentAd.numberOfViews < minAd.numberOfViews ? currentAd : minAd);
        return ad;
    }
}
exports.AdCreativeService = AdCreativeService;
//# sourceMappingURL=AdCreativeService.js.map