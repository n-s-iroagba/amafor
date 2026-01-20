// services/PaymentService.ts

import { PaymentRepository, IPaymentRepository } from '@repositories/PaymentRepository';
import {
  Payment,
  PaymentAttributes,
  PaymentCreationAttributes,
  PaymentStatus,
  PaymentType,
  PaymentProvider,
  Currency,
} from '@models/Payment';
import { AdCampaign, CampaignStatus } from '@models/AdCampaign';

import { User } from '@models/User';
import logger from '@utils/logger';
import { getPaystackService, InitializePaymentData } from './PaymentGatewayService';

export interface CreateAdvertisementPaymentData {
  userId: string;
  adCampaignId: string;
  amount: number;
  currency?: Currency;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface CreateDonationPaymentData {
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency?: Currency;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface PaymentInitiationResult {
  payment: PaymentAttributes;
  paymentUrl: string;
  reference: string;
}

export interface PaymentVerificationResult {
  payment: PaymentAttributes;
  isSuccessful: boolean;
  message: string;
}

export interface RevenueStats {
  totalRevenue: number;
  revenueByType: Record<PaymentType, number>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  topCustomers: Array<{ userId: string; email: string; totalSpent: number }>;
}

export class PaymentService {
  private repository: IPaymentRepository;
  private paystackService: ReturnType<typeof getPaystackService>;

  constructor(repository?: IPaymentRepository) {
    this.repository = repository || new PaymentRepository();
    this.paystackService = getPaystackService();
  }

  async createAdvertisementPayment(data: CreateAdvertisementPaymentData): Promise<PaymentInitiationResult> {
    try {
      // Validate ad campaign exists
      const adCampaign = await AdCampaign.findByPk(data.adCampaignId);
      if (!adCampaign) {
        throw new AppError('Ad campaign not found', 404);
      }

      // Validate user exists
      const user = await User.findByPk(data.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Create payment record
      const paymentData: PaymentCreationAttributes = {
        userId: data.userId,
        reference: this.generateReference(),
        amount: this.paystackService.convertToKobo(data.amount),
        currency: data.currency || Currency.NGN,
        status: PaymentStatus.PENDING,
        type: PaymentType.ADVERTISEMENT,
        provider: PaymentProvider.PAYSTACK,
        adCampaignId: data.adCampaignId,
        subscriptionId: null,
        providerReference: null,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
        metadata: {
          ...data.metadata,
          adCampaignName: adCampaign.name,
        },
      };

      const payment = await this.repository.create(paymentData);

      // Initialize payment with Paystack
      const paystackData: InitializePaymentData = {
        email: data.customerEmail,
        amount: paymentData.amount,
        reference: payment.reference,
        currency: paymentData.currency,
        metadata: {
          paymentId: payment.id,
          userId: data.userId,
          adCampaignId: data.adCampaignId,
        },
        callback_url: `${process.env.APP_URL}/payments/verify/${payment.reference}`,
      };

      const paystackResponse = await this.paystackService.initializePayment(paystackData);

      logger.info('Advertisement payment created', {
        paymentId: payment.id,
        reference: payment.reference,
        amount: data.amount,
      });

      return {
        payment: payment.toJSON() as PaymentAttributes,
        paymentUrl: paystackResponse.data.authorization_url,
        reference: payment.reference,
      };

    } catch (error: any) {
      logger.error('Failed to create advertisement payment', {
        error: error.message,
        data,
      });
      throw error;
    }
  }

  async createDonationPayment(data: CreateDonationPaymentData): Promise<PaymentInitiationResult> {
    try {
      // Validate user exists
      const user = await User.findByPk(data.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Create payment record
      const paymentData: PaymentCreationAttributes = {
        userId: data.userId,
        reference: this.generateReference(),
        amount: this.paystackService.convertToKobo(data.amount),
        currency: data.currency || Currency.NGN,
        status: PaymentStatus.PENDING,
        type: PaymentType.DONATION,
        provider: PaymentProvider.PAYSTACK,
        adCampaignId: null,
        subscriptionId: data.subscriptionId ?? null,
        providerReference: null,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        customerPhone: data.customerPhone ?? null,
        metadata: {
          ...data.metadata,
        },
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
      };

      const payment = await this.repository.create(paymentData);

      // Initialize payment with Paystack
      const paystackData: InitializePaymentData = {
        email: data.customerEmail,
        amount: paymentData.amount,
        reference: payment.reference,
        currency: paymentData.currency,
        metadata: {
          paymentId: payment.id,
          userId: data.userId,
        },
        callback_url: `${process.env.APP_URL}/payments/verify/${payment.reference}`,
      };

      const paystackResponse = await this.paystackService.initializePayment(paystackData);

      logger.info('Donation payment created', {
        paymentId: payment.id,
        reference: payment.reference,
        amount: data.amount,
      });

      return {
        payment: payment.toJSON() as PaymentAttributes,
        paymentUrl: paystackResponse.data.authorization_url,
        reference: payment.reference,
      };

    } catch (error: any) {
      logger.error('Failed to create donation payment', {
        error: error.message,
        data,
      });
      throw error;
    }
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResult> {
    try {
      // Find payment by reference
      let payment = await this.repository.findByReference(reference);
      if (!payment) {
        throw new AppError('Payment not found', 404);
      }

      // Skip if already verified
      if (payment.isSuccessful()) {
        return {
          payment: payment.toJSON() as PaymentAttributes,
          isSuccessful: true,
          message: 'Payment already verified',
        };
      }

      // Verify with Paystack
      const verification = await this.paystackService.verifyPayment(reference);

      // Update payment status
      const status = this.mapPaystackStatus(verification.data.status);
      const updatedPayment = await this.repository.markAsVerified(
        reference,
        verification.data.reference
      );

      if (!updatedPayment) {
        throw new AppError('Failed to update payment status', 500);
      }

      // Trigger post-payment actions based on payment type
      await this.handlePostPaymentActions(updatedPayment);

      logger.info('Payment verified successfully', {
        reference,
        status,
        amount: verification.data.amount,
      });

      return {
        payment: updatedPayment.toJSON() as PaymentAttributes,
        isSuccessful: status === PaymentStatus.SUCCESSFUL,
        message: verification.data.gateway_response,
      };

    } catch (error: any) {
      logger.error('Failed to verify payment', {
        error: error.message,
        reference,
      });

      // Update payment status to failed
      await this.repository.updatePaymentStatus(reference, PaymentStatus.FAILED);

      throw error;
    }
  }

  async handleWebhook(payload: any, signature: string): Promise<void> {
    try {
      // Verify webhook signature
      const isValid = await this.paystackService.verifyWebhookSignature(payload, signature);
      if (!isValid) {
        throw new AppError('Invalid webhook signature', 401);
      }

      const event = payload.event;
      const data = payload.data;

      switch (event) {
        case 'charge.success':
          await this.handleSuccessfulCharge(data);
          break;
        case 'charge.failed':
          await this.handleFailedCharge(data);
          break;
        case 'transfer.success':
          await this.handleSuccessfulTransfer(data);
          break;
        case 'transfer.failed':
          await this.handleFailedTransfer(data);
          break;
        default:
          logger.info(`Unhandled webhook event: ${event}`);
      }

      logger.info('Webhook processed successfully', { event });

    } catch (error: any) {
      logger.error('Failed to process webhook', {
        error: error.message,
        event: payload?.event,
      });
      throw error;
    }
  }

  async getPaymentById(id: string): Promise<PaymentAttributes> {
    const payment = await this.repository.findById(id);
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }
    return payment.toJSON() as PaymentAttributes;
  }

  async getUserPayments(userId: string, page = 1, limit = 20) {
    const payments = await this.repository.findByUserId(userId);
    const total = payments.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      payments: payments.slice(startIndex, endIndex).map(p => p.toJSON() as PaymentAttributes),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  async getPaymentStats(startDate?: Date, endDate?: Date) {
    return await this.repository.getPaymentStats(startDate, endDate);
  }

  async getRevenueStats(): Promise<RevenueStats> {
    const [totalRevenue, revenueByType, monthlyRevenue, topCustomers] = await Promise.all([
      this.repository.getTotalRevenue(),
      this.repository.getRevenueByType(),
      this.getMonthlyRevenue(),
      this.getTopCustomers(),
    ]);

    return {
      totalRevenue,
      revenueByType,
      monthlyRevenue,
      topCustomers,
    };
  }

  async refundPayment(id: string): Promise<PaymentAttributes> {
    const payment = await this.repository.findById(id);
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (!payment.isRefundable()) {
      throw new AppError('Payment is not refundable', 400);
    }

    // Implement refund logic with Paystack
    // This is a simplified version - in production, you'd need to handle refunds properly

    const refundedPayment = await this.repository.markAsRefunded(id);
    if (!refundedPayment) {
      throw new AppError('Failed to process refund', 500);
    }

    logger.info('Payment refunded', { paymentId: id, amount: payment.amount });

    return refundedPayment.toJSON() as PaymentAttributes;
  }

  // Private helper methods
  private generateReference(): string {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  private mapPaystackStatus(paystackStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      success: PaymentStatus.SUCCESSFUL,
      failed: PaymentStatus.FAILED,
      abandoned: PaymentStatus.FAILED,
      pending: PaymentStatus.PENDING,
    };

    return statusMap[paystackStatus] || PaymentStatus.FAILED;
  }

  private async handlePostPaymentActions(payment: Payment): Promise<void> {
    try {
      if (payment.type === PaymentType.ADVERTISEMENT && payment.adCampaignId) {
        // Activate ad campaign
        const adCampaign = await AdCampaign.findByPk(payment.adCampaignId);
        if (adCampaign) {
          await adCampaign.update({ status: CampaignStatus.ACTIVE });
          logger.info('Ad campaign activated', { adCampaignId: payment.adCampaignId });
        }
      } else if (payment.type === PaymentType.DONATION) {
        // Log donation payment completion
        logger.info('Donation payment completed', { paymentId: payment.id });
      }
    } catch (error: any) {
      logger.error('Failed to handle post-payment actions', {
        error: error.message,
        paymentId: payment.id,
      });
    }
  }

  private async handleSuccessfulCharge(data: any): Promise<void> {
    const reference = data.reference;
    const payment = await this.repository.findByReference(reference);

    if (payment && !payment.isSuccessful()) {
      await this.repository.markAsVerified(reference, reference);
      await this.handlePostPaymentActions(payment);
    }
  }

  private async handleFailedCharge(data: any): Promise<void> {
    const reference = data.reference;
    await this.repository.updatePaymentStatus(reference, PaymentStatus.FAILED);
  }

  private async handleSuccessfulTransfer(data: any): Promise<void> {
    // Handle successful transfers (for payouts)
    logger.info('Transfer successful', { transferReference: data.reference });
  }

  private async handleFailedTransfer(data: any): Promise<void> {
    // Handle failed transfers
    logger.error('Transfer failed', { transferReference: data.reference, reason: data.reason });
  }

  private async getMonthlyRevenue(): Promise<Array<{ month: string; revenue: number }>> {
    // Get revenue for last 6 months
    const months: Array<{ month: string; revenue: number }> = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const revenue = await this.repository.getTotalRevenue(startDate, endDate);

      months.push({
        month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue: this.paystackService.convertFromKobo(revenue),
      });
    }

    return months;
  }

  private async getTopCustomers(): Promise<Array<{ userId: string; email: string; totalSpent: number }>> {
    // This is a simplified version - in production, you'd use a proper SQL query
    const allPayments = await this.repository.findAll({
      where: { status: PaymentStatus.SUCCESSFUL },
    });

    const customerMap = new Map<string, { userId: string; email: string; totalSpent: number }>();

    for (const payment of allPayments) {
      const userId = payment.userId;
      const user = await User.findByPk(userId);
      if (user) {
        const current = customerMap.get(userId) || {
          userId,
          email: user.email,
          totalSpent: 0,
        };
        current.totalSpent += this.paystackService.convertFromKobo(payment.amount);
        customerMap.set(userId, current);
      }
    }

    return Array.from(customerMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
  }
}

// Helper class for application errors
class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.name = 'AppError';
  }
}