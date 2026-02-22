describe('Admin System Management', () => {
    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:5000/**', { statusCode: 200, body: { success: true, data: [] } });
        cy.intercept('POST', 'http://localhost:5000/**', { statusCode: 200, body: { success: true, data: {} } });
        cy.intercept('PUT', 'http://localhost:5000/**', { statusCode: 200, body: { success: true, data: {} } });
        cy.intercept('PATCH', 'http://localhost:5000/**', { statusCode: 200, body: { success: true, data: {} } });
        cy.intercept('DELETE', 'http://localhost:5000/**', { statusCode: 200, body: { success: true, data: {} } });

        cy.intercept('GET', '**/api/geolocation/country', { statusCode: 200, body: { country: 'NG', code: 'NG' } }).as('geo');
        cy.intercept('POST', '**/api/auth/refresh-token', { statusCode: 200, body: { accessToken: 'fake-jwt-token' } }).as('refreshToken');
        cy.intercept('GET', '**/api/analytics/dashboard*', { statusCode: 200, body: { success: true, data: { totalRevenue: 0, totalUsers: 10 } } }).as('analytics');

        cy.intercept('GET', '**/api/auth/me', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 1, email: 'admin@academy.com', userType: 'super_admin',
                    roles: ['admin'], firstName: 'Admin', lastName: 'User',
                    status: 'active', emailVerified: true
                }
            }
        }).as('me');

        // Users: useGet<User[]> -> expects data: [array]
        cy.intercept('GET', '**/api/users', {
            statusCode: 200,
            body: {
                success: true, data: [
                    { id: 1, name: 'Admin User', email: 'admin@academy.com', role: 'admin', status: 'active', createdAt: '2023-01-01T00:00:00Z' },
                    { id: 2, name: 'Editor User', email: 'editor@academy.com', role: 'editor', status: 'active', createdAt: '2023-02-01T00:00:00Z' }
                ]
            }
        }).as('getUsersList');

        // Audit logs: useGet<any> -> page usages response?.data -> expects data: { data: [array] }
        cy.intercept('GET', '**/api/system/audit*', {
            statusCode: 200,
            body: {
                success: true, data: {
                    data: [
                        { id: 1, action: 'CREATE', entityType: 'Player', entityId: '1', userId: 1, userName: 'Admin', timestamp: '2023-06-01T10:30:00Z', details: 'Created player Wayne Rooney', ipAddress: '127.0.0.1' }
                    ]
                }
            }
        }).as('getAuditLogs');

        // Health
        cy.intercept('GET', '**/api/system/health', {
            statusCode: 200,
            body: {
                success: true, data: {
                    status: 'healthy', uptime: 86400, components: [
                        { name: 'Database', status: 'healthy', responseTime: 5 },
                        { name: 'Redis', status: 'healthy', responseTime: 2 },
                        { name: 'Storage', status: 'healthy', responseTime: 10 }
                    ]
                }
            }
        }).as('getHealth');

        // Notifications: useGet<Notification[]> -> expects data: [array]
        cy.intercept('GET', '**/api/notifications', {
            statusCode: 200,
            body: {
                success: true, data: [
                    { id: 1, title: 'New Player Added', message: 'Wayne Rooney has been added.', read: false, createdAt: '2023-06-01T10:30:00Z' }
                ]
            }
        }).as('getNotifications');

        cy.session('admin-system-session', () => {
            window.localStorage.setItem('accessToken', 'fake-jwt-token');
        });

        cy.visit('/dashboard/admin', { failOnStatusCode: false });
        cy.viewport(1280, 800);
    });

    Cypress.on('uncaught:exception', () => false);

    // ==========================================
    // USER TESTS
    // ==========================================

    it('should navigate to users list page', () => {
        cy.visit('/dashboard/admin/users', { failOnStatusCode: false });
        cy.url().should('include', '/users');
        cy.get('[data-testid="btn-invite-user"]', { timeout: 15000 }).should('be.visible');
    });

    it('should navigate to invite user page', () => {
        cy.visit('/dashboard/admin/users/invite', { failOnStatusCode: false });
        cy.url().should('include', '/invite');
        cy.get('[data-testid="input-user-email"]', { timeout: 15000 }).should('be.visible');
    });

    // ==========================================
    // AUDIT TESTS
    // ==========================================

    it('should navigate to audit logs page', () => {
        cy.visit('/dashboard/admin/audit', { failOnStatusCode: false });
        cy.url().should('include', '/audit');
    });

    // ==========================================
    // HEALTH TESTS
    // ==========================================

    it('should navigate to health page', () => {
        cy.visit('/dashboard/admin/health', { failOnStatusCode: false });
        cy.url().should('include', '/health');
    });

    // ==========================================
    // NOTIFICATIONS TESTS
    // ==========================================

    it('should navigate to notifications page', () => {
        cy.visit('/dashboard/admin/notifications', { failOnStatusCode: false });
        cy.url().should('include', '/notifications');
    });
});
