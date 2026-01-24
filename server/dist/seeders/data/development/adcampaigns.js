"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentAdCampaigns = void 0;
// data/development/ad-campaign.ts
const AdCampaign_1 = require("../../../models/AdCampaign");
// Calculate dates
const NOW = new Date();
const NEXT_MONTH = new Date(NOW.setMonth(NOW.getMonth() + 1));
const LAST_MONTH = new Date(NOW.setMonth(NOW.getMonth() - 2));
// Use fixed UUIDs
const CAMPAIGN_ID_1 = 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1';
const CAMPAIGN_ID_2 = 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2';
exports.developmentAdCampaigns = [
    {
        id: CAMPAIGN_ID_1,
        name: 'Summer Season Launch',
        advertiserId: 'u2u2u2u2-u2u2-u2u2-u2u2-u2u2u2u2u2u2', // Fixturees Advertiser User ID
        status: AdCampaign_1.CampaignStatus.ACTIVE,
        budget: 5000.00,
        spent: 1250.00,
        viewsDelivered: 45000,
        uniqueViews: 38000,
        currentClicks: 1200,
        targetViews: 100000,
        targeting: ['NG', 'GH', 'KE'],
        paymentStatus: AdCampaign_1.PaymentStatus.PAID,
        paymentReference: 'PAY-123456789',
        cpv: 5.00, // Cost per view
        startDate: LAST_MONTH,
        endDate: NEXT_MONTH,
        metadata: { category: 'Sports Equipment' },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: CAMPAIGN_ID_2,
        name: 'Youth Academy Promo',
        advertiserId: 'u2u2u2u2-u2u2-u2u2-u2u2-u2u2u2u2u2u2',
        status: AdCampaign_1.CampaignStatus.PENDING_PAYMENT,
        budget: 2000.00,
        spent: 0.00,
        viewsDelivered: 0,
        uniqueViews: 0,
        currentClicks: 0,
        targetViews: 50000,
        targeting: ['NG'],
        paymentStatus: AdCampaign_1.PaymentStatus.PENDING,
        paymentReference: 'PAY-PENDING-002',
        cpv: 3.00,
        startDate: NEXT_MONTH,
        endDate: undefined,
        metadata: { category: 'Education' },
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];
//# sourceMappingURL=adcampaigns.js.map