/**
 * ============================================================
 * E2E TEST SUITE — SCOUT PORTAL
 * Journey: UJ-SCT-001
 *
 * SERVER RESPONSE SHAPES (from ScoutController.ts):
 *   GET  /scout/reports     → 200 { success, data: ScoutReport[] }
 *   POST /scout/reports     → 201 { success, data: ScoutReport }    ← inferred (service returns report)
 *   DELETE /scout/reports/:id → 200 { success, message: 'Report deleted' }
 *   POST /scout/applications → 201 { success, data: ScoutApplication }
 *   GET  /players           → 200 { success, results: N, data: Player[] }  (PlayerController)
 *   GET  /players/:id       → 200 { success, data: Player }
 *   GET  /fixtures          → 200 { success, results: N, data: Fixture[] }
 *   GET  /users             → 200 { success, data: User[] }        (UserController)
 *   PUT  /users/:id/verify  → 200 { success, data: User }
 *   GET  /auth/me           → 200 AuthUser (plain — no success/data wrapper)
 *
 * ScoutReport fields: id, playerId, scoutId, reportType, reportUrl, content
 * Player fields: id, name, dateOfBirth, position, height, nationality,
 *   jerseyNumber, imageUrl, status, joinedDate
 * User fields: id, email, firstName, lastName, role, status, emailVerified, metadata
 * ============================================================
 */

// ─── Auth header helpers ────────────────────────────────────
const approvedScoutMe = () =>
    cy.intercept('GET', '**/api/auth/me*', {
        statusCode: 200,
        body: { id: 'sc1', email: 'scout@test.com', firstName: 'Tolu', lastName: 'Bello', role: 'scout', status: 'active', emailVerified: true },
    });

const pendingScoutMe = () =>
    cy.intercept('GET', '**/api/auth/me*', {
        statusCode: 200,
        body: { id: 'sc1', email: 'scout@test.com', firstName: 'Tolu', lastName: 'Bello', role: 'scout', status: 'pending_verification', emailVerified: false },
    });

const players = [
    { id: 'p1', name: 'Chidera Nwosu', dateOfBirth: '2005-06-15', position: 'Forward', height: 178, nationality: 'Nigerian', jerseyNumber: 9, imageUrl: '/p1.jpg', status: 'active', joinedDate: '2024-01-01' },
    { id: 'p2', name: 'Ikenna Eze', dateOfBirth: '2003-02-20', position: 'Midfielder', height: 174, nationality: 'Nigerian', jerseyNumber: 8, imageUrl: '/p2.jpg', status: 'active', joinedDate: '2024-01-01' },
];

const scoutReport = { id: 'rpt1', playerId: 'p1', scoutId: 'sc1', reportType: 'full', reportUrl: null, content: 'Excellent pace and vision', createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z' };

describe('UJ-SCT-001 — Scout Dashboard', () => {

    // ── Authorization ─────────────────────────────────────────
    describe('Authorization', () => {
        it('E2E-SCT-001-A01: Pending scout (status=pending_verification) sees awaiting banner', () => {
            pendingScoutMe();
            cy.visit('/dashboard/scout');
            cy.contains(/awaiting.*verification|pending.*approval/i).should('be.visible');
        });

        it('E2E-SCT-001-A02: Active scout can access dashboard without restriction', () => {
            approvedScoutMe();
            cy.intercept('GET', '**/api/players*', { body: { success: true, results: 2, data: players } });
            cy.visit('/dashboard/scout');
            cy.contains(/awaiting|pending/i).should('not.exist');
        });

        it('E2E-SCT-001-A03: Non-scout role redirected away from scout dashboard', () => {
            cy.intercept('GET', '**/api/auth/me*', {
                body: { id: 'u1', email: 'fan@test.com', firstName: 'Fan', lastName: 'User', role: 'advertiser', status: 'active', emailVerified: true },
            });
            cy.visit('/dashboard/scout');
            cy.url().should('not.include', '/dashboard/scout')
                .or(cy.contains(/unauthorized|access denied/i).should('be.visible'));
        });
    });

    // ── Player Database (REQ-SCT-02) ─────────────────────────
    describe('Happy Path: Player Database', () => {
        beforeEach(() => {
            approvedScoutMe();
            cy.intercept('GET', '**/api/players*', {
                statusCode: 200,
                body: { success: true, results: 2, data: players },
            }).as('getPlayers');
            cy.visit('/dashboard/scout/players');
            cy.wait('@getPlayers');
        });

        it('E2E-SCT-001-H01: Player list — { success, results, data: Player[] } shows name and position', () => {
            cy.contains('Chidera Nwosu').should('be.visible');
            cy.contains('Forward').should('be.visible');
        });

        it('E2E-SCT-001-H02: Search filters visible players client-side', () => {
            cy.get('input[type="search"], input[placeholder*="search" i]').first().type('Chidera');
            cy.contains('Chidera Nwosu').should('be.visible');
            cy.contains('Ikenna Eze').should('not.exist');
        });

        it('E2E-SCT-001-H03: Player detail — GET /players/:id returns { success, data: Player } with stats', () => {
            cy.intercept('GET', `/players/${players[0].id}*`, {
                statusCode: 200,
                body: { success: true, data: { ...players[0], goals: 12, appearances: 24 } },
            }).as('getPlayerDetail');

            cy.contains('Chidera Nwosu').click();
            cy.wait('@getPlayerDetail');
            cy.contains('Chidera Nwosu').should('be.visible');
        });
    });

    // ── Stream-only Compliance (BR-TP-14) ─────────────────────
    describe('Compliance: Stream-only video', () => {
        it('E2E-SCT-001-H04: Stream-only badge present; no download link exposed', () => {
            approvedScoutMe();
            cy.intercept('GET', `/players/${players[0].id}*`, {
                statusCode: 200,
                body: { success: true, data: { ...players[0], videoUrl: 'https://youtube.com/watch?v=1' } },
            });
            cy.visit(`/dashboard/scout/players/${players[0].id}`);
            cy.get('[data-testid="badge-stream-only"]').should('be.visible');
            cy.get('a[download]').should('not.exist');
        });
    });

    // ── Match Analysis (REQ-SCT-03) ──────────────────────────
    describe('Happy Path: Match Analysis', () => {
        it('E2E-SCT-001-H05: Matches page — GET /fixtures returns { success, results, data: Fixture[] }', () => {
            approvedScoutMe();
            cy.intercept('GET', '**/api/fixtures*', {
                statusCode: 200,
                body: { success: true, results: 1, data: [{ id: 'm1', matchDate: '2026-04-01T15:00:00Z', homeTeam: 'Amafor FC', awayTeam: 'Rivers FC', status: 'completed', homeScore: 2, awayScore: 1, leagueId: 'lg1', venue: 'Amafor Stadium', metadata: {} }] },
            }).as('getMatches');

            cy.visit('/dashboard/scout/matches');
            cy.wait('@getMatches');
            cy.contains('Amafor FC').should('be.visible');
        });
    });

    // ── Scouting Reports CRUD (REQ-SCT-04) ──────────────────
    describe('Happy Path: Scouting Reports', () => {
        beforeEach(() => {
            approvedScoutMe();
            cy.intercept('GET', '**/api/scout/reports*', {
                statusCode: 200,
                body: { success: true, data: [scoutReport] },
            }).as('getReports');
            cy.visit('/dashboard/scout/reports');
            cy.wait('@getReports');
        });

        it('E2E-SCT-001-H06: Reports list — { success, data: ScoutReport[] } shows content', () => {
            cy.contains('Excellent pace and vision').should('be.visible');
        });

        it('E2E-SCT-001-H07: Create report — POST /scout/reports returns { success, data: ScoutReport }', () => {
            cy.intercept('POST', '**/api/scout/reports*', {
                statusCode: 201,
                body: { success: true, data: { id: 'rpt2', playerId: 'p2', scoutId: 'sc1', reportType: 'summary', reportUrl: null, content: 'Great vision' } },
            }).as('createReport');

            cy.get('[data-testid="btn-generate-report"]').click();
            cy.get('textarea, input[name*="content"]').first().type('Great vision');
            cy.get('[data-testid="btn-export-report"], [data-testid="btn-save-report"], button[type="submit"]').first().click();

            cy.wait('@createReport').its('response.body.data.reportType').should('eq', 'summary');
        });

        it('E2E-SCT-001-H08: Delete report — DELETE /scout/reports/:id returns { success, message: "Report deleted" }', () => {
            cy.intercept('DELETE', `/scout/reports/${scoutReport.id}*`, {
                statusCode: 200,
                body: { success: true, message: 'Report deleted' },
            }).as('deleteReport');

            cy.get('[data-testid="btn-delete-report"]').first().click();
            cy.get('[data-testid="btn-confirm-delete"]').click();
            cy.wait('@deleteReport').its('response.body.message').should('eq', 'Report deleted');
        });
    });

    // ── Admin: Scout Approval (REQ-SCT-06) ─────────────────
    describe('Admin: Scout Approval Workflow', () => {
        const pendingScout = {
            id: 'sc2', email: 'new@scout.com', firstName: 'New', lastName: 'Scout',
            role: 'scout', status: 'pending_verification', emailVerified: false, metadata: {},
        };

        it('E2E-SCT-001-H09: Admin GET /users returns { success, data: User[] } — approves via PUT /users/:id/verify', () => {
            cy.intercept('GET', '**/api/auth/me*', { body: { id: 'adm1', email: 'admin@test.com', firstName: 'Admin', lastName: 'User', role: 'admin', status: 'active', emailVerified: true } });
            cy.intercept('GET', '**/api/users*', { statusCode: 200, body: { success: true, data: [pendingScout] } }).as('getScouts');
            cy.intercept('PUT', `/users/${pendingScout.id}/verify*`, {
                statusCode: 200,
                body: { success: true, data: { ...pendingScout, status: 'active', emailVerified: true } },
            }).as('approveScout');

            cy.visit('/dashboard/admin/scouts');
            cy.wait('@getScouts');
            cy.contains(/approve/i).click();
            cy.wait('@approveScout').its('response.body.data.status').should('eq', 'active');
        });

        it('E2E-SCT-001-F01: Rejected scout (status=suspended) cannot access scout dashboard', () => {
            cy.intercept('GET', '**/api/auth/me*', { body: { id: 'sc3', email: 'rej@test.com', firstName: 'Rejected', lastName: 'Scout', role: 'scout', status: 'suspended', emailVerified: true } });
            cy.visit('/dashboard/scout');
            cy.contains(/rejected|access denied|awaiting|suspended/i).should('be.visible');
        });
    });
});
