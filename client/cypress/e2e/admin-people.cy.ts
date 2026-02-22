describe('Admin People Management', () => {
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

        // Players list: useGet<Player[]> → data used directly → needs array at `data` level
        cy.intercept('GET', '**/api/players', {
            statusCode: 200,
            body: {
                success: true, data: [
                    { id: 1, name: 'Wayne Rooney', position: 'Striker', jerseyNumber: 10, imageUrl: '', createdAt: '2023-01-01T00:00:00Z' },
                    { id: 2, name: 'Paul Scholes', position: 'Midfielder', jerseyNumber: 18, imageUrl: '', createdAt: '2023-02-01T00:00:00Z' }
                ]
            }
        }).as('getPlayersList');
        cy.intercept('POST', '**/api/players', { statusCode: 201, body: { success: true, data: { id: 3 } } }).as('createPlayer');

        // Coaches list: useGet → data?.data || [] → needs nested data wrapper
        cy.intercept('GET', '**/api/academy-staff', {
            statusCode: 200,
            body: {
                success: true, data: {
                    data: [
                        { id: 1, name: 'Coach Carter', role: 'Head Coach', initials: 'CC', category: 'coaching', yearsOfExperience: 15, bio: 'UEFA A Licensed coach.', qualifications: ['UEFA A License'], imageUrl: '', createdAt: '2023-01-01T00:00:00Z' }
                    ]
                }
            }
        }).as('getCoachesList');
        cy.intercept('POST', '**/api/academy-staff', { statusCode: 201, body: { success: true, data: { id: 3 } } }).as('createCoach');

        // Patrons list: useGet<{ data: Patron[] }> → data?.data → needs nested data wrapper
        cy.intercept('GET', '**/api/patrons', {
            statusCode: 200,
            body: {
                success: true, data: {
                    data: [
                        { id: 1, name: 'Sir Alex', position: 'Chairman', bio: 'Club legend.', imageUrl: '', createdAt: '2023-01-01T00:00:00Z' },
                        { id: 2, name: 'Bobby Charlton', position: 'President', bio: 'All-time great.', imageUrl: '', createdAt: '2023-02-01T00:00:00Z' }
                    ]
                }
            }
        }).as('getPatronsList');

        cy.intercept('POST', '**/upload*', { statusCode: 200, body: { success: true, data: { url: 'https://placehold.co/200' } } }).as('upload');

        cy.session('admin-people-session', () => {
            window.localStorage.setItem('accessToken', 'fake-jwt-token');
        });

        cy.visit('/dashboard/admin', { failOnStatusCode: false });
        cy.viewport(1280, 800);
    });

    Cypress.on('uncaught:exception', () => false);

    // ==========================================
    // PLAYER TESTS
    // ==========================================

    it('should navigate to players list page', () => {
        cy.visit('/dashboard/admin/players', { failOnStatusCode: false });
        cy.url().should('include', '/players');
        cy.get('[data-testid="btn-add-player"]', { timeout: 15000 }).should('be.visible');
    });

    it('should create a new player', () => {
        cy.visit('/dashboard/admin/players/new', { failOnStatusCode: false });
        cy.get('[data-testid="input-player-name"]', { timeout: 15000 }).type('Marcus Rashford');
        cy.get('[data-testid="select-player-position"]').select('Forward');
        cy.get('[data-testid="input-player-jersey"]').type('10');
        cy.get('[data-testid="btn-save-player"]').click();
        cy.wait('@createPlayer', { timeout: 10000 });
    });

    // ==========================================
    // COACH TESTS
    // ==========================================

    it('should navigate to coaches list page', () => {
        cy.visit('/dashboard/admin/coaches', { failOnStatusCode: false });
        cy.url().should('include', '/coaches');
        cy.get('[data-testid="btn-add-coach"]', { timeout: 15000 }).should('be.visible');
    });

    it('should navigate to create coach page', () => {
        cy.visit('/dashboard/admin/coaches/new', { failOnStatusCode: false });
        cy.url().should('include', '/coaches/new');
        cy.get('[data-testid="input-coach-name"]', { timeout: 15000 }).should('be.visible');
        cy.get('[data-testid="input-coach-role"]').should('be.visible');
        cy.get('[data-testid="textarea-coach-bio"]').should('be.visible');
    });

    // ==========================================
    // PATRON TESTS
    // ==========================================

    it('should navigate to patrons list page', () => {
        cy.visit('/dashboard/admin/patrons', { failOnStatusCode: false });
        cy.url().should('include', '/patrons');
    });
});
