
describe('Public Static Pages', () => {

    it('should display the Compliance page', () => {
        cy.visit('/compliance');
        cy.get('h1').should('exist'); // Assuming there's a header
        cy.get('main').should('be.visible');
        cy.contains('Compliance').should('be.visible');
    });

    it('should display the Help page', () => {
        cy.visit('/help');
        cy.get('h1').should('exist');
        cy.get('main').should('be.visible');
        cy.contains('Help').should('be.visible');
    });

    it('should display the Privacy Policy page', () => {
        cy.visit('/privacy');
        cy.get('h1').should('exist');
        cy.contains('Privacy').should('be.visible');
    });

    it('should display the Terms of Service page', () => {
        cy.visit('/terms');
        cy.get('h1').should('exist');
        cy.contains('Terms').should('be.visible');
    });

    describe('Privacy Data Request', () => {
        it('should allow users to access the data request page', () => {
            cy.visit('/privacy/data-request');
            cy.get('h1').should('exist');
            cy.contains('Data Request').should('be.visible');
            // Check for a form if expected
            cy.get('form').should('exist');
        });
    });
});
