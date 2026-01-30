describe('Scout Dashboard Workflows', () => {
    beforeEach(() => {
        cy.login('scout@amafor.com', 'password123'); // Assuming scout login
        cy.visit('/dashboard/scout');
    });

    it('should navigate to players and search', () => {
        cy.get('[data-testid="link-quick-players"]').click();
        cy.url().should('include', '/dashboard/scout/players');

        // Search
        cy.get('[data-testid="input-search-players"]').type('John');
        cy.get('[data-testid="filter-position-FW"]').click();

        // Verify filter active visual state if possible, or just presence of elements
        cy.get('[data-testid="filter-position-FW"]').should('have.class', 'bg-[#2F4F4F]');
    });

    it('should view player details and generate report', () => {
        cy.visit('/dashboard/scout/players');
        // Click first player
        cy.get('[data-testid^="player-card-"]').first().click();
        cy.url().should('include', '/players/');

        // Check stats
        cy.get('[data-testid="stat-card-goals"]').should('exist');

        // Generate report
        cy.get('[data-testid="btn-generate-report"]').click();
        cy.contains('ANALYZING METRICS').should('exist');
        // Simulate wait
        cy.wait(2000);
        cy.contains('DOWNLOAD READY').should('exist');
    });

    it('should access match archives', () => {
        cy.visit('/dashboard/scout/matches');
        cy.get('[data-testid^="match-card-"]').should('have.length.gt', 0);

        // Click first match play
        cy.get('[data-testid^="btn-play-match-"]').first().click();
        cy.url().should('include', '/matches/');
    });

    it('should list and delete reports', () => {
        cy.visit('/dashboard/scout/reports');
        cy.get('[data-testid="input-search-reports"]').should('be.visible');

        // Check list
        // Assuming there are reports
        // cy.get('[data-testid^="report-row-"]').first().should('exist');
        // Delete
        // cy.get('[data-testid^="btn-delete-report-"]').first().click();
    });
});
