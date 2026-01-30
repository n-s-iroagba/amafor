
describe('Public - League Statistics', () => {
    it('should list leagues and expand tables', () => {
        // Mock Leagues with Tables
        cy.intercept('GET', '**/leagues/tables*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 1,
                        name: 'Premier League',
                        season: '2024/2025',
                        amaforPosition: 1,
                        amaforStats: { points: 60, goalsFor: 45 },
                        table: [
                            { position: 1, team: 'Amafor Gladiators', played: 20, points: 60, goalDifference: 30 },
                            { position: 2, team: 'Rivals FC', played: 20, points: 55, goalDifference: 25 }
                        ]
                    }
                ]
            }
        }).as('getLeagues');

        cy.visit('/league-statistics');
        cy.wait('@getLeagues');

        cy.contains('Premier League').should('be.visible');
        cy.contains('#1').should('be.visible'); // Position

        // Test Interaction: Expand Table
        cy.contains('View Table').click();
        cy.contains('League Table Preview').should('be.visible');
        cy.contains('Rivals FC').should('be.visible');
    });

    it('should filter leagues', () => {
        // Reuse mock or specific search mock
        cy.intercept('GET', '**/leagues/tables*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    { id: 1, name: 'Premier League', season: '2024/2025' },
                    { id: 2, name: 'Cup A', season: '2024' }
                ]
            }
        }).as('getLeaguesSearch');

        cy.visit('/league-statistics');
        cy.wait('@getLeaguesSearch');

        cy.get('[data-testid="search-leagues"]').type('Premier');
        cy.contains('Premier League').should('be.visible');
        cy.contains('Cup A').should('not.exist');
    });

    it('should display league detail page with standings', () => {
        const leagueId = 1;
        // Mock League Table (Detail Route)
        cy.intercept('GET', `**/api/leagues/${leagueId}/table`, {
            statusCode: 200,
            body: {
                id: leagueId,
                name: 'Premier League',
                season: '2024/2025',
                table: [
                    { position: 1, team: 'Amafor Gladiators', played: 20, won: 19, draw: 1, lost: 0, points: 58, goalsFor: 40, goalsAgainst: 5, goalDifference: 35, form: ['W', 'W', 'W', 'W', 'D'] }
                ],
                statistics: {
                    topScorer: { name: 'Super Striker', team: 'Amafor Gladiators', goals: 25 }
                },
                recentFixtures: []
            }
        }).as('getLeagueTable');

        cy.visit(`/league-statistics/${leagueId}`);
        cy.wait('@getLeagueTable');

        cy.contains('Amafor Gladiators').should('be.visible');
        cy.contains('58').should('be.visible'); // Points
        cy.contains('Super Striker').should('be.visible');
    });
});
