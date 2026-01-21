// services/paystack/PaystackService.ts
import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import logger from '@utils/logger';

export interface PaystackConfig {
  secretKey: string;
  publicKey: string;
  baseUrl?: string;
}

export interface InitializePaymentData {
  email: string;
  amount: number; // in kobo/cent
  reference?: string;
  currency?: string;
  metadata?: Record<string, any>;
  callback_url?: string;
  channels?: string[];
}

export interface PaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface VerifyPaymentResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    customer: {
      id: number;
      email: string;
      customer_code: string;
      first_name: string | null;
      last_name: string | null;
      phone: string | null;
    };
    authorization: Record<string, any>;
  };
}

export interface TransferRecipientData {
  type: string;
  name: string;
  account_number: string;
  bank_code: string;
  currency?: string;
}

export interface TransferData {
  source: string;
  amount: number;
  recipient: string;
  reason: string;
  reference?: string;
}

export class PaystackService {
  private readonly baseUrl: string;
  private readonly secretKey: string;
  private readonly publicKey: string;

  constructor(config: PaystackConfig) {
    this.secretKey = config.secretKey;
    this.publicKey = config.publicKey;
    this.baseUrl = config.baseUrl || 'https://api.paystack.co';
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  async initializePayment(data: InitializePaymentData): Promise<PaymentResponse> {
    try {
      const reference = data.reference || `PAY-${Date.now()}-${uuidv4().substr(0, 8)}`;
      
      const payload = {
        email: data.email,
        amount: data.amount,
        reference,
        currency: data.currency || 'NGN',
        metadata: data.metadata || {},
        callback_url: data.callback_url,
        channels: data.channels || ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      };

      logger.info('Initializing Paystack payment', { reference, amount: data.amount });

      const response = await axios.post<PaymentResponse>(
        `${this.baseUrl}/transaction/initialize`,
        payload,
        { headers: this.getHeaders() }
      );

      if (!response.data.status) {
        throw new Error(`Paystack error: ${response.data.message}`);
      }

      logger.info('Paystack payment initialized successfully', { reference });
      return response.data;

    } catch (error: any) {
      logger.error('Failed to initialize Paystack payment', {
        error: error.message,
        data,
      });
      throw error;
    }
  }

  async verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
    try {
      logger.info('Verifying Paystack payment', { reference });

      const response = await axios.get<VerifyPaymentResponse>(
        `${this.baseUrl}/transaction/verify/${reference}`,
        { headers: this.getHeaders() }
      );

      if (!response.data.status) {
        throw new Error(`Paystack verification error: ${response.data.message}`);
      }

      logger.info('Paystack payment verified', {
        reference,
        status: response.data.data.status,
        amount: response.data.data.amount,
      });

      return response.data;

    } catch (error: any) {
      logger.error('Failed to verify Paystack payment', {
        error: error.message,
        reference,
      });
      throw error;
    }
  }

  async createTransferRecipient(data: TransferRecipientData) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transferrecipient`,
        data,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error: any) {
      logger.error('Failed to create transfer recipient', {
        error: error.message,
        data,
      });
      throw error;
    }
  }

  async initiateTransfer(data: TransferData) {
    try {
      const reference = data.reference || `TRF-${Date.now()}-${uuidv4().substr(0, 8)}`;
      
      const payload = {
        source: data.source,
        amount: data.amount,
        recipient: data.recipient,
        reason: data.reason,
        reference,
      };

      const response = await axios.post(
        `${this.baseUrl}/transfer`,
        payload,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error: any) {
      logger.error('Failed to initiate transfer', {
        error: error.message,
        data,
      });
      throw error;
    }
  }

  async verifyWebhookSignature(payload: any, signature: string): Promise<boolean> {
    try {
      const hash = crypto
        .createHmac('sha512', this.secretKey)
        .update(JSON.stringify(payload))
        .digest('hex');
      
      return hash === signature;
    } catch (error) {
      logger.error('Failed to verify webhook signature', { error });
      return false;
    }
  }

  async listBanks(country = 'nigeria') {
    try {
      const response = await axios.get(`${this.baseUrl}/bank`, {
        params: { country },
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error: any) {
      logger.error('Failed to list banks', { error: error.message, country });
      throw error;
    }
  }

  async resolveAccountNumber(accountNumber: string, bankCode: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/bank/resolve`,
        {
          params: { account_number: accountNumber, bank_code: bankCode },
          headers: this.getHeaders(),
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error('Failed to resolve account number', {
        error: error.message,
        accountNumber,
        bankCode,
      });
      throw error;
    }
  }

  // Utility methods
  convertToKobo(amount: number): number {
    return Math.round(amount * 100); // Convert Naira to Kobo
  }

  convertFromKobo(amount: number): number {
    return amount / 100; // Convert Kobo to Naira
  }

  generateReference(prefix = 'PAY'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}

// Singleton instance
let paystackInstance: PaystackService | null = null;

export function getPaystackService(): PaystackService {
  if (!paystackInstance) {
    paystackInstance = new PaystackService({
      secretKey: process.env.PAYSTACK_SECRET_KEY!,
      publicKey: process.env.PAYSTACK_PUBLIC_KEY!,
    });
  }
  return paystackInstance;
}