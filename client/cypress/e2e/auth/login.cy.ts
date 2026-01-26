describe('Authentication - Login', () => {
    beforeEach(() => {
        cy.visit('/auth/login');
    });

    it('should display the login form', () => {
        cy.get('form').should('be.visible');
        cy.get('input[type="email"]').should('be.visible');
        cy.get('input[type="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('exist'); // Button text might vary
    });

    it('should have disabled submit button initially', () => {
        cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should show validation error on invalid email', () => {
        cy.get('input[name="email"]').type('invalid-email');
        cy.get('input[name="password"]').type('password123'); // Enable button
        cy.get('button[type="submit"]').should('not.be.disabled').click();

        // Check for specific error message from source code
        cy.contains('Please enter a valid email address').should('be.visible');
    });


});
