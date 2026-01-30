
describe('Admin Dashboard - Scout Verification', () => {
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

    it('should display the scout verification queue', () => {
        // Mock Users List
        cy.intercept('GET', '**/api/users*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    { id: 101, name: 'Scout One', email: 's1@example.com', role: 'Scout', status: 'Pending', createdAt: new Date().toISOString() },
                    { id: 102, name: 'Scout Two', email: 's2@example.com', role: 'Scout', status: 'Pending', createdAt: new Date().toISOString() }
                ]
            }
        }).as('getScouts');

        cy.visit('/dashboard/admin/scouts');
        cy.wait('@getScouts');

        cy.contains('Scout Verification Queue').should('be.visible');
        cy.get('[data-testid="scout-application-card"]').should('have.length', 2);
        cy.contains('Scout One').should('be.visible');
    });

    it('should view scout dossier', () => {
        cy.intercept('GET', '**/api/users*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    { id: 101, name: 'Scout One', email: 's1@example.com', role: 'Scout', status: 'Pending', createdAt: new Date().toISOString() }
                ]
            }
        }).as('getScouts');

        cy.visit('/dashboard/admin/scouts');
        cy.wait('@getScouts');

        // Mock Detail
        cy.intercept('GET', '**/api/users/101', {
            statusCode: 200,
            body: {
                success: true,
                data: { id: 101, name: 'Scout One', email: 's1@example.com', role: 'Scout', status: 'Pending', createdAt: new Date().toISOString() }
            }
        }).as('getScoutDetail');

        cy.get('[data-testid="link-view-dossier"]').first().click();
        cy.url().should('include', '/scouts/101');
        cy.wait('@getScoutDetail');
        cy.contains('Scout One').should('be.visible');
        cy.contains('Application Details').should('be.visible');
    });

    it('should approve a scout application', () => {
        // Direct visit to detail
        cy.intercept('GET', '**/api/users/101', {
            statusCode: 200,
            body: {
                success: true,
                data: { id: 101, name: 'Scout One', email: 's1@example.com', role: 'Scout', status: 'Pending', createdAt: new Date().toISOString() }
            }
        }).as('getScoutDetail');

        cy.visit('/dashboard/admin/scouts/101');
        cy.wait('@getScoutDetail');

        // Mock Approve
        cy.intercept('PUT', '**/api/users/101', {
            statusCode: 200,
            body: {
                success: true,
                data: { id: 101, status: 'Active' }
            }
        }).as('approveScout');

        cy.contains('APPROVE ACCESS').click();

        // Handle window alert
        cy.on('window:alert', (str) => {
            expect(str).to.equal(`Scout application approved successfully.`);
        });

        cy.wait('@approveScout');
        cy.url().should('include', '/dashboard/admin/scouts');
    });

    it('should reject a scout application', () => {
        // Direct visit to detail
        cy.intercept('GET', '**/api/users/101', {
            statusCode: 200,
            body: {
                success: true,
                data: { id: 101, name: 'Scout One', email: 's1@example.com', role: 'Scout', status: 'Pending', createdAt: new Date().toISOString() }
            }
        }).as('getScoutDetail');

        cy.visit('/dashboard/admin/scouts/101');
        cy.wait('@getScoutDetail');

        // Mock Approve
        cy.intercept('PUT', '**/api/users/101', {
            statusCode: 200,
            body: {
                success: true,
                data: { id: 101, status: 'Rejected' }
            }
        }).as('rejectScout');

        cy.contains('REJECT').click();

        // Handle window alert
        cy.on('window:alert', (str) => {
            expect(str).to.contain(`Scout application rejected successfully`);
        });

        cy.wait('@rejectScout');
        cy.url().should('include', '/dashboard/admin/scouts');
    });

});
