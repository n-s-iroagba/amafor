import { Donation, DonationAttributes, DonationCreationAttributes, DonationStatus } from '@models/Donation';
import { BaseRepository } from './BaseRepository';
export interface DonationFilterOptions {
    status?: DonationStatus;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
    donorEmail?: string;
}
export interface DonationSortOptions {
    sortBy?: 'amount' | 'createdAt' | 'completedAt';
    sortOrder?: 'asc' | 'desc';
}
export declare class DonationRepository extends BaseRepository<Donation> {
    private auditLogRepository;
    constructor();
    findByReference(reference: string): Promise<Donation | null>;
    createWithAudit(data: DonationCreationAttributes, auditData: any): Promise<Donation>;
    updateWithAudit(id: string, data: Partial<DonationAttributes>, auditData: any): Promise<Donation | null>;
    updatePaymentStatus(reference: string, status: DonationStatus, paystackReference: string, completedAt?: Date): Promise<Donation | null>;
    findWithFilters(filters: DonationFilterOptions, sort?: DonationSortOptions, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: Donation[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findSupporters(pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getDonationStats(): Promise<{
        totalDonations: number;
        totalAmount: number;
        averageDonation: number;
        recentDonations: number;
        topDonors: any[];
    }>;
    getFinancialAnalytics(dateFrom: Date, dateTo: Date, type?: 'donations' | 'all'): Promise<{
        totalRevenue: number;
        bySource?: any;
        transactionCount: number;
        averageTransactionValue: number;
        topDonors: any[];
        revenueTrend: any[];
    }>;
    private generateRevenueTrend;
    exportDonations(format?: 'csv' | 'json'): Promise<any[]>;
    getReceiptData(id: string, email?: string): Promise<any>;
}
//# sourceMappingURL=DonationRepository.d.ts.map