// data/development/ad-campaign.ts
import { 
  AdCampaignAttributes, 
  CampaignStatus, 
  PaymentStatus 
} from "../../../models/AdCampaign";

// Helper dates
const TODAY = new Date();
const NEXT_MONTH = new Date(new Date().setMonth(TODAY.getMonth() + 1));

export const developmentAdCampaigns: AdCampaignAttributes[] = [
  {
    id: 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa',
    name: 'Summer Boot Sale',
    // Placeholder ID: Ensure you create an Advertiser with this ID later
    advertiserId: 'ffffffff-ffff-ffff-ffff-ffffffffffff', 
    status: CampaignStatus.ACTIVE,
    budget: 50000.00,
    spent: 12500.00,
    viewsDelivered: 5000,
    uniqueViews: 4200,
    targeting: ['Lagos', 'Abuja', 'Sports Fans'],
    paymentStatus: PaymentStatus.PAID,
    paymentReference: 'PAY-CAM-001',
    cpv: 2.50,
    startDate: TODAY,
    endDate: NEXT_MONTH,
    metadata: { agency: 'TopMedia' },
    createdAt: TODAY,
    updatedAt: TODAY,
  },
  {
    id: 'bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb',
    name: 'Tech Scholarship Awareness',
    // Same placeholder Advertiser ID
    advertiserId: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    status: CampaignStatus.PENDING_PAYMENT,
    budget: 100000.00,
    spent: 0.00,
    viewsDelivered: 0,
    uniqueViews: 0,
    targeting: ['Youth', 'Education', 'Tech'],
    paymentStatus: PaymentStatus.PENDING,
    paymentReference: 'PAY-PENDING-002',
    cpv: 3.00,
    startDate: NEXT_MONTH,
    endDate: undefined,
    metadata: {},
    createdAt: TODAY,
    updatedAt: TODAY,
  }
];