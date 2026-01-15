import AdCreative from "@models/AdCreative";
import { AdCreativeRepository } from "@repositories/AdCreativeRepository";


export class AdCreativeService {
  private adCreativeRepository: AdCreativeRepository;
  private subscriptionService: AdCampaignService;

  constructor() {
    this.adCreativeRepository = new AdCreativeRepository();
    this.subscriptionService = new SubscriptionService();
  }

  async getAllAdCreatives(): Promise<AdCreative[]> {
    return (await this.adCreativeRepository.findAll()).data;
  }

  async getAdCreativeById(id: number): Promise<AdCreative | null> {
    return await this.adCreativeRepository.findById(id);
  }

  async getAdCreativesBySubscription(subscriptionId: number): Promise<AdCreative[]> {
    return await this.adCreativeRepository.findBySubscription(subscriptionId);
  }

  async getActiveAdCreatives(): Promise<AdCreative[]> {
    return await this.adCreativeRepository.findActiveCreatives();
  }

  async createAdCreative(adCreativeData: Partial<AdCreative>): Promise<AdCreative> {
    // Verify the subscription is valid
    if (adCreativeData.subscriptionId) {
      const isValid = await this.subscriptionService.checkSubscriptionValidity(adCreativeData.subscriptionId);
      if (!isValid) {
        throw new Error('Subscription is not valid or active');
      }
    }

    return await this.adCreativeRepository.create(adCreativeData);
  }

  async updateAdCreative(id: number, adCreativeData: Partial<AdCreative>): Promise<AdCreative | null> {
    return await this.adCreativeRepository.updateById(id, adCreativeData);
  }

  async deleteAdCreative(id: number): Promise<boolean> {
    return await this.adCreativeRepository.deleteById(id);
  }

 async getAdCreativeForZone(zoneIdentifier: string): Promise<AdCreative | null> {
  const ads = await this.adCreativeRepository.findByAdsZone(zoneIdentifier);
  console.log('ads', ads);

  if (!ads || ads.length === 0) {
    console.warn(`No ads found for zone: ${zoneIdentifier}`);
    return null;
  }

  const ad = ads.reduce((minAd, currentAd) =>
    currentAd.numberOfViews < minAd.numberOfViews ? currentAd : minAd
  );

  return ad;
}

}