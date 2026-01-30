describe('Admin Dashboard - RSS Feeds', () => {
    beforeEach(() => {
        // Mock Auth
        cy.setCookie('token', 'mock-token');
        cy.intercept('GET', '**/api/auth/me', {
            statusCode: 200,
            body: {
                user: {
                    id: 'admin_1',
                    email: 'admin@example.com',
                    role: 'admin',
                    name: 'Admin User'
                }
            }
        }).as('getMe');
    });

    it('should list feeds and allow filtering', () => {
        // Mock Feeds List
        cy.intercept('GET', '**/feeds*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    { id: 1, name: 'BBC Sport', url: 'https://bbc.com/sport', category: 'News', status: 'Active' },
                    { id: 2, name: 'Sky Sports', url: 'https://skysports.com', category: 'News', status: 'Active' }
                ]
            }
        }).as('getFeeds');

        cy.visit('/dashboard/admin/rss-feeds');
        cy.wait('@getFeeds');

        cy.get('[data-testid="feed-item"]').should('have.length', 2);

        // Filter
        cy.get('[data-testid="input-search-feeds"]').type('BBC');
        cy.get('[data-testid="feed-item"]').should('have.length', 1);
        cy.contains('BBC Sport').should('be.visible');
    });

    it('should create a new feed', () => {
        cy.intercept('GET', '**/feeds*', {
            statusCode: 200,
            body: { success: true, data: [] }
        }).as('getFeedsEmpty');

        cy.visit('/dashboard/admin/rss-feeds');
        cy.wait('@getFeedsEmpty');

        cy.get('[data-testid="btn-add-feed"]').click();
        cy.url().should('include', '/rss-feeds/new');

        // Mock Create
        cy.intercept('POST', '**/feeds', {
            statusCode: 201,
            body: {
                success: true,
                data: { id: 3, name: 'New Feed', url: 'http://example.com' }
            }
        }).as('createFeed');

        cy.get('[data-testid="input-feed-name"]').type('New Feed');
        cy.get('[data-testid="input-feed-url"]').type('http://example.com/rss');
        cy.get('[data-testid="btn-save-feed"]').click();

        cy.wait('@createFeed');
        cy.url().should('include', '/dashboard/admin/rss-feeds');
        cy.url().should('include', '/dashboard/admin/rss-feeds');
    });

    it('should view and edit feed', () => {
        cy.intercept('GET', '**/feeds/1', {
            statusCode: 200,
            body: { success: true, data: { id: 1, name: 'BBC Sport' } }
        }).as('getFeed');

        cy.visit('/dashboard/admin/rss-feeds/1'); // View
        // cy.wait('@getFeed'); // Dependent on View implementation

        // Testing Edit directly as View might be simple or redirect
        cy.visit('/dashboard/admin/rss-feeds/1/edit');
        cy.wait('@getFeed');

        cy.intercept('PUT', '**/feeds/1', { statusCode: 200, body: { success: true } }).as('updateFeed');
        cy.get('[data-testid="input-feed-name"]').clear().type('BBC Updated');
        cy.get('[data-testid="btn-save-feed"]').click();
        cy.wait('@updateFeed');
    });
});
