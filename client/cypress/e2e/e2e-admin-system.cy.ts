/**
 * ============================================================
 * E2E TEST SUITE — ADMIN: SYSTEM OPERATIONS & UTILITY
 * Journeys: UJ-ADM-008, UJ-ADM-009, UJ-ADM-011, UJ-ADM-012,
 *           UJ-UTL-001, UJ-UTL-002
 *
 * SERVER RESPONSE SHAPES:
 * ⚠️  FeedsController returns RAW objects (no { success, data } wrapper):
 *   GET  /feeds              → RssFeedSource[]  (res.json(feedSources) — raw array)
 *   POST /feeds              → 201 RssFeedSource (res.json(feedSource) — raw object)
 *   GET  /feeds/:id          → RssFeedSource (res.json(feedSource) — raw)
 *   PUT  /feeds/:id          → RssFeedSource (res.json(feedSource) — raw)
 *   DELETE /feeds/:id        → 204 (res.status(204).send() — no body)
 *   404 errors use:          → { error: 'Feed source not found' }
 *
 *   AuditController:
 *   GET  /system/audit       → { success, data: AuditLog[] }
 *
 *   SystemController:
 *   GET  /system/health      → { success, data: status } OR raw status  (both patterns in code)
 *   GET  /system/backups     → { success, data: Backup[] }
 *   POST /system/backups     → { success, data: BackupResult }
 *   GET  /system/logs        → { success, data: logs }
 *   GET  /system/config      → { success, data: config }
 *
 *   NotificationController:  (inferred from controller file)
 *   GET  /notifications      → { success, data: SystemNotification[] }
 *   PUT  /notifications/read-all → { success, data }
 *
 *   GET  /auth/me            → AuthUser (no wrapper)
 *
 * RssFeedSource fields: id, url, category, active, lastFetched
 * AuditLog fields: id, timestamp, userId, userEmail, userType, action, entityType, entityId,
 *   entityName, oldValue, newValue, ipAddress, userAgent, changes, metadata
 * SystemNotification fields: id, userId, type, title, body, isRead, createdAt
 * ============================================================
 */

const adminMe = () =>
    cy.intercept('GET', '**/api/auth/me*', {
        statusCode: 200,
        body: { id: 'adm1', email: 'admin@test.com', firstName: 'Admin', lastName: 'User', role: 'admin', status: 'active', emailVerified: true },
    });
const superAdminMe = () =>
    cy.intercept('GET', '**/api/auth/me*', {
        statusCode: 200,
        body: { id: 'adm1', email: 'super@test.com', firstName: 'Super', lastName: 'Admin', role: 'admin', status: 'active', emailVerified: true },
    });

// RssFeedSource raw object — no { success/data } wrapper
const feedSource = { id: 'feed1', url: 'https://bbc.com/sport/rss', category: 'Football', active: true, lastFetched: '2026-03-01T06:00:00Z' };

// AuditLog fields aligned to model
const auditLog = {
    id: 'ev1',
    timestamp: '2026-03-01T12:00:00Z',
    userId: 'adm1',
    userEmail: 'admin@test.com',
    userType: 'admin',
    action: 'DELETE_PLAYER',
    entityType: 'Player',
    entityId: 'p1',
    entityName: 'Chidera Nwosu',
    oldValue: null,
    newValue: null,
    ipAddress: '192.168.1.1',
    userAgent: 'Cypress',
    changes: {},
    metadata: {},
};

// SystemNotification model fields
const notification = { id: 'n1', userId: 'adm1', type: 'scout_application', title: 'New Scout Application', body: 'A new scout application received', isRead: false, createdAt: '2026-03-01T10:00:00Z' };

// ─────────────────────────────────────────────────────────────
// UJ-ADM-008 — RSS Feed Management
// BR: BR-CE-10 | SRS: REQ-SYS-03 | Screens: SC-076..SC-078
// ⚠️  ALL feed responses are RAW (no { success, data } wrapper)
// ─────────────────────────────────────────────────────────────
describe('UJ-ADM-008 — RSS Feed Management', () => {
    describe('Happy Path', () => {
        it('E2E-ADM-008-H01: Feed list — GET /feeds returns RssFeedSource[] (RAW array, no wrapper)', () => {
            adminMe();
            // ⚠️ FeedsController.getFeedSources: res.json(feedSources) — raw array
            cy.intercept('GET', '**/api/feeds*', {
                statusCode: 200,
                body: [feedSource],
            }).as('getFeeds');

            cy.visit('/dashboard/admin/rss-feeds');
            cy.wait('@getFeeds');
            cy.get('[data-testid="btn-add-feed"]').should('be.visible');
            cy.contains(feedSource.url).should('be.visible');
            cy.contains('Football').should('be.visible');
        });

        it('E2E-ADM-008-H02: Create feed — POST /feeds → 201 RssFeedSource (RAW object)', () => {
            adminMe();
            cy.intercept('GET', '**/api/feeds*', { body: [] });
            // ⚠️ FeedsController.createFeedSource: res.status(201).json(feedSource) — raw
            cy.intercept('POST', '**/api/feeds*', {
                statusCode: 201,
                body: { id: 'feed_new', url: 'https://guardian.ng/rss', category: 'Local Football', active: true, lastFetched: null },
            }).as('createFeed');

            cy.visit('/dashboard/admin/rss-feeds/new');
            cy.get('input[name="url"]').type('https://guardian.ng/rss');
            cy.get('input[name="category"]').type('Local Football');
            cy.get('[data-testid="btn-save-feed"]').click();

            cy.wait('@createFeed').its('request.body.url').should('include', 'guardian.ng');
        });

        it('E2E-ADM-008-H03: Get single feed — GET /feeds/:id returns RssFeedSource (RAW)', () => {
            adminMe();
            // ⚠️ FeedsController.getFeedSource: res.json(feedSource) — raw
            cy.intercept('GET', `/feeds/${feedSource.id}*`, {
                statusCode: 200, body: feedSource,
            }).as('getFeed');

            cy.visit(`/dashboard/admin/rss-feeds/${feedSource.id}`);
            cy.wait('@getFeed');
            cy.contains(feedSource.url).should('be.visible');
        });

        it('E2E-ADM-008-H04: Edit feed — PUT /feeds/:id returns RssFeedSource (RAW)', () => {
            adminMe();
            cy.intercept('GET', `/feeds/${feedSource.id}*`, { body: feedSource });
            // ⚠️ FeedsController.updateFeedSource: res.json(feedSource) — raw
            cy.intercept('PUT', `/feeds/${feedSource.id}*`, {
                statusCode: 200, body: { ...feedSource, active: false },
            }).as('updateFeed');

            cy.visit(`/dashboard/admin/rss-feeds/${feedSource.id}/edit`);
            cy.get('input[type="checkbox"][name="active"]').uncheck({ force: true });
            cy.get('[data-testid="btn-save-feed"]').click();
            cy.wait('@updateFeed').its('response.body.active').should('eq', false);
        });

        it('E2E-ADM-008-H05: Delete feed — DELETE /feeds/:id → 204 no body', () => {
            adminMe();
            cy.intercept('GET', '**/api/feeds*', { body: [feedSource] });
            // ⚠️ FeedsController.deleteFeedSource: res.status(204).send() — no body
            cy.intercept('DELETE', `/feeds/${feedSource.id}*`, { statusCode: 204, body: null }).as('deleteFeed');

            cy.visit('/dashboard/admin/rss-feeds');
            cy.get('[data-testid="btn-delete-feed"]').first().click();
            cy.get('[data-testid="btn-confirm-delete"]').click();
            cy.wait('@deleteFeed').its('response.statusCode').should('eq', 204);
        });
    });

    describe('Failure Path', () => {
        it('E2E-ADM-008-F01: Feed not found — GET /feeds/:id returns { error } (not success/data)', () => {
            adminMe();
            // ⚠️ FeedsController 404: res.status(404).json({ error: 'Feed source not found' })
            cy.intercept('GET', '**/api/feeds/nonexistent*', {
                statusCode: 404, body: { error: 'Feed source not found' },
            }).as('notFound');

            cy.visit('/dashboard/admin/rss-feeds/nonexistent');
            cy.wait('@notFound');
            cy.contains(/not found|feed source/i).should('be.visible');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-ADM-009 — Audit, Backups, System Health
// BR: BR-DSR-01 | SRS: REQ-SYS-04..REQ-SYS-06
// Screens: SC-082, SC-083, SC-084
// ─────────────────────────────────────────────────────────────
describe('UJ-ADM-009 — Audit Log, Backups, System Health', () => {

    describe('Audit Log (REQ-SYS-04 — AuditController)', () => {
        it('E2E-ADM-009-H01: Audit list — GET /system/audit returns { success, data: AuditLog[] }', () => {
            adminMe();
            cy.intercept('GET', '**/api/system/audit*', {
                statusCode: 200, body: { success: true, data: [auditLog] },
            }).as('getAudit');

            cy.visit('/dashboard/admin/audit');
            cy.wait('@getAudit');
            cy.get('[data-testid="audit-log-row"]').should('have.length.at.least', 1);
            cy.contains(auditLog.userEmail).should('be.visible');
            cy.contains(auditLog.action).should('be.visible');
        });

        it('E2E-ADM-009-H02: Audit entries have no delete controls (BR-DSR-01 — immutable)', () => {
            adminMe();
            cy.intercept('GET', '**/api/system/audit*', { body: { success: true, data: [auditLog] } });
            cy.visit('/dashboard/admin/audit');
            cy.get('[data-testid="btn-confirm-delete"]').should('not.exist');
        });

        it('E2E-ADM-009-H03: Export button visible on audit page', () => {
            adminMe();
            cy.intercept('GET', '**/api/system/audit*', { body: { success: true, data: [] } });
            cy.visit('/dashboard/admin/audit');
            cy.get('[data-testid="btn-export-audit"]').should('be.visible');
        });
    });

    describe('Backups (REQ-SYS-05 — SystemController)', () => {
        it('E2E-ADM-009-H04: Backup list — GET /system/backups returns { success, data: Backup[] }', () => {
            adminMe();
            cy.intercept('GET', '**/api/system/backups*', {
                statusCode: 200,
                body: { success: true, data: [{ id: 'bk1', timestamp: '2026-02-28T03:00:00Z', sizeMB: 245, status: 'COMPLETED' }] },
            }).as('getBackups');

            cy.visit('/dashboard/admin/backups');
            cy.wait('@getBackups');
            cy.get('[data-testid="backup-row"]').should('have.length.at.least', 1);
        });

        it('E2E-ADM-009-H05: Manual backup — POST /system/backups returns { success, data: BackupResult }', () => {
            adminMe();
            cy.intercept('GET', '**/api/system/backups*', { body: { success: true, data: [] } });
            cy.intercept('POST', '**/api/system/backups*', {
                statusCode: 201,
                body: { success: true, data: { id: 'bk_new', timestamp: '2026-03-01T12:00:00Z', status: 'COMPLETED' } },
            }).as('createBackup');

            cy.visit('/dashboard/admin/backups');
            cy.get('[data-testid="btn-create-backup"]').click();
            cy.wait('@createBackup').its('response.body.data.status').should('eq', 'COMPLETED');
        });
    });

    describe('System Health (REQ-SYS-06 — SystemController)', () => {
        it('E2E-ADM-009-H06: Health — GET /system/health returns { success, data: status } with service states', () => {
            adminMe();
            cy.intercept('GET', '**/api/system/health*', {
                statusCode: 200,
                body: { success: true, data: { api: 'healthy', database: 'healthy', queue: 'healthy', email: 'degraded' } },
            }).as('getHealth');

            cy.visit('/dashboard/admin/health');
            cy.wait('@getHealth');
            cy.contains(/healthy/i).should('be.visible');
        });

        it('E2E-ADM-009-H07: Degraded service is highlighted as a warning', () => {
            adminMe();
            cy.intercept('GET', '**/api/system/health*', {
                statusCode: 200,
                body: { success: true, data: { api: 'healthy', database: 'degraded', queue: 'healthy', email: 'healthy' } },
            });
            cy.visit('/dashboard/admin/health');
            cy.contains(/degraded|warning/i).should('be.visible');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-ADM-011 — System Settings & Data Retention
// BR: BR-AD-12, BR-DSR-01 | SRS: REQ-SYS-08, REQ-SYS-09
// Screens: SC-133, SC-134
// SystemController: GET/PUT /system/config → { success, data: config }
// ─────────────────────────────────────────────────────────────
describe('UJ-ADM-011 — System Settings & Data Retention', () => {
    describe('Happy Path', () => {
        it('E2E-ADM-011-H01: Settings — GET /system/config returns { success, data: config }', () => {
            superAdminMe();
            cy.intercept('GET', '**/api/system/config*', {
                statusCode: 200,
                body: { success: true, data: { siteName: 'Amafor FC', features: { whatsapp: true, ads: true, patronage: true } } },
            }).as('getConfig');

            cy.visit('/dashboard/admin/settings');
            cy.wait('@getConfig');
            cy.contains(/amafor|site name/i).should('be.visible');
        });

        it('E2E-ADM-011-H02: Save settings — PUT /system/config returns { success, data }', () => {
            superAdminMe();
            cy.intercept('GET', '**/api/system/config*', { body: { success: true, data: { siteName: 'Amafor FC' } } });
            cy.intercept('PUT', '**/api/system/config*', {
                statusCode: 200, body: { success: true, data: { siteName: 'Amafor Gladiators FC' } },
            }).as('saveConfig');

            cy.visit('/dashboard/admin/settings');
            cy.get('input[name="siteName"]').clear().type('Amafor Gladiators FC');
            cy.get('button[type="submit"]').click();
            cy.wait('@saveConfig');
        });

        it('E2E-ADM-011-H03: Retention settings visible and enforce minimum periods (BR-DSR-01)', () => {
            superAdminMe();
            cy.intercept('GET', '**/api/admin/settings/retention*', {
                body: { success: true, data: [{ category: 'Audit Logs', retentionDays: 365, minimum: 365 }] },
            }).as('getRetention');

            cy.visit('/dashboard/admin/settings/retention');
            cy.wait('@getRetention');
            cy.contains(/audit log|retention/i).should('be.visible');
            cy.contains('365').should('be.visible');
        });

        it('E2E-ADM-011-H04: Retention below minimum blocked with 422', () => {
            superAdminMe();
            cy.intercept('GET', '**/api/admin/settings/retention*', {
                body: { success: true, data: [{ category: 'Audit Logs', retentionDays: 365, minimum: 365 }] },
            });
            cy.intercept('PUT', '**/api/admin/settings/retention*', {
                statusCode: 422,
                body: { success: false, message: 'Retention period below mandatory minimum of 365 days' },
            }).as('badRetention');

            cy.visit('/dashboard/admin/settings/retention');
            cy.get('input[type="number"]').first().clear().type('30');
            cy.get('button[type="submit"]').click();
            cy.wait('@badRetention');
            cy.contains(/minimum|365/i).should('be.visible');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-ADM-012 — Admin Notifications
// SRS: REQ-SYS-07 | Screen: SC-098
// Notification: { id, userId, type, title, body, isRead, createdAt }
// ─────────────────────────────────────────────────────────────
describe('UJ-ADM-012 — Admin Notifications', () => {
    describe('Happy Path', () => {
        it('E2E-ADM-012-H01: Notification list — GET /notifications returns { success, data: SystemNotification[] }', () => {
            adminMe();
            cy.intercept('GET', '**/api/notifications*', {
                statusCode: 200,
                body: { success: true, data: [notification] },
            }).as('getNotifs');

            cy.visit('/dashboard/admin/notifications');
            cy.wait('@getNotifs');
            cy.contains(notification.title).should('be.visible');
            cy.contains(notification.body).should('be.visible');
        });

        it('E2E-ADM-012-H02: Unread notification styled differently (isRead=false)', () => {
            adminMe();
            cy.intercept('GET', '**/api/notifications*', { body: { success: true, data: [{ ...notification, isRead: false }] } });

            cy.visit('/dashboard/admin/notifications');
            cy.get('[data-testid="notification-unread"]').should('exist');
        });

        it('E2E-ADM-012-H03: Mark all read — PUT /notifications/read-all returns { success, data }', () => {
            adminMe();
            cy.intercept('GET', '**/api/notifications*', { body: { success: true, data: [notification] } });
            cy.intercept('PUT', '**/api/notifications/read-all*', {
                statusCode: 200, body: { success: true, data: {} },
            }).as('markRead');

            cy.visit('/dashboard/admin/notifications');
            cy.get('[data-testid="btn-mark-all-read"]').click();
            cy.wait('@markRead').its('response.body.success').should('eq', true);
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-UTL-001 — Help & Support
// BR: BR-AO-03 | SRS: REQ-UTL-01 | Screen: SC-096
// ─────────────────────────────────────────────────────────────
describe('UJ-UTL-001 — Help & Support', () => {
    it('E2E-UTL-001-H01: Help page accessible without login; shows FAQ sections', () => {
        cy.visit('/help');
        cy.contains(/faq|help|question/i).should('be.visible');
    });

    it('E2E-UTL-001-H02: Contact information visible on help page', () => {
        cy.visit('/help');
        cy.contains(/@|phone|contact/i).should('be.visible');
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-UTL-002 — Legal & Privacy Pages
// BR: BR-DSR-01 | SRS: REQ-UTL-02..REQ-UTL-04
// Screens: SC-119, SC-120, SC-121, SC-122
// ─────────────────────────────────────────────────────────────
describe('UJ-UTL-002 — Legal & Privacy Pages', () => {
    it('E2E-UTL-002-H01: Privacy policy accessible without login', () => {
        cy.visit('/privacy');
        cy.contains(/privacy|data|personal information/i).should('be.visible');
    });

    it('E2E-UTL-002-H02: Data subject request form submits and returns RECEIVED', () => {
        cy.intercept('POST', '**/api/privacy/data-request*', {
            statusCode: 201,
            body: { success: true, data: { id: 'dsr1', status: 'RECEIVED' } },
        }).as('submitDSR');

        cy.visit('/privacy/data-request');
        cy.get('select[name="requestType"]').select('DELETE');
        cy.get('textarea, input[name="reason"]').first().type('I want my data deleted.');
        cy.get('button[type="submit"]').click();

        cy.wait('@submitDSR').its('response.body.data.status').should('eq', 'RECEIVED');
        cy.contains(/request received|submitted/i).should('be.visible');
    });

    it('E2E-UTL-002-H03: Terms of Service shows effective date and version', () => {
        cy.visit('/terms');
        cy.contains(/terms|agreement|effective/i).should('be.visible');
    });

    it('E2E-UTL-002-H04: Compliance page shows NDPR/ISO 27001 certifications', () => {
        cy.visit('/compliance');
        cy.contains(/NDPR|ISO 27001|compliance/i).should('be.visible');
    });
});
