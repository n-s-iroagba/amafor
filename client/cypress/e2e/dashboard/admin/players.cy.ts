describe('Admin Dashboard - Players Management', () => {
    beforeEach(() => {
        // Login as Admin
        cy.visit('/auth/login');
        cy.get('input[name="email"]').type('admin@academy.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        // Ensure dashboard access
        cy.url().should('include', '/dashboard/admin', { timeout: 10000 });

        // Navigate to Players
        cy.visit('/dashboard/admin/players');
    });

    it('should display the players page', () => {
        cy.get('h1').contains('Players').should('be.visible');
        cy.contains('a', 'Add New Player').should('be.visible');
    });

    it('should handle list content', () => {
        // Wait for loading
        cy.contains('Loading players...').should('not.exist');

        cy.get('body').then(($body) => {
            if ($body.text().includes('No players yet')) {
                cy.contains('Get started by adding your first player').should('be.visible');
            } else {
                cy.get('table').should('exist');
                cy.get('thead').contains('Player');
                cy.get('thead').contains('Position');
                cy.get('thead').contains('Jersey');
            }
        });
    });

    it('should create a new player', () => {
        cy.visit('/dashboard/admin/players/new');
        cy.intercept('POST', '**/players', { statusCode: 201, body: { success: true } }).as('createPlayer');

        cy.get('[data-testid="input-player-name"]').type('New Player');
        cy.get('[data-testid="btn-save-player"]').click();
        cy.wait('@createPlayer');
    });

    it('should view and edit player', () => {
        cy.intercept('GET', '**/players/1', {
            statusCode: 200,
            body: { success: true, data: { id: 1, name: 'Pro Player' } }
        }).as('getPlayer');

        cy.visit('/dashboard/admin/players/1');
        cy.wait('@getPlayer');
        cy.contains('Pro Player').should('be.visible');

        cy.get('[data-testid="btn-edit-player"]').click();
        cy.url().should('include', '/edit');

        cy.intercept('PUT', '**/players/1', { statusCode: 200, body: { success: true } }).as('updatePlayer');
        cy.get('[data-testid="btn-save-player"]').click();
        cy.wait('@updatePlayer');
    });
});
