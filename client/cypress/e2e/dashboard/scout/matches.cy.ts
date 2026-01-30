
describe('Scout Dashboard - Matches Archive', () => {
    beforeEach(() => {
        // Mock Auth
        cy.setCookie('token', 'mock-token');
        cy.intercept('GET', '**/auth/me', {
            statusCode: 200,
            body: {
                user: {
                    id: 'scout_1',
                    email: 'scout@example.com',
                    role: 'scout',
                    name: 'Test Scout',
                    isApproved: true
                }
            }
        }).as('getMe');
    });

    it('should list match archives', () => {
        // Mock Videos List (Matches)
        cy.intercept('GET', '**/videos*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 101,
                        title: 'League Final: Team A vs Team B',
                        thumbnail: 'http://example.com/thumb.jpg',
                        duration: '90:00',
                        createdAt: new Date().toISOString()
                    }
                ]
            }
        }).as('getMatches');

        cy.visit('/dashboard/scout/matches');
        cy.wait('@getMatches');

        cy.contains('Fixture Video Archive').should('be.visible');
        cy.get('[data-testid="match-card-101"]').should('be.visible');
        cy.contains('League Final: Team A vs Team B').should('be.visible');

        // Check play button exists
        cy.get('[data-testid="btn-play-match-101"]').should('have.attr', 'href', '/dashboard/scout/matches/101');
    });

    it('should view match details', () => {
        cy.intercept('GET', '**/videos/101', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 101,
                    title: 'League Final: Team A vs Team B',
                    url: 'http://example.com/video.mp4',
                    events: []
                }
            }
        }).as('getVideoDetail');

        cy.visit('/dashboard/scout/matches/101');
        cy.wait('@getVideoDetail');
        cy.contains('League Final: Team A vs Team B').should('be.visible');
        cy.get('video').should('exist');
    });
});
