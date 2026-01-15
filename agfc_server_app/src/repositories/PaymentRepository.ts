// repositories/PaymentRepository.ts
import { ModelCtor, WhereOptions, Op } from 'sequelize';
import { BaseRepository } from './BaseRepository';
import { Payment, PaymentAttributes, PaymentCreationAttributes, PaymentStatus, PaymentType } from '@models/Payment';

export interface IPaymentRepository {
  // Standard CRUD
  findById(id: string): Promise<Payment | null>;
  findAll(options?:any): Promise<Payment[]>;
  create(data: PaymentCreationAttributes): Promise<Payment>;
  update(id: string, data: Partial<PaymentAttributes>): Promise<[number, Payment[]]>;
  
  // Payment-specific methods
  findByReference(reference: string): Promise<Payment | null>;
  findByProviderReference(providerReference: string): Promise<Payment | null>;
  findByUserId(userId: string): Promise<Payment[]>;
  findByStatus(status: PaymentStatus): Promise<Payment[]>;
  findByType(type: PaymentType): Promise<Payment[]>;
  
  // Analytics
  getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number>;
  getRevenueByType(startDate?: Date, endDate?: Date): Promise<Record<PaymentType, number>>;
  getPaymentStats(startDate?: Date, endDate?: Date): Promise<{
    total: number;
    successful: number;
    pending: number;
    failed: number;
    totalAmount: number;
  }>;
  
  // Business logic
  updatePaymentStatus(reference: string, status: PaymentStatus, providerReference?: string): Promise<Payment | null>;
  markAsVerified(reference: string, providerReference: string): Promise<Payment | null>;
  markAsRefunded(id: string): Promise<Payment | null>;
}

export class PaymentRepository extends BaseRepository<Payment> implements IPaymentRepository {
  constructor() {
    super(Payment);
  }

  async findByReference(reference: string): Promise<Payment | null> {
    return await this.findOne({
      where: { reference },
    });
  }

  async findByProviderReference(providerReference: string): Promise<Payment | null> {
    return await this.findOne({
      where: { providerReference },
    });
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    return await this.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    return await this.findAll({
      where: { status },
      order: [['createdAt', 'DESC']],
    });
  }

  async findByType(type: PaymentType): Promise<Payment[]> {
    return await this.findAll({
      where: { type },
      order: [['createdAt', 'DESC']],
    });
  }

  async getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number> {
    const where: WhereOptions = {
      status: PaymentStatus.SUCCESSFUL,
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = startDate;
      if (endDate) where.createdAt[Op.lte] = endDate;
    }

    const result = await this.model.sum('amount', { where });
    return result || 0;
  }

  async getRevenueByType(startDate?: Date, endDate?: Date): Promise<Record<PaymentType, number>> {
    const where: WhereOptions = {
      status: PaymentStatus.SUCCESSFUL,
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = startDate;
      if (endDate) where.createdAt[Op.lte] = endDate;
    }

    const payments = await this.findAll({
      where,
      attributes: ['type', 'amount'],
    });

    const revenue: Record<PaymentType, number> = {
      [PaymentType.ADVERTISEMENT]: 0,
      [PaymentType.DONATION]: 0,
      [PaymentType.SUBSCRIPTION]: 0,
    };

    payments.forEach(payment => {
      revenue[payment.type] += payment.amount;
    });

    return revenue;
  }

  async getPaymentStats(startDate?: Date, endDate?: Date): Promise<{
    total: number;
    successful: number;
    pending: number;
    failed: number;
    totalAmount: number;
  }> {
    const where: WhereOptions = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = startDate;
      if (endDate) where.createdAt[Op.lte] = endDate;
    }

    const [total, successful, pending, failed, totalAmount] = await Promise.all([
      this.count({ where }),
      this.count({ where: { ...where, status: PaymentStatus.SUCCESSFUL } }),
      this.count({ where: { ...where, status: PaymentStatus.PENDING } }),
      this.count({ where: { ...where, status: PaymentStatus.FAILED } }),
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

  async updatePaymentStatus(reference: string, status: PaymentStatus, providerReference?: string): Promise<Payment | null> {
    const updateData: Partial<PaymentAttributes> = { status };
    
    if (status === PaymentStatus.SUCCESSFUL) {
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

  async markAsVerified(reference: string, providerReference: string): Promise<Payment | null> {
    return await this.updatePaymentStatus(reference, PaymentStatus.SUCCESSFUL, providerReference);
  }

  async markAsRefunded(id: string): Promise<Payment | null> {
    const [affectedCount] = await this.update(id, {
      status: PaymentStatus.REFUNDED,
      refundedAt: new Date(),
    });

    if (affectedCount > 0) {
      return await this.findById(id);
    }

    return null;
  }

  // Override create to ensure unique reference
  async create(data: PaymentCreationAttributes): Promise<Payment> {
    // Generate reference if not provided
    if (!data.reference) {
      data.reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    return await super.create(data);
  }
}