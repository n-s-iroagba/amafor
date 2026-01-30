describe('Admin Dashboard - Advertisers', () => {
    beforeEach(() => {
        cy.visit('/auth/login');
        cy.get('input[name="email"]').type('admin@academy.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        // Ensure dashboard
        cy.url().should('include', '/dashboard/admin', { timeout: 10000 });

        // Navigate
        cy.visit('/dashboard/admin/advertisers');
    });

    it('should display advertisers page', () => {
        cy.get('h1').should('contain', 'Advertisers');
        // Check for key elements like tabs or tables
        cy.get('body').then(($body) => {
            if ($body.find('table').length > 0) {
                cy.get('table').should('be.visible');
            } else {
                cy.contains('No advertisers').should('exist');
            }
        });
    });

    it('should view advertiser details', () => {
        cy.intercept('GET', '**/ads/advertisers/adv_1', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 'adv_1',
                    brandName: 'Test Brand',
                    email: 'brand@test.com'
                }
            }
        }).as('getAdvertiserDetail');

        cy.visit('/dashboard/admin/advertisers/adv_1');
        cy.wait('@getAdvertiserDetail');

        cy.contains('Test Brand').should('be.visible');
        cy.contains('brand@test.com').should('be.visible');
    });
});
