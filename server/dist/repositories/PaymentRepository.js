"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
// repositories/PaymentRepository.ts
const sequelize_1 = require("sequelize");
const BaseRepository_1 = require("./BaseRepository");
const Payment_1 = require("@models/Payment");
class PaymentRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Payment_1.Payment);
    }
    async findByReference(reference) {
        return await this.findOne({
            where: { reference },
        });
    }
    async findByProviderReference(providerReference) {
        return await this.findOne({
            where: { providerReference },
        });
    }
    async findByUserId(userId) {
        return await this.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });
    }
    async findByStatus(status) {
        return await this.findAll({
            where: { status },
            order: [['createdAt', 'DESC']],
        });
    }
    async findByType(type) {
        return await this.findAll({
            where: { type },
            order: [['createdAt', 'DESC']],
        });
    }
    async getTotalRevenue(startDate, endDate) {
        const where = {
            status: Payment_1.PaymentStatus.SUCCESSFUL,
        };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt[sequelize_1.Op.gte] = startDate;
            if (endDate)
                where.createdAt[sequelize_1.Op.lte] = endDate;
        }
        const result = await this.model.sum('amount', { where });
        return result || 0;
    }
    async getRevenueByType(startDate, endDate) {
        const where = {
            status: Payment_1.PaymentStatus.SUCCESSFUL,
        };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt[sequelize_1.Op.gte] = startDate;
            if (endDate)
                where.createdAt[sequelize_1.Op.lte] = endDate;
        }
        const payments = await this.findAll({
            where,
            attributes: ['type', 'amount'],
        });
        const revenue = {
            [Payment_1.PaymentType.ADVERTISEMENT]: 0,
            [Payment_1.PaymentType.DONATION]: 0,
            [Payment_1.PaymentType.SUBSCRIPTION]: 0,
        };
        payments.forEach(payment => {
            revenue[payment.type] += payment.amount;
        });
        return revenue;
    }
    async getPaymentStats(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt[sequelize_1.Op.gte] = startDate;
            if (endDate)
                where.createdAt[sequelize_1.Op.lte] = endDate;
        }
        const [total, successful, pending, failed, totalAmount] = await Promise.all([
            this.count({ where }),
            this.count({ where: { ...where, status: Payment_1.PaymentStatus.SUCCESSFUL } }),
            this.count({ where: { ...where, status: Payment_1.PaymentStatus.PENDING } }),
            this.count({ where: { ...where, status: Payment_1.PaymentStatus.FAILED } }),
            this.getTotalRevenue(startDate, endDate),
        ]);
        return {
            total,
            successful,
            pending,
            failed,
            totalAmount,
        };
    }
    async updatePaymentStatus(reference, status, providerReference) {
        const updateData = { status };
        if (status === Payment_1.PaymentStatus.SUCCESSFUL) {
            updateData.verifiedAt = new Date();
        }
        if (providerReference) {
            updateData.providerReference = providerReference;
        }
        const [affectedCount] = await this.update(reference, updateData, { where: { reference } });
        if (affectedCount > 0) {
            return await this.findByReference(reference);
        }
        return null;
    }
    async markAsVerified(reference, providerReference) {
        return await this.updatePaymentStatus(reference, Payment_1.PaymentStatus.SUCCESSFUL, providerReference);
    }
    async markAsRefunded(id) {
        const [affectedCount] = await this.update(id, {
            status: Payment_1.PaymentStatus.REFUNDED,
            refundedAt: new Date(),
        });
        if (affectedCount > 0) {
            return await this.findById(id);
        }
        return null;
    }
    // Override create to ensure unique reference
    async create(data) {
        // Generate reference if not provided
        if (!data.reference) {
            data.reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        return await super.create(data);
    }
}
exports.PaymentRepository = PaymentRepository;
//# sourceMappingURL=PaymentRepository.js.map