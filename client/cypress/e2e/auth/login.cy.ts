describe('Authentication - Login', () => {
    beforeEach(() => {
        cy.visit('/auth/login');
    });

    it('should display the login form', () => {
        cy.get('form').should('be.visible');
        cy.get('[data-testid="email-input"]').should('be.visible');
        cy.get('[data-testid="password-input"]').should('be.visible');
        cy.get('[data-testid="login-btn"]').should('exist');
    });

    it('should have disabled submit button initially', () => {
        cy.get('[data-testid="login-btn"]').should('be.disabled');
    });

    it('should show validation error on invalid email', () => {
        cy.get('[data-testid="email-input"]').type('invalid-email');
        cy.get('[data-testid="password-input"]').type('password123'); // Enable button
        cy.get('[data-testid="login-btn"]').should('not.be.disabled').click();

        // Check for specific error message from source code
        cy.contains('Please enter a valid email address').should('be.visible');
    });


});
