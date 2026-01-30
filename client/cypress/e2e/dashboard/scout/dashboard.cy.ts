
describe('Scout Dashboard - Overview', () => {
    beforeEach(() => {
        // Mock Auth
        cy.setCookie('token', 'mock-token');
        cy.intercept('GET', '**/auth/me', {
            statusCode: 200,
            body: {
                user: {
                    id: 'scout_1',
                    email: 'scout@example.com',
                    role: 'scout',
                    name: 'Test Scout',
                    isApproved: true
                }
            }
        }).as('getMe');
    });

    it('should display dashboard with recent views and quick links', () => {
        // Mock Recent Views
        cy.intercept('GET', '**/scout/recent-views', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 'player_1',
                        name: 'Star Player',
                        position: 'Forward',
                        age: 20,
                        imageUrl: 'http://example.com/p1.jpg'
                    }
                ]
            }
        }).as('getRecentViews');

        cy.visit('/dashboard/scout');
        cy.wait('@getRecentViews');

        // Check Welcome Message
        cy.contains('Welcome, Test Scout').should('be.visible');

        // Check Quick Links
        cy.get('[data-testid="link-quick-players"]').should('be.visible');
        cy.get('[data-testid="link-quick-reports"]').should('be.visible');
        cy.get('[data-testid="link-quick-matches"]').should('be.visible');

        // Check Recent Views
        cy.contains('Recently Viewed').should('be.visible');
        cy.get('[data-testid="recent-view-item-player_1"]').should('be.visible');
        cy.contains('Star Player').should('be.visible');
    });

    it('should show pending approval message if not approved', () => {
        // Mock Unapproved User
        cy.intercept('GET', '**/auth/me', {
            statusCode: 200,
            body: {
                user: {
                    id: 'scout_pending',
                    email: 'pending@example.com',
                    role: 'scout',
                    name: 'Pending Scout',
                    isApproved: false
                }
            }
        }).as('getMePending');

        cy.visit('/dashboard/scout');
        // No recent views call expected or handled safely

        cy.contains('Account Pending Verification').should('be.visible');
        cy.get('[data-testid="link-quick-players"]').should('not.exist');
    });
});
