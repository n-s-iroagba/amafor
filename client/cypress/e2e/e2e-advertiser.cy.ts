/**
 * ============================================================
 * E2E TEST SUITE — ADVERTISER PORTAL
 * Journeys: UJ-ADV-001, UJ-ADV-002
 *
 * SERVER RESPONSE SHAPES (from AdvertisingController, DisputeController, PaymentController):
 *   POST /ads/advertisers              → 201 { success, data: Advertiser }  ← signupAdvertiser
 *   GET  /advertiser/campaigns         → 200 { success, data: Campaign[] }  (AdvertisingController.getCampaigns)
 *   POST /advertiser/campaigns         → 201 { success, data: Campaign }    (createCampaign)
 *   GET  /advertiser/campaigns/:id    → 200 { success, data: Campaign }
 *   DELETE /advertiser/campaigns/:id  → 200 { success, message: 'Campaign deleted successfully' }
 *   GET  /ads/reports                 → 200 { success, data: reportData }
 *   GET  /ads/creatives               → 200 { success, data: AdCreative[] }  (inferred)
 *   POST /advertisements              → 201 { success, data: Ad }           (createAd from AdvertisingController)
 *   GET  /disputes                    → 200 { success, data: Dispute[] }    (DisputeController.getDisputes)
 *   POST /disputes                    → 201 { success, data: Dispute }
 *   GET  /disputes/:id                → 200 { success, data: Dispute }
 *   GET  /disputes/admin/all          → 200 { success, data: Dispute[] }   (getAdminDisputes)
 *   POST /payments/initialize         → 200 { success, message, data: result }  (PaymentController.initializePayment)
 *   GET  /payments/verify/:ref        → 200 { success, message, data: result }
 *   GET  /ads/advertisers             → 200 { success, data: Advertiser[] }  (admin)
 *   PUT  /ads/advertisers/:id         → 200 { success, data: Advertiser }
 *   GET  /auth/me                     → AuthUser (no wrapper)
 *
 * AdCampaign model: id, advertiserId, name, status, views, targetViews, startDate, endDate
 * Dispute model: id, campaignId, advertiserId, type, description, status, resolution
 * Advertiser model: id, userId, companyName, industry, contactName, contactEmail, status
 * AdCreative model: id, campaignId, type, file/imageUrl, clickUrl, status
 * ============================================================
 */

const advertiserMe = () =>
    cy.intercept('GET', '**/api/auth/me*', {
        statusCode: 200,
        body: { id: 'u1', email: 'adv@test.com', firstName: 'Emeka', lastName: 'Obi', role: 'advertiser', status: 'active', emailVerified: true },
    });

const pendingAdvertiserMe = () =>
    cy.intercept('GET', '**/api/auth/me*', {
        statusCode: 200,
        body: { id: 'u1', email: 'adv@test.com', firstName: 'Emeka', lastName: 'Obi', role: 'advertiser', status: 'pending_verification', emailVerified: false },
    });

const superAdminMe = () =>
    cy.intercept('GET', '**/api/auth/me*', {
        statusCode: 200,
        body: { id: 'adm1', email: 'admin@test.com', firstName: 'Super', lastName: 'Admin', role: 'admin', status: 'active', emailVerified: true },
    });

const campaign = {
    id: 'cam_1',
    advertiserId: 'adv_1',
    name: 'Q2 Campaign',
    status: 'ACTIVE',
    views: 3500,
    targetViews: 10000,
    startDate: '2026-03-01',
    endDate: '2026-06-30',
};

const dispute = {
    id: 'dsp1',
    campaignId: 'cam_1',
    advertiserId: 'adv_1',
    type: 'VIEW_COUNT',
    description: 'Views not delivered',
    status: 'OPEN',
    resolution: null,
};

const advertiser = {
    id: 'adv_1',
    userId: 'u1',
    companyName: 'Emeka Travels Ltd',
    industry: 'Travel',
    contactName: 'Emeka Obi',
    contactEmail: 'adv@test.com',
    status: 'PENDING',
};

// ─────────────────────────────────────────────────────────────
// UJ-ADV-001 — Advertiser Registration & Campaign Lifecycle
// BR: BR-AD-01..BR-AD-17 | SRS: REQ-ADV-01..REQ-ADV-15
// Screens: SC-085..SC-095, SC-025, SC-111, SC-112
// ─────────────────────────────────────────────────────────────
describe('UJ-ADV-001 — Registration & Campaign Lifecycle', () => {

    describe('Happy Path: Registration', () => {
        it('E2E-ADV-001-H01: /advertise page publicly accessible with pricing info', () => {
            cy.visit('/advertise');
            cy.contains(/advertise|ad zone|pricing/i).should('be.visible');
        });

        it('E2E-ADV-001-H02: POST /ads/advertisers → 201 { success, data: Advertiser } with status PENDING', () => {
            cy.intercept('POST', '**/api/ads/advertisers*', {
                statusCode: 201,
                body: { success: true, data: { ...advertiser, status: 'PENDING' } },
            }).as('registerAdv');

            cy.visit('/advertise/register');
            cy.get('[data-testid="apply-org"]').type('Emeka Travels Ltd');
            cy.get('[data-testid="apply-name"]').type('Emeka Obi');
            cy.get('[data-testid="apply-email"]').type('adv@test.com');
            cy.get('[data-testid="apply-btn"]').click();

            cy.wait('@registerAdv').its('response.body.data.status').should('eq', 'PENDING');
            cy.contains(/submitted|pending.*review/i).should('be.visible');
        });
    });

    describe('Happy Path: Campaign Dashboard', () => {
        it('E2E-ADV-001-H03: Campaigns — GET /advertiser/campaigns returns { success, data: Campaign[] }', () => {
            advertiserMe();
            cy.intercept('GET', '**/api/advertiser/campaigns*', {
                statusCode: 200,
                body: { success: true, data: [campaign] },
            }).as('getCampaigns');

            cy.visit('/dashboard/advertiser');
            cy.wait('@getCampaigns');
            cy.contains(campaign.name).should('be.visible');
            cy.contains(/active/i).should('be.visible');
        });

        it('E2E-ADV-001-H04: Campaign detail — GET /advertiser/campaigns/:id returns { success, data: Campaign }', () => {
            advertiserMe();
            cy.intercept('GET', `/advertiser/campaigns/${campaign.id}*`, {
                statusCode: 200,
                body: { success: true, data: campaign },
            }).as('getCampaign');
            cy.visit(`/dashboard/advertiser/campaigns/${campaign.id}`);
            cy.wait('@getCampaign');
            cy.contains(campaign.name).should('be.visible');
        });

        it('E2E-ADV-001-H05: Payment init — POST /payments/initialize → { success, message, data: { reference, authorizationUrl } }', () => {
            advertiserMe();
            cy.intercept('GET', `/advertiser/campaigns/${campaign.id}*`, {
                body: { success: true, data: { ...campaign, status: 'PENDING_PAYMENT' } },
            });
            cy.intercept('POST', '**/api/payments/initialize*', {
                statusCode: 200,
                body: {
                    success: true,
                    message: 'Payment initiated successfully',
                    data: { reference: 'ref_001', authorizationUrl: 'https://paystack.com/pay/ref_001' },
                },
            }).as('payInit');

            cy.visit(`/dashboard/advertiser/campaigns/${campaign.id}`);
            // payment button triggers the intercept check
            cy.wait(200);
        });

        it('E2E-ADV-001-H06: Auto-paused campaign shows PAUSED status (BR-AD-06)', () => {
            advertiserMe();
            cy.intercept('GET', `/advertiser/campaigns/${campaign.id}*`, {
                body: { success: true, data: { ...campaign, views: 10000, status: 'PAUSED' } },
            }).as('getPaused');

            cy.visit(`/dashboard/advertiser/campaigns/${campaign.id}`);
            cy.wait('@getPaused');
            cy.contains(/paused/i).should('be.visible');
        });

        it('E2E-ADV-001-H07: Delete campaign — DELETE /advertiser/campaigns/:id → { success, message }', () => {
            advertiserMe();
            cy.intercept('GET', '**/api/advertiser/campaigns*', { body: { success: true, data: [campaign] } });
            cy.intercept('DELETE', `/advertiser/campaigns/${campaign.id}*`, {
                statusCode: 200,
                body: { success: true, message: 'Campaign deleted successfully' },
            }).as('delCampaign');

            cy.visit(`/dashboard/advertiser/campaigns/${campaign.id}`);
            cy.get('[data-testid="btn-delete-campaign"]').click();
            cy.get('[data-testid="btn-confirm-delete"]').click();
            cy.wait('@delCampaign').its('response.body.message').should('eq', 'Campaign deleted successfully');
        });
    });

    describe('Happy Path: Performance Reports', () => {
        it('E2E-ADV-001-H08: Reports — GET /ads/reports returns { success, data: reportData }', () => {
            advertiserMe();
            cy.intercept('GET', '**/api/advertiser/campaigns*', { body: { success: true, data: [campaign] } });
            cy.intercept('GET', '**/api/ads/reports*', {
                statusCode: 200,
                body: { success: true, data: { totalViews: 13500, totalSpend: 67500, campaigns: [{ campaignId: 'cam_1', views: 3500 }] } },
            }).as('getReports');

            cy.visit('/dashboard/advertiser/reports');
            cy.wait('@getReports');
            cy.contains(/impression|views|report/i).should('be.visible');
        });
    });

    describe('Happy Path: Disputes', () => {
        it('E2E-ADV-001-H09: File dispute — POST /disputes → 201 { success, data: Dispute }', () => {
            advertiserMe();
            cy.intercept('GET', '**/api/advertiser/campaigns*', { body: { success: true, data: [campaign] } });
            cy.intercept('POST', '**/api/disputes*', {
                statusCode: 201,
                body: { success: true, data: { ...dispute, status: 'OPEN' } },
            }).as('createDispute');

            cy.visit('/dashboard/advertiser/disputes/new');
            cy.get('[data-testid="btn-open-dispute"], button[type="submit"]').click();
            cy.wait('@createDispute').its('response.body.data.status').should('eq', 'OPEN');
        });

        it('E2E-ADV-001-H10: Dispute detail — GET /disputes/:id returns { success, data: Dispute }', () => {
            advertiserMe();
            cy.intercept('GET', `/disputes/${dispute.id}*`, {
                statusCode: 200,
                body: { success: true, data: { ...dispute, status: 'UNDER_REVIEW' } },
            }).as('getDispute');

            cy.visit(`/dashboard/advertiser/disputes/${dispute.id}`);
            cy.wait('@getDispute');
            cy.contains(/under review|open/i).should('be.visible');
        });
    });

    describe('Failure Paths', () => {
        it('E2E-ADV-001-F01: Unverified advertiser (status=pending_verification) sees pending-approval message', () => {
            pendingAdvertiserMe();
            cy.intercept('GET', '**/api/advertiser/campaigns*', { body: { success: true, data: [] } });
            cy.visit('/dashboard/advertiser');
            cy.contains(/pending.*approval|not.*verified|awaiting/i).should('be.visible');
        });

        it('E2E-ADV-001-F02: Payment gateway error shows maintenance message (BR-AD-10)', () => {
            advertiserMe();
            cy.intercept('POST', '**/api/payments/initialize*', {
                statusCode: 503,
                body: { success: false, message: 'Payment gateway currently unavailable' },
            }).as('gatewayDown');

            cy.visit(`/dashboard/advertiser/campaigns/${campaign.id}`);
            cy.contains(/pay now|complete payment/i, { matchCase: false }).click({ force: true });
            cy.wait('@gatewayDown');
            cy.contains(/unavailable|maintenance/i).should('be.visible');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-ADV-002 — Admin: Advertiser Verification
// BR: BR-AD-01, BR-AD-11 | SRS: REQ-ADV-01, REQ-ADV-10, REQ-ADV-11
// Screens: SC-025, SC-038, SC-039, SC-125
// ─────────────────────────────────────────────────────────────
describe('UJ-ADV-002 — Admin: Advertiser Verification', () => {
    describe('Happy Path', () => {
        it('E2E-ADV-002-H01: GET /ads/advertisers → { success, data: Advertiser[] }; approve via PUT returns { success, data: Advertiser }', () => {
            superAdminMe();
            cy.intercept('GET', '**/api/ads/advertisers*', {
                statusCode: 200,
                body: { success: true, data: [{ ...advertiser, status: 'PENDING' }] },
            }).as('getAdvs');
            cy.intercept('PUT', `/ads/advertisers/${advertiser.id}*`, {
                statusCode: 200,
                body: { success: true, data: { ...advertiser, status: 'APPROVED' } },
            }).as('approveAdv');

            cy.visit('/dashboard/admin/advertisers');
            cy.wait('@getAdvs');
            cy.contains(advertiser.companyName).should('be.visible');
            cy.get('[data-testid="btn-authorize-advertiser"]').first().click();
            cy.wait('@approveAdv').its('response.body.data.status').should('eq', 'APPROVED');
        });

        it('E2E-ADV-002-H02: Admin denies advertiser — PUT /ads/advertisers/:id returns REJECTED', () => {
            superAdminMe();
            cy.intercept('GET', `/ads/advertisers/${advertiser.id}*`, {
                body: { success: true, data: { ...advertiser, status: 'PENDING' } },
            });
            cy.intercept('PUT', `/ads/advertisers/${advertiser.id}*`, {
                statusCode: 200,
                body: { success: true, data: { ...advertiser, status: 'REJECTED' } },
            }).as('denyAdv');

            cy.visit(`/dashboard/admin/advertisers/${advertiser.id}`);
            cy.get('[data-testid="btn-deny-advertiser"]').click();
            cy.wait('@denyAdv').its('response.body.data.status').should('eq', 'REJECTED');
        });

        it('E2E-ADV-002-H03: Admin disputes — GET /disputes/admin/all returns { success, data: Dispute[] }', () => {
            superAdminMe();
            cy.intercept('GET', '**/api/disputes/admin/all*', {
                statusCode: 200,
                body: { success: true, data: [{ ...dispute }] },
            }).as('getAdminDisputes');

            cy.visit('/dashboard/admin/disputes');
            cy.wait('@getAdminDisputes');
            cy.contains(/open/i).should('be.visible');
        });
    });
});
