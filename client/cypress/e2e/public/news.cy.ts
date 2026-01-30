
describe('Public - News', () => {
    it('should list published news articles', () => {
        // Mock Published Articles
        cy.intercept('GET', '**/articles/published*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 101,
                        title: 'Club Wins Championship',
                        excerpt: 'A historic victory.',
                        publishedAt: new Date().toISOString(),
                        content: '<p>Full story here...</p>'
                    },
                    {
                        id: 102,
                        title: 'New Signing Announced',
                        excerpt: 'Welcome to the team.',
                        publishedAt: new Date().toISOString(),
                        content: '<p>Details here...</p>'
                    }
                ],
                totalPages: 1
            }
        }).as('getNews');

        cy.visit('/news');
        cy.wait('@getNews');

        cy.contains('Amafor Galadiators Sports News').should('be.visible');
        cy.get('[data-testid="news-item"]').should('have.length', 2);
        cy.contains('Club Wins Championship').should('be.visible');
    });

    it('should view article details', () => {
        // Mock Single Article
        cy.intercept('GET', '**/articles/101', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 101,
                    title: 'Club Wins Championship',
                    excerpt: 'A historic victory.',
                    publishedAt: new Date().toISOString(),
                    content: '<p>We won the league!</p>'
                }
            }
        }).as('getArticleDetail');

        cy.visit('/news/101');
        cy.wait('@getArticleDetail');

        cy.get('[data-testid="article-title"]').should('contain', 'Club Wins Championship');
        cy.get('[data-testid="article-content"]').should('contain', 'We won the league!');
        cy.get('[data-testid="back-button"]').click(); // Actually "back-button" triggers window.history.back(), testing it might be tricky in cy run without history, but click is fine.
    });
});
