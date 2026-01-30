
describe('Admin Dashboard - Academy Management', () => {

    beforeEach(() => {
        cy.visit('/dashboard/admin');
    });

    describe('Staff Management', () => {
        beforeEach(() => {
            cy.visit('/dashboard/admin/academy/staff');
        });

        it('should list staff and search', () => {
            cy.get('[data-testid="btn-add-academy-staff"]').click();
            cy.url().should('include', '/academy/staff/new');
            cy.get('[data-testid="input-staff-name"]').should('be.visible');
            cy.get('[data-testid="input-staff-role"]').should('be.visible');
            cy.get('[data-testid="select-staff-category"]').should('be.visible');
            cy.get('[data-testid="btn-save-staff"]').should('be.visible');

            cy.visit('/dashboard/admin/academy/staff');
            cy.get('[data-testid="input-search-academy-staff"]').type('Coach');

            cy.get('body').then(($body) => {
                if ($body.find('[data-testid="academy-staff-item"]').length > 0) {
                    cy.get('[data-testid="academy-staff-item"]').should('be.visible');
                } else {
                    cy.contains('No staff found').should('be.visible');
                }
            });
        });

        it('should view and edit staff', () => {
            // Mock Staff Detail
            cy.intercept('GET', '**/academy-staff/staff_1', {
                statusCode: 200,
                body: { success: true, data: { id: 'staff_1', name: 'Existing Coach', role: 'Head Coach' } }
            }).as('getStaffDetail');

            cy.visit('/dashboard/admin/academy/staff/staff_1');
            cy.wait('@getStaffDetail');
            cy.contains('Existing Coach').should('be.visible');

            // Navigate to Edit
            cy.get('[data-testid="btn-edit-staff"]').click();
            cy.url().should('include', '/edit');

            // Mock Update
            cy.intercept('PUT', '**/academy-staff/staff_1', {
                statusCode: 200,
                body: { success: true, data: { id: 'staff_1', name: 'Updated Coach' } }
            }).as('updateStaff');

            cy.get('[data-testid="input-staff-name"]').clear().type('Updated Coach');
            cy.get('[data-testid="btn-save-staff"]').click();
            cy.wait('@updateStaff');
        });

        it('should view and edit trialist', () => {
            // Mock Trialist Detail
            cy.intercept('GET', '**/academy-trialists/trial_1', {
                statusCode: 200,
                body: { success: true, data: { id: 'trial_1', firstName: 'John', lastName: 'Doe' } }
            }).as('getTrialistDetail');

            cy.visit('/dashboard/admin/academy/trialist/trial_1');
            // cy.wait('@getTrialistDetail'); // Depending on implementation

            cy.contains('John Doe').should('be.visible');

            // Navigate to Edit
            cy.get('[data-testid="btn-edit-trialist"]').click();
            cy.url().should('include', '/edit');

            // Mock Update
            cy.intercept('PUT', '**/academy-trialists/trial_1', {
                statusCode: 200,
                body: { success: true }
            }).as('updateTrialist');

            cy.get('[data-testid="input-trialist-firstname"]').clear().type('Jane');
            cy.get('[data-testid="btn-save-trialist"]').click();
            cy.wait('@updateTrialist');
        });
    });

    describe('Trialist Management', () => {
        beforeEach(() => {
            cy.visit('/dashboard/admin/academy/trialist');
        });

        it('should list trialists and filter', () => {
            cy.get('[data-testid="btn-add-trialist"]').click();
            cy.url().should('include', '/academy/trialist/new');
            cy.get('[data-testid="input-trialist-firstname"]').should('be.visible');
            cy.get('[data-testid="input-trialist-lastname"]').should('be.visible');
            cy.get('[data-testid="btn-save-trialist"]').should('be.visible');

            cy.visit('/dashboard/admin/academy/trialist');
            cy.get('[data-testid="input-search-trialists"]').should('be.visible');

            cy.get('body').then(($body) => {
                if ($body.find('[data-testid^="trialist-row-"]').length > 0) {
                    cy.get('[data-testid^="trialist-row-"]').should('be.visible');
                } else {
                    cy.contains('No trialists yet').should('be.visible');
                }
            });
        });
    });

});
