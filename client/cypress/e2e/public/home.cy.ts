describe('Public Home Page', () => {
    beforeEach(() => {
        // Visit the home page before each test
        cy.visit('/');
    });

    it('should return 200 OK from server', () => {
        cy.request('/').its('status').should('eq', 200);
    });

    it('should load the home page successfully', () => {
        cy.url().should('include', '/');
        // Check for the header which is known to exist
        cy.get('header').should('be.visible');
        // Check for the footer
        cy.get('footer').should('exist');
    });

    it('should display the navigation header', () => {
        cy.get('header').should('be.visible');
    });
});
