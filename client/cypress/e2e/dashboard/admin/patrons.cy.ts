describe('Admin Dashboard - Patron Management', () => {
    beforeEach(() => {
        // Login as Admin
        cy.visit('/auth/login');
        cy.get('input[name="email"]').type('admin@academy.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        // Navigate to Patrons
        cy.visit('/dashboard/admin/patrons');
    });

    it('should display the patrons page', () => {
        cy.get('h1').contains('Patrons').should('be.visible');
        // Check for add button
        cy.get('a[href="/dashboard/admin/patrons/new"]').should('exist');
    });

    it('should filter patrons by search term', () => {
        // Type a search term that shouldn't exist
        const uniqueTerm = 'NonExistentPatronXYZ';
        cy.get('input[placeholder*="Search patrons"]').type(uniqueTerm);

        // Should show empty state
        cy.contains('No matching patrons found').should('be.visible');

        // Clear search
        cy.get('input[placeholder*="Search patrons"]').clear();
    });

    it('should navigate to add patron page', () => {
        cy.get('a[href="/dashboard/admin/patrons/new"]').click();
        cy.url().should('include', '/dashboard/admin/patrons/new');
    });
});
