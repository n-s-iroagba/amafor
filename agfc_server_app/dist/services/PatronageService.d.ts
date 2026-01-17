import { PatronSubscription } from '../models';
export declare class PatronageService {
    private patronRepo;
    private userRepo;
    constructor();
    subscribeUser(userId: string, tier: 'GOLD' | 'SILVER' | 'BRONZE', amount: number): Promise<PatronSubscription>;
    checkSubscriptionStatus(userId: string): Promise<{
        isActive: boolean;
        tier?: string;
    }>;
}
//# sourceMappingURL=PatronageService.d.ts.map