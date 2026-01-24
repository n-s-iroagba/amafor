import { PatronSubscription } from '../models/PatronSubscription';
import { PatronSubscriptionPackage, PatronTier, SubscriptionStatus } from '../models/PatronSubscriptionPackage';
export declare class PatronageService {
    private repository;
    private packageRepository;
    constructor();
    subscribeUser(userId: string, tier: PatronTier, amount: number): Promise<PatronSubscription>;
    listAllPatrons(filters: any): Promise<any>;
    getPatronById(id: string): Promise<PatronSubscription>;
    updatePatronStatus(id: string, status: SubscriptionStatus, adminId: string): Promise<PatronSubscription>;
    cancelSubscription(id: string, userId: string): Promise<void>;
    checkSubscriptionStatus(userId: string): Promise<PatronSubscription | null>;
    getSubscriptionPackages(): Promise<PatronSubscriptionPackage[]>;
}
//# sourceMappingURL=PatronageService.d.ts.map