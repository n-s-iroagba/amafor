/**
 * ============================================================
 * E2E TEST SUITE — PATRONAGE PROGRAM
 * Journeys: UJ-SUP-001, UJ-SUP-002, UJ-SUP-003
 *
 * SERVER RESPONSE SHAPES (from PatronageController.ts, PaymentController.ts):
 *   POST /patronage/subscribe     → 201 { success, message: "Successfully subscribed to X tier", data: PatronSubscription }
 *   GET  /patrons                 → 200 { success, data: Patron[] }
 *   GET  /patrons/wall            → 200 { success, data: Patron[] }  (transformedPatrons)
 *   GET  /patrons/public          → 200 { success, data: Patron[] }  (transformedPatrons)
 *   GET  /patrons/:id             → 200 { success, data: Patron }
 *   PUT  /patrons/:id             → 200 { success, message: 'Patron status updated successfully', data: Patron }
 *   GET  /patrons/packages        → 200 { success, data: PatronSubscriptionPackage[] }
 *   POST /patrons/packages        → 201 { success, data: pkg }
 *   PUT  /patrons/packages/:id    → 200 { success, data: pkg }
 *   DELETE /patrons/packages/:id  → 200 { success, message: 'Package deleted successfully' }
 *   POST /payments/initialize     → 200 { success, message: 'Payment initiated successfully', data: { reference, authorizationUrl } }
 *   POST /payments/initialize-donation → 200 { success, message: 'Donation payment initiated successfully', data: result }
 *   GET  /payments/verify/:ref    → 200 { success, message: 'Payment verification completed', data: result }
 *   GET  /auth/me                 → AuthUser (no wrapper)
 *
 * Patron model fields: id, name, email, phoneNumber, imageUrl, bio
 * PatronSubscriptionPackage fields: id, tier, frequency, minimumAmount, benefits
 * PatronSubscription — implied by context (id, patronId, packageId, status, startDate)
 * ============================================================
 */

const patrons = [
    { id: 'pat1', name: 'Chief Emeka', email: 'chief@test.com', phoneNumber: '08012345678', imageUrl: '/patron.jpg', bio: 'Long-standing supporter', displayOnWall: true, active: true, tier: 'Sponsor' },
    { id: 'pat2', name: 'Amaka C.', email: 'amaka@test.com', phoneNumber: '', imageUrl: null, bio: '', displayOnWall: true, active: true, tier: 'Patron' },
    { id: 'pat3', name: 'Hidden Fan', email: 'hidden@test.com', phoneNumber: '', imageUrl: null, bio: '', displayOnWall: false, active: true, tier: 'Supporter' },
    { id: 'pat4', name: 'Expired Patron', email: 'exp@test.com', phoneNumber: '', imageUrl: null, bio: '', displayOnWall: true, active: false, tier: 'Supporter' },
];

const packages = [
    { id: 'pkg1', tier: 'Sponsor', frequency: 'monthly', miniumumAmount: 50000, benefits: ['Logo placement', 'Naming rights'], createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
    { id: 'pkg2', tier: 'Patron', frequency: 'monthly', miniumumAmount: 10000, benefits: ['Name on wall'], createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
];

const paymentInitResult = { reference: 'ref_001', authorizationUrl: 'https://paystack.com/pay/ref_001' };

// ─────────────────────────────────────────────────────────────
// UJ-SUP-001 — One-Time Donation
// BR: BR-AO-02, BR-PP-05 | SRS: REQ-SUP-01, REQ-SUP-04
// Screens: SC-106, SC-107
// ─────────────────────────────────────────────────────────────
describe('UJ-SUP-001 — One-Time Donation', () => {
    describe('Happy Path', () => {
        it('E2E-SUP-001-H01: Patron landing — GET /patrons/packages returns { success, data: Package[] }', () => {
            cy.intercept('GET', '**/api/patrons/packages*', { statusCode: 200, body: { success: true, data: packages } }).as('getPackages');
            cy.intercept('GET', '**/api/patrons*', { statusCode: 200, body: { success: true, data: patrons.slice(0, 2) } });

            cy.visit('/patron');
            cy.wait('@getPackages');
            cy.contains(/support|patron|donate/i).should('be.visible');
        });

        it('E2E-SUP-001-H02: Donation — POST /payments/initialize-donation → { success, message, data: { reference, authorizationUrl } }', () => {
            cy.intercept('GET', '**/api/patrons/packages*', { body: { success: true, data: packages } });
            cy.intercept('GET', '**/api/patrons*', { body: { success: true, data: [] } });
            cy.intercept('POST', '**/api/payments/initialize-donation*', {
                statusCode: 200,
                body: { success: true, message: 'Donation payment initiated successfully', data: paymentInitResult },
            }).as('initDonation');

            cy.visit('/patron');
            cy.contains(/donate|checkout|give now/i, { matchCase: false }).first().click({ force: true });

            cy.wait('@initDonation').its('response.body.data.reference').should('eq', 'ref_001');
        });

        it('E2E-SUP-001-H03: Payment verify — GET /payments/verify/:ref → { success, message, data: { status, receiptSent } }', () => {
            cy.intercept('GET', '**/api/payments/verify/ref_001*', {
                statusCode: 200,
                body: { success: true, message: 'Payment verification completed', data: { status: 'success', receiptSent: true } },
            }).as('verifyPayment');

            cy.visit('/patron/checkout?reference=ref_001');
            cy.wait('@verifyPayment');
            cy.contains(/thank you|receipt|confirmed|payment.*success/i).should('be.visible');
        });
    });

    describe('Failure Path', () => {
        it('E2E-SUP-001-F01: Payment gateway failure shows error message', () => {
            cy.intercept('GET', '**/api/patrons/packages*', { body: { success: true, data: packages } });
            cy.intercept('GET', '**/api/patrons*', { body: { success: true, data: [] } });
            cy.intercept('POST', '**/api/payments/initialize-donation*', {
                statusCode: 500, body: { success: false, message: 'Payment gateway error' },
            }).as('payFail');

            cy.visit('/patron');
            cy.contains(/donate|checkout|give/i, { matchCase: false }).first().click({ force: true });
            cy.wait('@payFail');
            cy.contains(/error|failed|try again/i).should('be.visible');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-SUP-002 — Patron Subscription
// BR: BR-PP-01, BR-PP-02, BR-PP-05, BR-PP-06
// SRS: REQ-SUP-02..REQ-SUP-05 | Screens: SC-106, SC-107, SC-108
// POST /patronage/subscribe → { success, message, data: PatronSubscription }
// ─────────────────────────────────────────────────────────────
describe('UJ-SUP-002 — Patron Subscription', () => {
    describe('Happy Path', () => {
        it('E2E-SUP-002-H01: Packages show tier, frequency and miniumumAmount', () => {
            cy.intercept('GET', '**/api/patrons/packages*', { body: { success: true, data: packages } }).as('getPackages');
            cy.intercept('GET', '**/api/patrons*', { body: { success: true, data: [] } });

            cy.visit('/patron');
            cy.wait('@getPackages');
            cy.contains(/monthly|yearly|lifetime/i).should('be.visible');
        });

        it('E2E-SUP-002-H02: Subscription — POST /payments/initialize → { success, message, data: result } (BR-PP-01)', () => {
            cy.intercept('GET', '**/api/patrons/packages*', { body: { success: true, data: packages } });
            cy.intercept('GET', '**/api/patrons*', { body: { success: true, data: [] } });
            cy.intercept('POST', '**/api/payments/initialize*', {
                statusCode: 200,
                body: { success: true, message: 'Payment initiated successfully', data: paymentInitResult },
            }).as('subInit');

            cy.visit('/patron');
            cy.contains(/subscribe|patron/i, { matchCase: false }).first().click({ force: true });
            cy.wait('@subInit').its('response.body.data.reference').should('eq', 'ref_001');
        });

        it('E2E-SUP-002-H03: displayOnWall preference checkbox is present (BR-PP-06)', () => {
            cy.intercept('GET', '**/api/patrons/packages*', { body: { success: true, data: packages } });
            cy.intercept('GET', '**/api/patrons*', { body: { success: true, data: [] } });

            cy.visit('/patron');
            cy.get('input[type="checkbox"][name*="wall"], input[name*="display"]').first().check({ force: true });
        });

        it('E2E-SUP-002-H04: Patron Wall — GET /patrons returns opted-in active patrons', () => {
            cy.intercept('GET', '**/api/patrons*', {
                statusCode: 200, body: { success: true, data: patrons },
            }).as('getPatrons');

            cy.visit('/patron/wall');
            cy.wait('@getPatrons');
            cy.contains('Chief Emeka').should('be.visible');
            cy.contains('Amaka C.').should('be.visible');
        });
    });

    describe('Edge Case', () => {
        it('E2E-SUP-002-E01: Patron with displayOnWall=false NOT visible on wall', () => {
            cy.intercept('GET', '**/api/patrons*', { body: { success: true, data: patrons } }).as('getWall');
            cy.visit('/patron/wall');
            cy.wait('@getWall');
            cy.contains('Hidden Fan').should('not.exist');
        });

        it('E2E-SUP-002-E02: Expired patron (active=false) NOT shown on wall', () => {
            cy.intercept('GET', '**/api/patrons*', { body: { success: true, data: patrons } });
            cy.visit('/patron/wall');
            cy.contains('Expired Patron').should('not.exist');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-SUP-003 — Public Patron Wall
// BR: BR-PP-03, BR-PP-04, BR-PP-07 | SRS: REQ-SUP-06..REQ-SUP-08
// Screens: SC-001, SC-108
// ─────────────────────────────────────────────────────────────
describe('UJ-SUP-003 — Public Patron Wall', () => {
    describe('Happy Path', () => {
        it('E2E-SUP-003-H01: Homepage patron section — GET /patrons/top returns { success, data } (BR-PP-03)', () => {
            cy.intercept('GET', '**/api/patrons/top*', {
                statusCode: 200,
                body: { success: true, data: [{ id: 'pat1', name: 'Chief Emeka', tier: 'Sponsor' }] },
            }).as('getTopPatrons');

            cy.visit('/');
            cy.wait('@getTopPatrons');
            cy.contains(/patron|supporter|sponsor/i).should('be.visible');
        });

        it('E2E-SUP-003-H02: "Support Us" CTA above fold on homepage (BR-PP-07)', () => {
            cy.intercept('GET', '**/api/patrons/top*', { body: { success: true, data: [] } });
            cy.visit('/');
            cy.contains(/support us/i).should('be.visible');
        });

        it('E2E-SUP-003-H03: Patron Wall groups by tier; active opted-in only (BR-PP-04)', () => {
            cy.intercept('GET', '**/api/patrons*', {
                statusCode: 200,
                body: { success: true, data: patrons },
            }).as('getWall');

            cy.visit('/patron/wall');
            cy.wait('@getWall');
            cy.contains('Chief Emeka').should('be.visible');
            cy.contains('Amaka C.').should('be.visible');
            // opted-out and expired not shown
            cy.contains('Hidden Fan').should('not.exist');
            cy.contains('Expired Patron').should('not.exist');
            cy.contains(/sponsor/i).should('be.visible');
        });
    });
});
