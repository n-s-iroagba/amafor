"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentAdCampaigns = void 0;
// data/development/ad-campaign.ts
const AdCampaign_1 = require("../../../models/AdCampaign");
// Helper dates
const TODAY = new Date();
const NEXT_MONTH = new Date(new Date().setMonth(TODAY.getMonth() + 1));
exports.developmentAdCampaigns = [
    {
        id: 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa',
        name: 'Summer Boot Sale',
        // Placeholder ID: Ensure you create an Advertiser with this ID later
        advertiserId: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        status: AdCampaign_1.CampaignStatus.ACTIVE,
        budget: 50000.00,
        spent: 12500.00,
        viewsDelivered: 5000,
        uniqueViews: 4200,
        targeting: ['Lagos', 'Abuja', 'Sports Fans'],
        paymentStatus: AdCampaign_1.PaymentStatus.PAID,
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
        status: AdCampaign_1.CampaignStatus.PENDING_PAYMENT,
        budget: 100000.00,
        spent: 0.00,
        viewsDelivered: 0,
        uniqueViews: 0,
        targeting: ['Youth', 'Education', 'Tech'],
        paymentStatus: AdCampaign_1.PaymentStatus.PENDING,
        paymentReference: 'PAY-PENDING-002',
        cpv: 3.00,
        startDate: NEXT_MONTH,
        endDate: undefined,
        metadata: {},
        createdAt: TODAY,
        updatedAt: TODAY,
    }
];
//# sourceMappingURL=adcampaigns.js.map