describe('Admin Competition Management', () => {
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

        // Leagues: useGet<League[]> → data used directly → needs array at `data` level
        cy.intercept('GET', '**/api/leagues', {
            statusCode: 200,
            body: {
                success: true, data: [
                    { id: 1, name: 'Premier League', season: '2023/2024', friendly: false, createdAt: '2023-01-01T00:00:00Z' },
                    { id: 2, name: 'Champions League', season: '2023/2024', friendly: false, createdAt: '2023-02-01T00:00:00Z' }
                ]
            }
        }).as('getLeaguesList');
        cy.intercept('POST', '**/api/leagues', { statusCode: 201, body: { success: true, data: { id: 3 } } }).as('createLeague');

        cy.session('admin-competition-session', () => {
            window.localStorage.setItem('accessToken', 'fake-jwt-token');
        });

        cy.visit('/dashboard/admin', { failOnStatusCode: false });
        cy.viewport(1280, 800);
    });

    Cypress.on('uncaught:exception', () => false);

    // ==========================================
    // LEAGUE TESTS
    // ==========================================

    it('should navigate to leagues list page', () => {
        cy.visit('/dashboard/admin/leagues', { failOnStatusCode: false });
        cy.url().should('include', '/leagues');
        cy.contains('Premier League', { timeout: 15000 }).should('be.visible');
    });

    it('should create a new league', () => {
        cy.visit('/dashboard/admin/leagues/new', { failOnStatusCode: false });
        cy.get('[data-testid="input-league-name"]', { timeout: 15000 }).type('FA Cup');
        cy.get('[data-testid="input-league-season"]').type('2024/2025');
        cy.get('[data-testid="btn-save-league"]').click();
        cy.wait('@createLeague', { timeout: 10000 });
    });

    // ==========================================
    // FIXTURE TESTS
    // ==========================================

    it('should view fixtures for a league', () => {
        cy.visit('/dashboard/admin/leagues/1/fixtures', { failOnStatusCode: false });
        cy.url().should('include', '/fixtures');
    });
});
