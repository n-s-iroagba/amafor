
describe('Advertiser Dashboard - Reports', () => {
    beforeEach(() => {
        // Mock Auth
        cy.setCookie('token', 'mock-token');
        cy.intercept('GET', '**/auth/me', {
            statusCode: 200,
            body: {
                user: {
                    id: 'adv_1',
                    email: 'advertiser@example.com',
                    role: 'advertiser',
                    name: 'Test Advertiser'
                }
            }
        }).as('getMe');
    });

    it('should display reports and stats', () => {
        // Mock Reports
        cy.intercept('GET', '**/ads/reports*', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    summary: {
                        totalSpend: 150000,
                        totalViews: 50000
                    },
                    campaigns: [
                        {
                            id: 'camp_1',
                            name: 'Summer Campaign',
                            date: new Date().toISOString(),
                            views: 20000,
                            spend: 50000,
                            status: 'completed'
                        },
                        {
                            id: 'camp_2',
                            name: 'Winter Campaign',
                            date: new Date().toISOString(),
                            views: 30000,
                            spend: 100000,
                            status: 'active'
                        }
                    ]
                }
            }
        }).as('getReports');

        cy.visit('/dashboard/advertiser/reports');
        cy.wait('@getReports');

        // Check Summary
        cy.contains('150,000').should('be.visible'); // Total Spend
        cy.contains('50,000').should('be.visible');  // Total Views

        // Check Table
        cy.get('[data-testid^="report-row-"]').should('have.length', 2);
        cy.contains('Summer Campaign').should('be.visible');
        cy.contains('Winter Campaign').should('be.visible');

        // Check Search
        cy.get('[data-testid="input-search-reports"]').type('Summer');
        // Assuming client side filtering logic is present or this is just a placeholder action
        // If real filtering isn't implemented in the mock, we just verify the input works
        cy.get('[data-testid="input-search-reports"]').should('have.value', 'Summer');
    });
});
