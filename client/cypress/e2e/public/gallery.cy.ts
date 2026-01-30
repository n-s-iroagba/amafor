
describe('Public - Gallery', () => {
    it('should list fixture gallery and filter', () => {
        // Mock Gallery Fixtures
        cy.intercept('GET', '**/fixtures/gallery*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 201,
                        homeTeam: 'Amafor',
                        awayTeam: 'Rivals',
                        homeScore: 2,
                        awayScore: 1,
                        status: 'finished',
                        matchDate: new Date().toISOString(),
                        venue: 'Home Stadium',
                        league: { id: 1, name: 'Premier League' },
                        images: [
                            { url: 'http://example.com/img1.jpg' }
                        ]
                    }
                ]
            }
        }).as('getGallery');

        // Mock Leagues for filter
        cy.intercept('GET', '**/api/leagues*', {
            statusCode: 200,
            body: {
                success: true,
                data: [{ id: 1, name: 'Premier League' }]
            }
        }).as('getLeagues');

        cy.visit('/gallery');
        cy.wait('@getGallery');

        cy.contains('Fixture Gallery').should('be.visible');
        cy.get('[data-testid="gallery-item"]').should('have.length', 1);
        cy.contains('Amafor').should('be.visible');

        // Test Filter (UI only mock logic)
        cy.get('[data-testid="gallery-search"]').type('Amafor');
        cy.get('[data-testid="gallery-item"]').should('have.length', 1);

        cy.get('[data-testid="gallery-search"]').clear().type('NonExistent');
        cy.contains('No fixtures found').should('be.visible');
    });

    it('should display fixture gallery details and lightbox', () => {
        const fixtureId = 201;

        // Mock Detail
        cy.intercept('GET', `**/api/fixtures/${fixtureId}`, {
            statusCode: 200,
            body: {
                id: fixtureId,
                homeTeam: 'Amafor',
                awayTeam: 'Rivals',
                venue: 'Home Stadium',
                matchDate: new Date().toISOString(),
                status: 'finished',
                homeScore: 2,
                awayScore: 1
            }
        }).as('getFixture');

        // Mock Images
        cy.intercept('GET', `**/api/fixtures/${fixtureId}/images`, {
            statusCode: 200,
            body: [
                { id: 1, url: 'http://example.com/img1.jpg', description: 'Action Shot' }
            ]
        }).as('getImages');

        cy.visit(`/gallery/${fixtureId}`);
        cy.wait(['@getFixture', '@getImages']);

        cy.contains('Amafor').should('be.visible');
        cy.get('[data-testid="gallery-thumbnail"]').should('have.length', 1);

        // Lightbox
        cy.get('[data-testid="lightbox-open-btn"]').click();
        cy.get('[data-testid="lightbox-modal"]').should('be.visible');
        cy.contains('Action Shot').should('be.visible');
    });
});
