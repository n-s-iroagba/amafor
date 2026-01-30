
describe('Public - Not Found', () => {
    it('should display custom 404 page for invalid routes', () => {
        cy.visit('/invalid-route-xyz', { failOnStatusCode: false });

        cy.contains('404').should('be.visible');
        cy.contains('PAGE OUT OF PLAY').should('be.visible');
        cy.contains('RETURN TO HOMEPAGE').should('be.visible');
    });
});
