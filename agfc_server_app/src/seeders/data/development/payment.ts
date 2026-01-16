// data/development/payment.ts
import { 
  PaymentAttributes, 
  PaymentStatus, 
  PaymentType, 
  PaymentProvider, 
  Currency 
} from "../../../models/Payment";

// IDs from previous steps
const ADMIN_USER_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const AD_CAMPAIGN_ID = 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa';
const SUBSCRIPTION_ID = '55555555-5555-5555-5555-555555555555';

export const developmentPayments: PaymentAttributes[] = [
  // 1. Successful Ad Campaign Payment
  {
    id: 'pay1pay1-pay1-pay1-pay1-pay1pay1pay1',
    userId: ADMIN_USER_ID,
    reference: 'REF-PAY-AD-001',
    providerReference: 'PSTK-REF-1234567890',
    amount: 5000000, // 50,000.00 NGN (in kobo)
    currency: Currency.NGN,
    status: PaymentStatus.SUCCESSFUL,
    type: PaymentType.ADVERTISEMENT,
    provider: PaymentProvider.PAYSTACK,
    metadata: { campaign_name: 'Summer Boot Sale' },
    adCampaignId: AD_CAMPAIGN_ID,
    subscriptionId: null,
    customerEmail: 'admin@academy.com',
    customerName: 'TopMedia Agency',
    customerPhone: '+2348055555555',
    ipAddress: '197.210.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    verifiedAt: new Date(),
    refundedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // 2. Successful Patron Subscription Payment
  {
    id: 'pay2pay2-pay2-pay2-pay2-pay2pay2pay2',
    userId: ADMIN_USER_ID, // Usually the patron user, using Admin for dev data consistency
    reference: 'REF-PAY-SUB-001',
    providerReference: 'PSTK-REF-0987654321',
    amount: 50000000, // 500,000.00 NGN (in kobo)
    currency: Currency.NGN,
    status: PaymentStatus.SUCCESSFUL,
    type: PaymentType.SUBSCRIPTION,
    provider: PaymentProvider.PAYSTACK,
    metadata: { plan: 'Sponsor Grand Patron' },
    adCampaignId: null,
    subscriptionId: SUBSCRIPTION_ID,
    customerEmail: 'samuel.okonkwo@example.com',
    customerName: 'Dr. Samuel Okonkwo',
    customerPhone: '+2348012345678',
    ipAddress: '102.12.1.5',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0...)',
    verifiedAt: new Date(),
    refundedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];