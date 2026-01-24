import axios from 'axios';
import crypto from 'crypto';
import { logger } from './logger';
import { tracer } from './tracer';
import { SubscriptionStatus } from '@models/PatronSubscription';

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_xxxx';
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_xxxx';
const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co';

// Create axios instance for Paystack API
const paystackClient = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Types
export interface PaymentInitializeRequest {
  email: string;
  amount: number;
  reference?: string;
  currency?: string;
  metadata?: Record<string, any>;
  callback_url?: string;
}

export interface PaymentInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaymentVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    paid_at: string;
    created_at: string;
    currency: string;
    channel: string;
    metadata: Record<string, any>;
    customer: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      phone: string;
    };
  };
}

export interface TransferRecipientRequest {
  type: 'nuban';
  name: string;
  account_number: string;
  bank_code: string;
  currency?: string;
  description?: string;
}

export interface TransferRecipientResponse {
  status: boolean;
  message: string;
  data: {
    recipient_code: string;
    active: boolean;
    created_at: string;
    currency: string;
    domain: string;
    id: number;
    integration: number;
    name: string;
    type: string;
    updated_at: string;
    is_deleted: boolean;
    details: {
      authorization_code: string | null;
      account_number: string;
      account_name: string;
      bank_code: string;
      bank_name: string;
    };
  };
}

export interface TransferRequest {
  source: 'balance';
  amount: number;
  recipient: string;
  reason?: string;
  reference?: string;
}

export interface TransferResponse {
  status: boolean;
  message: string;
  data: {
    integration: number;
    domain: string;
    amount: number;
    currency: string;
    source: string;
    reason: string;
    recipient: number;
    status: string;
    transfer_code: string;
    id: number;
    created_at: string;
    updated_at: string;
    reference: string;
  };
}

export interface SubscriptionRequest {
  customer: string;
  plan: string;
  authorization: string;
  start_date?: string;
}

export interface SubscriptionResponse {
  status: boolean;
  message: string;
  data: {
    customer: number;
    plan: number;
    integration: number;
    domain: string;
    start: number;
    status: string;
    quantity: number;
    amount: number;
    subscription_code: string;
    email_token: string;
    authorization: Record<string, any>;
    id: number;
    created_at: string;
    updated_at: string;
  };
}

// Initialize payment
export const initializePayment = async (request: PaymentInitializeRequest): Promise<PaymentInitializeResponse> => {
  return tracer.startActiveSpan('paystack.initializePayment', async (span) => {
    try {
      span.setAttributes({
        'paystack.email': request.email,
        'paystack.amount': request.amount,
        'paystack.currency': request.currency || 'NGN',
      });

      const response = await paystackClient.post<PaymentInitializeResponse>('/transaction/initialize', {
        email: request.email,
        amount: request.amount * 100, // Convert to kobo
        currency: request.currency || 'NGN',
        reference: request.reference || generateReference(),
        metadata: request.metadata,
        callback_url: request.callback_url,
      });

      span.setAttributes({
        'paystack.status': response.data.status,
        'paystack.reference': response.data.data.reference,
      });

      logger.info('Payment initialized', {
        email: request.email,
        amount: request.amount,
        reference: response.data.data.reference,
      });

      return response.data;
    } catch (error) {
      const err = error as any;
      span.setStatus({
        code: 2,
        message: err.message,
      });

      logger.error('Error initializing payment', {
        error: err.response?.data || err.message,
        request,
      });

      throw new Error(`Payment initialization failed: ${err.message}`);
    } finally {
      span.end();
    }
  });
};

// Verify payment
export const verifyPayment = async (reference: string): Promise<PaymentVerifyResponse> => {
  return tracer.startActiveSpan('paystack.verifyPayment', async (span) => {
    try {
      span.setAttribute('paystack.reference', reference);

      const response = await paystackClient.get<PaymentVerifyResponse>(`/transaction/verify/${reference}`);

      span.setAttributes({
        'paystack.status': response.data.status,
        'paystack.payment_status': response.data.data.status,
        'paystack.amount': response.data.data.amount / 100,
      });

      logger.info('Payment verified', {
        reference,
        status: response.data.data.status,
        amount: response.data.data.amount / 100,
      });

      return response.data;
    } catch (error) {
      const err = error as any;
      span.setStatus({
        code: 2,
        message: err.message,
      });

      logger.error('Error verifying payment', {
        error: err.response?.data || err.message,
        reference,
      });

      throw new Error(`Payment verification failed: ${err.message}`);
    } finally {
      span.end();
    }
  });
};

// Create transfer recipient
export const createTransferRecipient = async (request: TransferRecipientRequest): Promise<TransferRecipientResponse> => {
  return tracer.startActiveSpan('paystack.createTransferRecipient', async (span) => {
    try {
      span.setAttributes({
        'paystack.recipient_name': request.name,
        'paystack.bank_code': request.bank_code,
        'paystack.account_number': request.account_number,
      });

      const response = await paystackClient.post<TransferRecipientResponse>('/transferrecipient', request);

      span.setAttributes({
        'paystack.status': response.data.status,
        'paystack.recipient_code': response.data.data.recipient_code,
      });

      logger.info('Transfer recipient created', {
        name: request.name,
        account_number: request.account_number,
        recipient_code: response.data.data.recipient_code,
      });

      return response.data;
    } catch (error) {
      const err = error as any;
      span.setStatus({
        code: 2,
        message: err.message,
      });

      logger.error('Error creating transfer recipient', {
        error: err.response?.data || err.message,
        request,
      });

      throw new Error(`Transfer recipient creation failed: ${err.message}`);
    } finally {
      span.end();
    }
  });
};

// Initiate transfer
export const initiateTransfer = async (request: TransferRequest): Promise<TransferResponse> => {
  return tracer.startActiveSpan('paystack.initiateTransfer', async (span) => {
    try {
      span.setAttributes({
        'paystack.amount': request.amount,
        'paystack.recipient': request.recipient,
        'paystack.reason': request.reason,
      });

      const response = await paystackClient.post<TransferResponse>('/transfer', {
        source: request.source,
        amount: request.amount * 100, // Convert to kobo
        recipient: request.recipient,
        reason: request.reason,
        reference: request.reference || generateReference(),
      });

      span.setAttributes({
        'paystack.status': response.data.status,
        'paystack.transfer_code': response.data.data.transfer_code,
        'paystack.transfer_status': response.data.data.status,
      });

      logger.info('Transfer initiated', {
        amount: request.amount,
        recipient: request.recipient,
        transfer_code: response.data.data.transfer_code,
      });

      return response.data;
    } catch (error) {
      const err = error as any;
      span.setStatus({
        code: 2,
        message: err.message,
      });

      logger.error('Error initiating transfer', {
        error: err.response?.data || err.message,
        request,
      });

      throw new Error(`Transfer initiation failed: ${err.message}`);
    } finally {
      span.end();
    }
  });
};

// Create subscription
export const createSubscription = async (request: SubscriptionRequest): Promise<SubscriptionResponse> => {
  return tracer.startActiveSpan('paystack.createSubscription', async (span) => {
    try {
      span.setAttributes({
        'paystack.customer': request.customer,
        'paystack.plan': request.plan,
      });

      const response = await paystackClient.post<SubscriptionResponse>('/subscription', request);

      span.setAttributes({
        'paystack.status': response.data.status,
        'paystack.subscription_code': response.data.data.subscription_code,
        'paystack.subscription_status': response.data.data.status,
      });

      logger.info('Subscription created', {
        customer: request.customer,
        plan: request.plan,
        subscription_code: response.data.data.subscription_code,
      });

      return response.data;
    } catch (error) {
      const err = error as any;
      span.setStatus({
        code: 2,
        message: err.message,
      });

      logger.error('Error creating subscription', {
        error: err.response?.data || err.message,
        request,
      });

      throw new Error(`Subscription creation failed: ${err.message}`);
    } finally {
      span.end();
    }
  });
};

// Verify webhook signature
export const verifyWebhookSignature = (payload: any, signature: string): boolean => {
  try {
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(payload))
      .digest('hex');

    const isValid = hash === signature;

    if (!isValid) {
      logger.warn('Invalid webhook signature', {
        expected: signature,
        actual: hash,
      });
    }

    return isValid;
  } catch (error: any) {
    logger.error('Error verifying webhook signature', { error });
    return false;
  }
};

// Generate unique reference
export const generateReference = (prefix: string = 'AGFC'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

// Map Paystack status to subscription status
export const mapSubscriptionStatus = (paystackStatus: string): SubscriptionStatus => {
  switch (paystackStatus.toLowerCase()) {
    case 'active':
      return SubscriptionStatus.ACTIVE;
    case 'cancelled':
      return SubscriptionStatus.CANCELLED;
    case 'expired':
      return SubscriptionStatus.EXPIRED;
    case 'failed':
      return SubscriptionStatus.PAYMENT_FAILED;
    default:
      return SubscriptionStatus.ACTIVE;
  }
};

// Validate webhook payload
export const validateWebhookPayload = (payload: any): {
  isValid: boolean;
  event?: string;
  data?: any;
  reference?: string;
} => {
  try {
    if (!payload || typeof payload !== 'object') {
      return { isValid: false };
    }

    const { event, data } = payload;

    if (!event || !data) {
      return { isValid: false };
    }

    return {
      isValid: true,
      event,
      data,
      reference: data.reference,
    };
  } catch (error) {
    logger.error('Error validating webhook payload', { error, payload });
    return { isValid: false };
  }
};

// Handle subscription webhook
export const handleSubscriptionWebhook = async (payload: any): Promise<{
  success: boolean;
  subscriptionCode?: string;
  reference: string;
  status: SubscriptionStatus;
}> => {
  return tracer.startActiveSpan('paystack.handleSubscriptionWebhook', async (span) => {
    try {
      const { event, data } = payload;

      span.setAttributes({
        'paystack.webhook_event': event,
        'paystack.subscription_code': data.subscription_code,
        'paystack.customer_email': data.customer?.email,
      });

      if (!event.includes('subscription.')) {
        return {
          success: false,
          reference: data.reference || 'unknown',
          status: SubscriptionStatus.ACTIVE,
        };
      }

      const status = mapSubscriptionStatus(data.status);

      logger.info('Processing subscription webhook', {
        event,
        subscription_code: data.subscription_code,
        status,
      });

      return {
        success: true,
        subscriptionCode: data.subscription_code,
        reference: data.reference || 'unknown',
        status,
      };
    } catch (error) {
      const err = error as any;
      span.setStatus({
        code: 2,
        message: err.message,
      });

      logger.error('Error handling subscription webhook', {
        error,
        payload,
      });

      return {
        success: false,
        reference: payload.data?.reference || 'unknown',
        status: SubscriptionStatus.ACTIVE,
      };
    } finally {
      span.end();
    }
  });
};

// Check Paystack service health
export const checkPaystackHealth = async (): Promise<{
  healthy: boolean;
  latency?: number;
  error?: string;
}> => {
  return tracer.startActiveSpan('paystack.checkHealth', async (span) => {
    try {
      const startTime = Date.now();

      await paystackClient.get('/transaction/totals');

      const latency = Date.now() - startTime;

      span.setAttributes({
        'paystack.healthy': true,
        'paystack.latency_ms': latency,
      });

      return {
        healthy: true,
        latency,
      };
    } catch (error) {
      const err = error as any;
      span.setAttributes({
        'paystack.healthy': false,
        'paystack.error': err.message,
      });

      return {
        healthy: false,
        error: err.message,
      };
    } finally {
      span.end();
    }
  });
};

// Export all paystack utilities
export default {
  initializePayment,
  verifyPayment,
  createTransferRecipient,
  initiateTransfer,
  createSubscription,
  verifyWebhookSignature,
  generateReference,
  mapSubscriptionStatus,
  validateWebhookPayload,
  handleSubscriptionWebhook,
  checkPaystackHealth,
  PAYSTACK_PUBLIC_KEY,
  PAYSTACK_SECRET_KEY,
  PAYSTACK_BASE_URL,
};