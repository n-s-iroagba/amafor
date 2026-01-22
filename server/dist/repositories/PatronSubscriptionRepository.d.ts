import { PatronSubscription, PatronSubscriptionAttributes, PatronSubscriptionCreationAttributes, PatronTier, SubscriptionFrequency, SubscriptionStatus } from '@models/PatronSubscription';
import { BaseRepository } from './BaseRepository';
export interface PatronFilterOptions {
    tier?: PatronTier;
    status?: SubscriptionStatus;
    frequency?: SubscriptionFrequency;
    search?: string;
}
export declare class PatronSubscriptionRepository extends BaseRepository<PatronSubscription> {
    private auditLogRepository;
    constructor();
    deactivateCurrent(patronId: string): Promise<void>;
    findActiveByPatronId(patronId: string): Promise<PatronSubscription | null>;
    createWithAudit(data: PatronSubscriptionCreationAttributes, auditData: any): Promise<PatronSubscription>;
    updateWithAudit(id: string, data: Partial<PatronSubscriptionAttributes>, auditData: any): Promise<PatronSubscription | null>;
    cancelSubscription(id: string, auditData: any): Promise<PatronSubscription | null>;
    updatePaymentStatus(id: string, status: SubscriptionStatus, paymentReference: string, nextBillingDate?: Date): Promise<[number, PatronSubscription[]] | null>;
    findByPatron(patronId: string, filters?: PatronFilterOptions): Promise<PatronSubscription[]>;
    findActivePatrons(filters?: PatronFilterOptions, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getPublicPatronList(pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getPatronTierStats(): Promise<{
        tiers: any[];
        benefits: Record<string, string[]>;
    }>;
    processSubscriptionRenewals(): Promise<{
        renewed: number;
        failed: number;
    }>;
    private calculateNextBillingDate;
    getPatronAnalytics(dateFrom: Date, dateTo: Date): Promise<{
        totalPatrons: number;
        activePatrons: number;
        newPatrons: number;
        churnedPatrons: number;
        totalRevenue: number;
        byTier: Record<string, number>;
        byFrequency: Record<string, number>;
    }>;
    exportPatronData(format?: 'csv' | 'json'): Promise<any[]>;
    private calculateMonthsActive;
}
//# sourceMappingURL=PatronSubscriptionRepository.d.ts.map