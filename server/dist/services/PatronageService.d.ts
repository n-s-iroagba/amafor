import { PatronSubscription, PatronTier, SubscriptionStatus } from '../models/PatronSubscription';
export declare class PatronageService {
    private repository;
    constructor();
    subscribeUser(userId: string, tier: PatronTier, amount: number): Promise<PatronSubscription>;
    listAllPatrons(filters: any): Promise<any>;
    getPatronById(id: string): Promise<PatronSubscription>;
    updatePatronStatus(id: string, status: SubscriptionStatus, adminId: string): Promise<PatronSubscription>;
    cancelSubscription(id: string, userId: string): Promise<void>;
    checkSubscriptionStatus(userId: string): Promise<PatronSubscription | null>;
}
//# sourceMappingURL=PatronageService.d.ts.map