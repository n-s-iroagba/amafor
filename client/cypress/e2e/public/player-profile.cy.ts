
describe('Public - Player Profile', () => {
    it('should display player profile details', () => {
        // Mock Player Data
        cy.intercept('GET', '**/players/123', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 123,
                    name: 'Test Player',
                    position: 'Forward',
                    jerseyNumber: 9,
                    nationality: 'Nigeria',
                    biography: 'A promising talent.',
                    stats: {
                        appearances: 10,
                        goals: 5,
                        assists: 2,
                        minutesPlayed: 850
                    }
                }
            }
        }).as('getPlayer');

        cy.visit('/player/123');
        cy.wait('@getPlayer');

        cy.get('[data-testid="player-name"]').should('contain', 'Test Player');
        cy.get('[data-testid="player-jersey"]').should('contain', '9');
        cy.get('[data-testid="player-stats-grid"]').should('be.visible');
        cy.contains('A promising talent').should('be.visible');
    });
});
