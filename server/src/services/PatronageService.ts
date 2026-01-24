import { PatronSubscriptionRepository, PatronFilterOptions } from '../repositories/PatronSubscriptionRepository';
import { PatronSubscriptionPackageRepository } from '../repositories/PatronSubscriptionPackageRepository';
import { PatronSubscription, PatronSubscriptionAttributes } from '../models/PatronSubscription';
import { PatronSubscriptionPackage, PatronTier, SubscriptionStatus, SubscriptionFrequency } from '../models/PatronSubscriptionPackage';
import { AppError, NotFoundError } from '../utils/errors';
import { structuredLogger } from '../utils';

export class PatronageService {
    private repository: PatronSubscriptionRepository;
    private packageRepository: PatronSubscriptionPackageRepository;

    constructor() {
        this.repository = new PatronSubscriptionRepository();
        this.packageRepository = new PatronSubscriptionPackageRepository();
    }

    async subscribeUser(userId: string, tier: PatronTier, amount: number): Promise<PatronSubscription> {
        // Audit data for creation
        const auditData = {
            patronId: userId,
            userEmail: 'system', // Should be fetched from context if available
            userType: 'user',
            ipAddress: '0.0.0.0', // Should be passed from controller
            userAgent: 'unknown'
        };

        // Calculate frequency based on tier or other logic? 
        // Assuming monthly for now or passed in. 
        // The controller only passed tier and amount. 
        // Ideally the controller should pass full DTO.
        // For now we default to MONTHLY if not specified.

        return await this.repository.createWithAudit({
            patronId: userId,
            tier,
            amount,
            frequency: 'MONTHLY' as any, // Defaulting as specific logic isn't in controller
            status: SubscriptionStatus.ACTIVE,
            displayName: 'Patron', // Default, should be updated by user profile
        } as any, auditData);
    }

    async listAllPatrons(filters: any): Promise<any> {
        return await this.repository.findActivePatrons(filters);
    }

    async getPatronById(id: string): Promise<PatronSubscription> {
        const patron = await this.repository.findById(id);
        if (!patron) {
            throw new NotFoundError(`Patron subscription with ID ${id} not found`);
        }
        return patron;
    }

    async updatePatronStatus(id: string, status: SubscriptionStatus, adminId: string): Promise<PatronSubscription> {
        const auditData = {
            patronId: id, // Target entity
            userEmail: 'admin',
            userType: 'admin',
            ipAddress: '0.0.0.0',
            userAgent: 'unknown'
        };

        const updated = await this.repository.updateWithAudit(id, { status }, auditData);
        if (!updated) {
            throw new NotFoundError(`Patron subscription with ID ${id} not found`);
        }
        return updated;
    }

    async cancelSubscription(id: string, userId: string): Promise<void> {
        const auditData = {
            patronId: userId,
            userEmail: 'user',
            userType: 'user',
            ipAddress: '0.0.0.0',
            userAgent: 'unknown'
        };
        await this.repository.cancelSubscription(id, auditData);
    }

    async checkSubscriptionStatus(userId: string): Promise<PatronSubscription | null> {
        return await this.repository.findActiveByPatronId(userId);
    }

    async getSubscriptionPackages(): Promise<PatronSubscriptionPackage[]> {
        return await this.packageRepository.findAll();
    }
}
