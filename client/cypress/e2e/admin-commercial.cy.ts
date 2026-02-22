describe('Admin Commercial Management', () => {
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

        // Pending advertisers: useGet<Advertiser[]> -> expects data: [array]
        cy.intercept('GET', '**/api/users/pending-advertisers*', {
            statusCode: 200,
            body: {
                success: true, data: [
                    { id: 1, name: 'Acme Corp', email: 'acme@example.com', companyName: 'Acme Corporation', website: 'https://acme.com', status: 'pending', createdAt: '2023-01-01T00:00:00Z' }
                ]
            }
        }).as('getPendingAdvertisers');

        // Scout applications: page calls /api/users and filters client-side
        // useGet<User[]> -> expects data: [array]
        cy.intercept('GET', '**/api/users*', {
            statusCode: 200,
            body: {
                success: true, data: [
                    { id: 1, name: 'Scout McScoutface', email: 'scout@example.com', role: 'Scout', status: 'pending', experience: '5 years', region: 'London', createdAt: '2023-03-01T00:00:00Z' }
                ]
            }
        }).as('getUsersForScouts');

        cy.session('admin-commercial-session', () => {
            window.localStorage.setItem('accessToken', 'fake-jwt-token');
        });

        cy.visit('/dashboard/admin', { failOnStatusCode: false });
        cy.viewport(1280, 800);
    });

    Cypress.on('uncaught:exception', () => false);

    // ==========================================
    // ADVERTISER TESTS
    // ==========================================

    it('should navigate to advertisers page', () => {
        cy.visit('/dashboard/admin/advertisers', { failOnStatusCode: false });
        cy.url().should('include', '/advertisers');
    });

    // ==========================================
    // SCOUT TESTS
    // ==========================================

    it('should navigate to scout applications page', () => {
        cy.visit('/dashboard/admin/scouts', { failOnStatusCode: false });
        cy.url().should('include', '/scouts');
    });
});
