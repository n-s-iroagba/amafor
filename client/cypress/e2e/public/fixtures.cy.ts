
describe('Fixtures Public Pages', () => {

    describe('Fixtures List', () => {
        beforeEach(() => {
            cy.visit('/fixtures');
        });

        it('should display fixtures list and filters', () => {
            cy.get('[data-testid="search-fixtures"]').should('be.visible');
            cy.get('[data-testid="status-filter"]').should('be.visible');
            cy.get('[data-testid="league-filter"]').should('be.visible');
            cy.get('[data-testid="date-filter"]').should('be.visible');

            // List items might be empty if no data, but check for container or empty state
            cy.get('body').then(($body) => {
                if ($body.find('[data-testid="fixture-item"]').length > 0) {
                    cy.get('[data-testid="fixture-item"]').should('be.visible');
                } else {
                    cy.contains('No fixtures found').should('be.visible');
                }
            });
        });

        it('should navigate to fixture details', () => {
            cy.get('body').then(($body) => {
                if ($body.find('[data-testid="fixture-item"]').length > 0) {
                    cy.get('[data-testid="fixture-item"]').first().click();
                    cy.url().should('include', '/fixtures/');
                }
            });
        });
    });

    describe('Fixture Details', () => {
        it('should display fixture details', () => {
            // Navigate from list to ensure valid ID
            cy.visit('/fixtures');
            cy.get('body').then(($body) => {
                if ($body.find('[data-testid="fixture-item"]').length > 0) {
                    cy.get('[data-testid="fixture-item"]').first().click();

                    cy.get('[data-testid="back-button"]').should('be.visible');
                    // Tabs should be visible (we added testIds implicitly by checking text content usually, or add specifics)
                    cy.contains('Overview').should('be.visible');
                    cy.contains('Lineups').should('be.visible');
                    cy.contains('Statistics').should('be.visible');
                }
            });
        });
    });
});
