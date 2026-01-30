
describe('CMS Dashboard - Analytics', () => {
    beforeEach(() => {
        // Mock Auth
        cy.setCookie('token', 'mock-token');
        cy.intercept('GET', '**/auth/me', {
            statusCode: 200,
            body: {
                user: {
                    id: 'cms_1',
                    email: 'editor@example.com',
                    role: 'cms_editor',
                    name: 'Test Editor'
                }
            }
        }).as('getMe');
    });

    it('should display analytics dashboard', () => {
        // Mock Analytics Data
        cy.intercept('GET', '**/articles/analytics*', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    totalViews: 1000,
                    uniqueVisitors: 500,
                    averageTimeOnPage: 5,
                    bounceRate: 40,
                    topArticles: [
                        { id: 1, title: 'Top Story', views: 500 },
                        { id: 2, title: 'Another Story', views: 300 }
                    ],
                    viewsByDay: []
                }
            }
        }).as('getAnalytics');

        cy.visit('/dashboard/cms/analytics');
        cy.wait('@getAnalytics');

        cy.contains('EDITORIAL ANALYTICS').should('be.visible');
        cy.contains('Top Story').should('be.visible');
        cy.contains('500').should('be.visible'); // Views count

        // Export button exist
        cy.get('[data-testid="btn-export-analytics"]').should('be.visible');
    });
});
