
describe('Admin Dashboard - Subscription Packages', () => {
    beforeEach(() => {
        // Mock Auth
        cy.setCookie('token', 'mock-token');
        cy.intercept('GET', '**/api/auth/me', {
            statusCode: 200,
            body: {
                user: {
                    id: 'admin_1',
                    email: 'admin@example.com',
                    role: 'admin',
                    name: 'Admin User'
                }
            }
        }).as('getMe');
    });

    it('should list packages and allow search', () => {
        // Mock Packages List
        cy.intercept('GET', '**/patrons/packages*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 'pkg_1',
                        tier: 'SUPPORTER',
                        frequency: 'MONTHLY',
                        miniumumAmount: 5000,
                        benefits: ['Access to news', 'Badge'],
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 'pkg_2',
                        tier: 'VIP',
                        frequency: 'YEARLY',
                        miniumumAmount: 50000,
                        benefits: ['All Access', 'Merch'],
                        createdAt: new Date().toISOString()
                    }
                ]
            }
        }).as('getPackages');

        cy.visit('/dashboard/admin/subscriptions');
        cy.wait('@getPackages');

        cy.get('[data-testid="sub-plan-card"]').should('have.length', 2);
        cy.contains('SUPPORTER').should('be.visible');
        cy.contains('VIP').should('be.visible');

        // Search
        cy.get('[data-testid="input-search-package"]').type('VIP');
        cy.get('[data-testid="sub-plan-card"]').should('have.length', 1);
        cy.contains('VIP').should('be.visible');
        cy.contains('SUPPORTER').should('not.exist');
    });

    it('should create a new package', () => {
        cy.intercept('GET', '**/patrons/packages*', {
            statusCode: 200,
            body: { success: true, data: [] }
        }).as('getPackagesEmpty');

        cy.visit('/dashboard/admin/subscriptions');
        cy.wait('@getPackagesEmpty');

        cy.get('[data-testid="btn-create-subscription"]').click();
        cy.url().should('include', '/subscriptions/new');

        // Mock Create
        cy.intercept('POST', '**/patrons/packages', {
            statusCode: 201,
            body: {
                success: true,
                data: {
                    id: 'pkg_new',
                    tier: 'PATRON',
                    frequency: 'MONTHLY',
                    miniumumAmount: 10000
                }
            }
        }).as('createPackage');

        cy.get('[data-testid="select-subscription-tier"]').select('PATRON');
        cy.get('[data-testid="select-subscription-frequency"]').select('MONTHLY');
        cy.get('[data-testid="input-subscription-amount"]').type('10000');

        // Benefits
        cy.get('[data-testid="input-benefit-0"]').type('New Benefit 1');
        cy.get('[data-testid="btn-add-benefit"]').click();
        cy.get('[data-testid="input-benefit-1"]').type('New Benefit 2');

        cy.get('[data-testid="btn-save-subscription"]').click();

        cy.wait('@createPackage');
        cy.url().should('include', '/dashboard/admin/subscriptions');
    });

    it('should edit a package', () => {
        // Mock Detail for Edit Page
        cy.intercept('GET', '**/patrons/packages/pkg_1*', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 'pkg_1',
                    tier: 'SUPPORTER',
                    frequency: 'MONTHLY',
                    miniumumAmount: 5000,
                    benefits: ['Access to news']
                }
            }
        }).as('getPackageDetail');

        cy.visit('/dashboard/admin/subscriptions/pkg_1/edit');
        cy.wait('@getPackageDetail');

        // Mock Update
        cy.intercept('PUT', '**/patrons/packages/pkg_1', {
            statusCode: 200,
            body: {
                success: true,
                data: { id: 'pkg_1', miniumumAmount: 6000 }
            }
        }).as('updatePackage');

        cy.get('[data-testid="input-subscription-amount"]').clear().type('6000');
        cy.get('[data-testid="btn-update-subscription"]').click();

        cy.wait('@updatePackage');
        cy.url().should('include', '/dashboard/admin/subscriptions');
    });

    it('should delete a package', () => {
        cy.intercept('GET', '**/patrons/packages*', {
            statusCode: 200,
            body: {
                success: true,
                data: [{
                    id: 'pkg_1',
                    tier: 'SUPPORTER',
                    frequency: 'MONTHLY',
                    miniumumAmount: 5000,
                    benefits: []
                }]
            }
        }).as('getPackages');

        cy.visit('/dashboard/admin/subscriptions');
        cy.wait('@getPackages');

        // Mock Delete
        cy.intercept('DELETE', '**/patrons/packages/pkg_1', {
            statusCode: 200,
            body: { success: true }
        }).as('deletePackage');

        cy.contains('Delete').click();
        cy.contains('Confirm').click(); // Confirm state

        cy.wait('@deletePackage');
        // Because of optimistic updates/refetch, we might mock the refetch as empty
        cy.intercept('GET', '**/patrons/packages*', {
            statusCode: 200, body: { success: true, data: [] }
        }).as('getPackagesAfterDelete');
    });
});
