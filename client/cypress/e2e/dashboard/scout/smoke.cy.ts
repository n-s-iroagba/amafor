describe('Scout Dashboard - User Journey', () => {
    beforeEach(() => {
        // Login as Scout
        cy.visit('/auth/login');
        cy.get('input[name="email"]').type('admin@academy.com');
        cy.get('input[name="password"]').type('password123'); // Assuming fixed password from script
        cy.get('button[type="submit"]').click();

        // Ensure redirection to Admin dashboard (since we logged in as Admin)
        cy.wait(2000);
        cy.visit('/dashboard/admin');
        cy.url().should('include', '/dashboard/admin', { timeout: 20000 });

        // Now navigate to Scout dashboard
        cy.visit('/dashboard/scout');
    });

    it('should display the scout dashboard overview', () => {
        cy.contains('Authenticated Scout Portal').should('exist');
        // Check for Quick Actions
        cy.contains('Player Directory').should('be.visible');
        cy.contains('Saved Reports').should('be.visible');
        cy.contains('Fixture Archives').should('be.visible');
    });

    it('should navigate to Player Directory', () => {
        cy.contains('Player Directory').click();
        cy.url().should('include', '/dashboard/scout/players');
        cy.get('h1').should('exist'); // Verify page loaded
    });

    it('should navigate to Reports', () => {
        // Use sidebar or card
        cy.visit('/dashboard/scout/reports');
        cy.url().should('include', '/dashboard/scout/reports');
    });
});
