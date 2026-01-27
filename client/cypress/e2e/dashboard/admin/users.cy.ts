describe('Admin Dashboard - User Management', () => {
    beforeEach(() => {
        // Login as Admin before each test
        cy.visit('/auth/login');
        cy.get('input[name="email"]').type('admin@academy.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        // Debugging: Check for error alerts
        cy.get('body').then(($body) => {
            if ($body.find('.text-red-700').length > 0) {
                cy.log('Login Error Found:', $body.find('.text-red-700').text());
            }
        });

        // Ensure we are on the dashboard
        cy.url().should('include', '/dashboard/admin');

        // Navigate to User Management
        cy.visit('/dashboard/admin/users');
    });

    it('should display the user management page with table', () => {
        cy.get('h1').contains('User Management').should('be.visible');
        cy.get('table').should('exist');
        cy.get('thead').should('exist');
    });

    it('should list users in the table', () => {
        // There should be at least one user (the admin)
        cy.get('tbody tr').should('have.length.greaterThan', 0);
        cy.contains('admin@academy.com').should('be.visible');
    });

    it('should have a working invite button', () => {
        cy.get('a[href="/dashboard/admin/users/invite"]').click();
        cy.url().should('include', '/dashboard/admin/users/invite');
        cy.contains('Invite').should('exist'); // Assuming the invite page has this text
    });
});
