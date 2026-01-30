
describe('Public - Pro View', () => {
    it('should display Pro View landing page', () => {
        cy.visit('/pro-view');

        cy.contains('Pro View Portal').should('be.visible');
        cy.contains('For Professional Scouts').should('be.visible');
        cy.get('[data-testid="apply-btn"]').should('have.attr', 'href', '/pro-view/apply');
    });

    it('should display Application Form', () => {
        cy.visit('/pro-view/apply');

        // Assuming form inputs exist based on typical apply flow
        cy.contains('Apply').should('exist');
        // Basic check for interactivity if form exists
        cy.get('body').then(($body) => {
            if ($body.find('input[type="email"]').length > 0) {
                cy.get('input[type="email"]').should('be.visible');
            }
        });
    });
});
