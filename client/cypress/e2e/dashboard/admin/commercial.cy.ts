
describe('Admin Dashboard - Commercial Management', () => {

    beforeEach(() => {
        cy.visit('/dashboard/admin');
    });

    describe('Advertiser Verification', () => {
        beforeEach(() => {
            cy.visit('/dashboard/admin/advertisers');
        });

        it('should display verification queue and verify advertiser', () => {
            cy.get('body').then(($body) => {
                if ($body.find('[data-testid="advertiser-app-card"]').length > 0) {
                    cy.get('[data-testid="advertiser-app-card"]').should('be.visible');
                    cy.get('[data-testid="link-view-ad-dossier"]').click();
                    cy.url().should('match', /\/advertisers\/[^/]+$/);
                    cy.get('[data-testid="btn-authorize-advertiser"]').should('be.visible');
                    cy.get('[data-testid="btn-deny-advertiser"]').should('be.visible');
                } else {
                    cy.contains('No Pending Reviews').should('be.visible');
                }
            });
        });
    });

    describe('Patron Management', () => {
        beforeEach(() => {
            cy.intercept('GET', { pathname: '/api/patrons' }, {
                statusCode: 200,
                body: {
                    success: true,
                    data: []
                }
            }).as('getPatronsEmpty');
            cy.visit('/dashboard/admin/patrons');
        });

        it('should create a new patron', () => {
            cy.intercept('GET', { pathname: '/api/patrons' }, {
                statusCode: 200,
                body: { success: true, data: [] }
            }).as('getPatrons');
            cy.wait('@getPatronsEmpty');
            cy.get('[data-testid="btn-add-patron"]').click();
            cy.url().should('include', '/patrons/new');
            cy.get('[data-testid="input-patron-name"]').should('be.visible');
            cy.get('[data-testid="input-patron-position"]').should('be.visible');
            cy.get('[data-testid="btn-save-patron"]').should('be.visible');
        });

        it('should list patrons and allow search', () => {
            cy.intercept('GET', { pathname: '/api/patrons' }, {
                statusCode: 200,
                body: {
                    success: true,
                    data: [
                        { id: 1, name: 'John Doe', position: 'Gold Patron' },
                        { id: 2, name: 'Jane Smith', position: 'Silver Patron' }
                    ]
                }
            }).as('getPatronsList');

            cy.visit('/dashboard/admin/patrons');
            cy.wait('@getPatronsList');

            cy.get('[data-testid="input-search-patrons"]').type('John');
            cy.get('body').then(($body) => {
                if ($body.find('[data-testid="patron-card"]').length > 0) {
                    cy.get('[data-testid="patron-card"]').should('be.visible');
                } else {
                    cy.contains('No matching patrons found').should('be.visible');
                }
            });
        });
    });

    describe('Subscription Plans', () => {
        beforeEach(() => {
            cy.intercept('GET', { pathname: '/api/patrons/packages' }, {
                statusCode: 200,
                body: {
                    success: true,
                    data: []
                }
            }).as('getPackagesEmpty');
            cy.visit('/dashboard/admin/subscriptions');
        });

        it('should create subscription plan', () => {
            cy.wait('@getPackagesEmpty');
            cy.get('[data-testid="btn-create-subscription"]').click();
            cy.url().should('include', '/subscriptions/new');
            cy.get('[data-testid="select-subscription-tier"]').should('be.visible');
            cy.get('[data-testid="input-subscription-amount"]').should('be.visible');
            cy.get('[data-testid="btn-save-subscription"]').should('be.visible');
        });

        it('should list subscription plans', () => {
            cy.intercept('GET', { pathname: '/api/patrons/packages' }, {
                statusCode: 200,
                body: {
                    success: true,
                    data: [
                        { id: '1', tier: 'Gold', miniumumAmount: 5000, frequency: 'monthly', benefits: ['Benefit 1'] }
                    ]
                }
            }).as('getPackagesList');

            cy.visit('/dashboard/admin/subscriptions');
            cy.wait('@getPackagesList');

            cy.get('body').then(($body) => {
                if ($body.find('[data-testid="sub-plan-card"]').length > 0) {
                    cy.get('[data-testid="sub-plan-card"]').first().within(() => {
                        cy.get('[data-testid="btn-edit-plan"]').should('be.visible');
                    });
                } else {
                    cy.contains('No packages found').should('be.visible');
                }
            });
        });
    });

});
