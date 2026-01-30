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
        // Use a more specific selector or force/multiple if needed, but better to be specific.
        // Assuming the button has text "Add Patron" or "Plus" icon
        cy.contains('a', 'Add Patron').click();
        cy.url().should('include', '/dashboard/admin/patrons/new');
    });

    it('should create a new patron', () => {
        cy.visit('/dashboard/admin/patrons/new');

        cy.intercept('POST', '**/patrons', {
            statusCode: 201,
            body: { success: true }
        }).as('createPatron');

        cy.get('[data-testid="input-patron-name"]').type('John Doe');
        cy.get('[data-testid="input-patron-email"]').type('john@example.com');
        cy.get('[data-testid="btn-save-patron"]').click();

        cy.wait('@createPatron');
        cy.url().should('include', '/dashboard/admin/patrons');
    });

    it('should view and edit patron', () => {
        cy.intercept('GET', '**/patrons/1', {
            statusCode: 200,
            body: { success: true, data: { id: 1, name: 'John Doe', email: 'john@example.com' } }
        }).as('getPatron');

        cy.visit('/dashboard/admin/patrons/1');
        cy.wait('@getPatron');
        cy.contains('John Doe').should('be.visible');

        // Edit
        cy.get('[data-testid="btn-edit-patron"]').click();
        cy.url().should('include', '/edit');

        cy.intercept('PUT', '**/patrons/1', {
            statusCode: 200,
            body: { success: true }
        }).as('updatePatron');

        cy.get('[data-testid="input-patron-name"]').clear().type('Jane Doe');
        cy.get('[data-testid="btn-save-patron"]').click();
        cy.wait('@updatePatron');
    });
});
