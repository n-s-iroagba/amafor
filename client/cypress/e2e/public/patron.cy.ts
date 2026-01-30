
describe('Public - Patron', () => {
    it('should list patron packages and allow selection', () => {
        // Mock Packages
        cy.intercept('GET', '**/patrons/packages', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 'pkg_1',
                        tier: 'PATRON',
                        miniumumAmount: 5000,
                        frequency: 'MONTHLY',
                        benefits: ['Badge', 'Voting Rights']
                    },
                    {
                        id: 'pkg_2',
                        tier: 'SUPPORTER',
                        miniumumAmount: 1000,
                        frequency: 'MONTHLY',
                        benefits: ['Badge']
                    }
                ]
            }
        }).as('getPackages');

        cy.visit('/patron');
        cy.wait('@getPackages');

        cy.contains('Official Patron Program').should('be.visible');
        cy.contains('PATRON').should('be.visible');
        cy.contains('SUPPORTER').should('be.visible');
        cy.contains('₦5,000').should('be.visible');

        // Test Navigation to checkout
        cy.get('[data-testid="select-tier-btn"]').first().click();
        cy.url().should('include', '/patron/checkout');
    });

    it('should complete checkout form', () => {
        // Mock Packages
        cy.intercept('GET', '**/api/patrons/packages', {
            statusCode: 200,
            body: [
                { id: 1, tier: 'PATRON', miniumumAmount: 5000, frequency: 'monthly', benefits: ['Badge'] }
            ]
        }).as('getPackages');

        cy.visit('/patron/checkout');
        cy.wait('@getPackages');

        // Toggle Type
        cy.get('[data-testid="type-toggle-donation"]').click();
        cy.get('[data-testid="custom-amount-input"]').type('2000');

        // Toggle back to Subscription
        cy.get('[data-testid="type-toggle-subscription"]').click();
        cy.get('[data-testid="tier-selection-btn"]').first().click();

        // Fill Details
        cy.get('[data-testid="checkout-name"]').type('Donor Doe');
        cy.get('[data-testid="checkout-email"]').type('donor@example.com');
        cy.get('[data-testid="checkout-phone"]').type('08012345678');

        // Paystack button should be active (dynamic component check)
        // Since it's dynamic, we just check for its existence/container
        cy.get('button').contains('Pay').should('exist');
    });

    it('should display supporter wall', () => {
        cy.intercept('GET', '**/api/patrons', {
            statusCode: 200,
            body: [
                { name: 'John Doe', createdAt: new Date().toISOString(), subscription: { tier: 'Patron' } }
            ]
        }).as('getSupporters');

        cy.visit('/patron/wall');
        cy.wait('@getSupporters');

        cy.contains('Supporter Wall').should('be.visible');
        cy.get('[data-testid="supporter-card"]').should('have.length', 1);
        cy.contains('John Doe').should('be.visible');
    });
});
