"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentPatronSubscriptions = void 0;
// data/development/patron-subscription.ts
const PatronSubscription_1 = require("../../../models/PatronSubscription");
const TODAY = new Date();
const NEXT_YEAR = new Date(new Date().setFullYear(TODAY.getFullYear() + 1));
const NEXT_MONTH = new Date(new Date().setMonth(TODAY.getMonth() + 1));
exports.developmentPatronSubscriptions = [
    // Linked to Dr. Samuel Okonkwo (ID: ...1111)
    {
        id: '55555555-5555-5555-5555-555555555555',
        patronId: '11111111-1111-1111-1111-111111111111',
        tier: PatronSubscription_1.PatronTier.SPONSOR_GRAND_PATRON,
        frequency: PatronSubscription_1.SubscriptionFrequency.YEARLY,
        amount: 500000.00,
        status: PatronSubscription_1.SubscriptionStatus.ACTIVE,
        displayName: 'Dr. Samuel Okonkwo',
        message: 'Happy to support the medical wing of the academy.',
        paymentMethod: 'bank_transfer',
        paymentReference: 'REF-SAM-001',
        startedAt: TODAY,
        nextBillingDate: NEXT_YEAR,
        metadata: { source: 'admin_portal', renewal_reminder: true },
        createdAt: TODAY,
        updatedAt: TODAY,
    },
    // Linked to Chief Emeka Ani (ID: ...2222)
    {
        id: '66666666-6666-6666-6666-666666666666',
        patronId: '22222222-2222-2222-2222-222222222222',
        tier: PatronSubscription_1.PatronTier.LEGEND,
        frequency: PatronSubscription_1.SubscriptionFrequency.LIFETIME,
        amount: 5000000.00,
        status: PatronSubscription_1.SubscriptionStatus.ACTIVE,
        displayName: 'Chief Ani Foundation',
        portraitUrl: 'https://placehold.co/400x400/e9c46a/ffffff?text=Ani+Foundation',
        paymentMethod: 'bank_transfer',
        paymentReference: 'REF-ANI-LIFE-001',
        startedAt: new Date('2023-01-01'),
        nextBillingDate: undefined, // Lifetime has no next billing
        metadata: { notes: 'VIP seating required at finals' },
        createdAt: new Date('2023-01-01'),
        updatedAt: TODAY,
    },
    // Linked to Sarah Adebayo (ID: ...3333)
    {
        id: '77777777-7777-7777-7777-777777777777',
        patronId: '33333333-3333-3333-3333-333333333333',
        tier: PatronSubscription_1.PatronTier.ADVOCATE,
        frequency: PatronSubscription_1.SubscriptionFrequency.MONTHLY,
        amount: 5000.00,
        status: PatronSubscription_1.SubscriptionStatus.ACTIVE,
        displayName: 'Sarah Adebayo',
        paymentMethod: 'card',
        paymentReference: 'REF-SARAH-004',
        startedAt: TODAY,
        nextBillingDate: NEXT_MONTH,
        metadata: { auto_renew: true },
        createdAt: TODAY,
        updatedAt: TODAY,
    },
    // Linked to Global Tech Solutions (ID: ...4444)
    {
        id: '88888888-8888-8888-8888-888888888888',
        patronId: '44444444-4444-4444-4444-444444444444',
        tier: PatronSubscription_1.PatronTier.SPONSOR_GRAND_PATRON,
        frequency: PatronSubscription_1.SubscriptionFrequency.YEARLY,
        amount: 2500000.00,
        status: PatronSubscription_1.SubscriptionStatus.ACTIVE,
        displayName: 'Global Tech Solutions',
        logoUrl: 'https://placehold.co/400x400/264653/ffffff?text=GTS+Logo',
        message: 'Providing digital infrastructure for the youth.',
        paymentMethod: 'bank_transfer',
        paymentReference: 'REF-GTS-CORP-01',
        startedAt: TODAY,
        nextBillingDate: NEXT_YEAR,
        metadata: { tax_receipt_sent: false },
        createdAt: TODAY,
        updatedAt: TODAY,
    }
];
//# sourceMappingURL=patronsubscriptions.js.map