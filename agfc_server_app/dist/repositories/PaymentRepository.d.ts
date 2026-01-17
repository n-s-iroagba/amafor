import { BaseRepository } from './BaseRepository';
import { Payment, PaymentAttributes, PaymentCreationAttributes, PaymentStatus, PaymentType } from '@models/Payment';
export interface IPaymentRepository {
    findById(id: string): Promise<Payment | null>;
    findAll(options?: any): Promise<Payment[]>;
    create(data: PaymentCreationAttributes): Promise<Payment>;
    update(id: string, data: Partial<PaymentAttributes>): Promise<[number, Payment[]]>;
    findByReference(reference: string): Promise<Payment | null>;
    findByProviderReference(providerReference: string): Promise<Payment | null>;
    findByUserId(userId: string): Promise<Payment[]>;
    findByStatus(status: PaymentStatus): Promise<Payment[]>;
    findByType(type: PaymentType): Promise<Payment[]>;
    getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number>;
    getRevenueByType(startDate?: Date, endDate?: Date): Promise<Record<PaymentType, number>>;
    getPaymentStats(startDate?: Date, endDate?: Date): Promise<{
        total: number;
        successful: number;
        pending: number;
        failed: number;
        totalAmount: number;
    }>;
    updatePaymentStatus(reference: string, status: PaymentStatus, providerReference?: string): Promise<Payment | null>;
    markAsVerified(reference: string, providerReference: string): Promise<Payment | null>;
    markAsRefunded(id: string): Promise<Payment | null>;
}
export declare class PaymentRepository extends BaseRepository<Payment> implements IPaymentRepository {
    constructor();
    findByReference(reference: string): Promise<Payment | null>;
    findByProviderReference(providerReference: string): Promise<Payment | null>;
    findByUserId(userId: string): Promise<Payment[]>;
    findByStatus(status: PaymentStatus): Promise<Payment[]>;
    findByType(type: PaymentType): Promise<Payment[]>;
    getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number>;
    getRevenueByType(startDate?: Date, endDate?: Date): Promise<Record<PaymentType, number>>;
    getPaymentStats(startDate?: Date, endDate?: Date): Promise<{
        total: number;
        successful: number;
        pending: number;
        failed: number;
        totalAmount: number;
    }>;
    updatePaymentStatus(reference: string, status: PaymentStatus, providerReference?: string): Promise<Payment | null>;
    markAsVerified(reference: string, providerReference: string): Promise<Payment | null>;
    markAsRefunded(id: string): Promise<Payment | null>;
    create(data: PaymentCreationAttributes): Promise<Payment>;
}
//# sourceMappingURL=PaymentRepository.d.ts.map