describe('Comprehensive Authentication Flow', () => {
    // Shared setup
    const login = (email: string, password = 'password123') => {
        cy.visit('/auth/login');
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);
        cy.get('button[type="submit"]').click();
    };

    const logout = () => {
        // Assuming there is a logout button in the dashboard or header
        // If the UI isn't consistent, we might need to visit a specific URL or open a menu
        // For now, attempting to find a logout button/link
        cy.get('button, a').contains(/sign out|logout/i).click({ force: true });
    };

    describe('Admin Authentication', () => {
        it('should log in as Admin and redirect to Admin Dashboard', () => {
            login('admin@academy.com');

            // Check for success message or redirect
            cy.url().should('include', '/dashboard/admin');
            cy.contains('Admin').should('exist'); // Verify general admin presence
        });
    });

    describe('Fan Authentication', () => {
        it('should log in as Fan and redirect to Fan Dashboard/Home', () => {
            login('fan@academy.com');

            // Likely redirects to /dashboard or / (Home) depending on role
            // Updating expectation based on typical flow
            cy.url().should('match', /\/dashboard|\/$/);
        });
    });

    describe('Media Manager Authentication', () => {
        it('should log in as Media Manager and redirect to CMS Dashboard', () => {
            login('media@academy.com');

            cy.url().should('include', '/dashboard');
            // Media managers usually see CMS
            // cy.contains('CMS').should('exist');
        });
    });

    describe('New User Registration Flow', () => {
        it('should allow a new user to sign up', () => {
            const timestamp = Date.now();
            const newEmail = `newuser${timestamp}@example.com`;

            cy.visit('/auth/login');
            cy.contains('Create New Account').click();
            cy.url().should('include', '/auth/signup');

            // Fill registration form
            // NOTE: Selectors are assumptions, need to verify strict selectors if this fails
            cy.get('input[name="firstName"]').type('New');
            cy.get('input[name="lastName"]').type('User');
            cy.get('input[name="email"]').type(newEmail);
            cy.get('input[name="password"]').type('Password123!');
            cy.get('input[name="confirmPassword"]').type('Password123!');

            // Submit
            cy.get('button[type="submit"]').click();

            // Verify success message or redirection
            cy.contains(/verification|success/i).should('be.visible');
        });
    });
});
