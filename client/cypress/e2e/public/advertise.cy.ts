
describe('Advertise Pages', () => {

    describe('Info Page', () => {
        beforeEach(() => {
            cy.visit('/advertise');
        });

        it('should display the main page content', () => {
            cy.contains('Advertise with Amafor Gladiators FC').should('be.visible');
            cy.get('[data-testid="hero-register-btn"]').should('be.visible');
            cy.get('[data-testid="cta-register-btn"]').should('be.visible');
        });

        it('should navigate to registration page from hero button', () => {
            cy.get('[data-testid="hero-register-btn"]').click();
            cy.url().should('include', '/advertise/register');
        });

        it('should display ad zones', () => {
            // Checking for at least one zone if dynamic, or specific if static
            // The implementation maps over adZones.
            // I added data-testid={`ad-zone-${zone.id}`}
            // Let's assume there's at least one zone
            cy.get('[data-testid^="ad-zone-"]').should('have.length.greaterThan', 0);
        });
    });

    describe('Registration Page', () => {
        beforeEach(() => {
            cy.visit('/advertise/register');
        });

        it('should submit a valid advertiser registration', () => {
            const timestamp = Date.now();

            cy.get('[data-testid="business-name-input"]').type('Test Business Inc.');
            cy.get('[data-testid="business-email-input"]').type(`advertiser.${timestamp}@example.com`);
            cy.get('[data-testid="business-phone-input"]').type('08012345678');

            cy.get('[data-testid="submit-registration"]').click();

            cy.get('[data-testid="success-message"]').should('be.visible').and('contain', 'Application Received');
        });

        it('should have validation (button disabled)', () => {
            cy.get('[data-testid="submit-registration"]').should('be.disabled');

            cy.get('[data-testid="business-name-input"]').type('Incomplete Business');
            cy.get('[data-testid="submit-registration"]').should('be.disabled');
        });
    });

});
