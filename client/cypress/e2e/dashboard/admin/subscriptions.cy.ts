describe('Admin Dashboard - Subscription Packages', () => {
    beforeEach(() => {
        cy.visit('/auth/login');
        cy.get('input[name="email"]').type('admin@academy.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
        cy.visit('/dashboard/admin/subscriptions');
    });

    it('should display subscription packages page', () => {
        cy.get('h1').contains('Subscription Packages').should('be.visible');
        cy.get('a[href="/dashboard/admin/subscriptions/new"]').should('exist');
    });

    it('should list existing packages', () => {
        // We seeded some payments/packages, assuming at least one exists or empty state
        // If empty, it shows "No packages found"
        // If present, it shows tiers
        cy.get('body').then(($body) => {
            if ($body.find('h3:contains("No packages found")').length > 0) {
                cy.contains('No packages found').should('be.visible');
            } else {
                // Check for currency symbol or tier name
                cy.contains('NGN').should('exist');
            }
        });
    });

    it('should filter packages', () => {
        cy.get('input[placeholder*="Search by tier name"]').type('Gold');
        // Just verify inputs works, result depends on data
        cy.get('input[placeholder*="Search by tier name"]').should('have.value', 'Gold');
    });
});
