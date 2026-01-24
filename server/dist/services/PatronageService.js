"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatronageService = void 0;
const PatronSubscriptionRepository_1 = require("../repositories/PatronSubscriptionRepository");
const PatronSubscriptionPackageRepository_1 = require("../repositories/PatronSubscriptionPackageRepository");
const PatronSubscriptionPackage_1 = require("../models/PatronSubscriptionPackage");
const errors_1 = require("../utils/errors");
class PatronageService {
    constructor() {
        this.repository = new PatronSubscriptionRepository_1.PatronSubscriptionRepository();
        this.packageRepository = new PatronSubscriptionPackageRepository_1.PatronSubscriptionPackageRepository();
    }
    async subscribeUser(userId, tier, amount) {
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
            frequency: 'MONTHLY', // Defaulting as specific logic isn't in controller
            status: PatronSubscriptionPackage_1.SubscriptionStatus.ACTIVE,
            displayName: 'Patron', // Default, should be updated by user profile
        }, auditData);
    }
    async listAllPatrons(filters) {
        return await this.repository.findActivePatrons(filters);
    }
    async getPatronById(id) {
        const patron = await this.repository.findById(id);
        if (!patron) {
            throw new errors_1.NotFoundError(`Patron subscription with ID ${id} not found`);
        }
        return patron;
    }
    async updatePatronStatus(id, status, adminId) {
        const auditData = {
            patronId: id, // Target entity
            userEmail: 'admin',
            userType: 'admin',
            ipAddress: '0.0.0.0',
            userAgent: 'unknown'
        };
        const updated = await this.repository.updateWithAudit(id, { status }, auditData);
        if (!updated) {
            throw new errors_1.NotFoundError(`Patron subscription with ID ${id} not found`);
        }
        return updated;
    }
    async cancelSubscription(id, userId) {
        const auditData = {
            patronId: userId,
            userEmail: 'user',
            userType: 'user',
            ipAddress: '0.0.0.0',
            userAgent: 'unknown'
        };
        await this.repository.cancelSubscription(id, auditData);
    }
    async checkSubscriptionStatus(userId) {
        return await this.repository.findActiveByPatronId(userId);
    }
    async getSubscriptionPackages() {
        return await this.packageRepository.findAll();
    }
}
exports.PatronageService = PatronageService;
//# sourceMappingURL=PatronageService.js.map