
describe('Public - Featured News', () => {
    it('should display featured news items', () => {
        // Mock Featured News API
        cy.intercept('GET', '**/featured-news*', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    data: [
                        {
                            id: 'rss-1',
                            title: 'Featured Story 1',
                            article_url: 'https://example.com/story1',
                            summary: 'Summary 1',
                            contentSnippet: 'Snippet 1',
                            published_at: new Date().toISOString()
                        },
                        {
                            id: 'rss-2',
                            title: 'Featured Story 2',
                            article_url: 'https://example.com/story2',
                            summary: 'Summary 2',
                            contentSnippet: 'Snippet 2',
                            published_at: new Date().toISOString()
                        }
                    ],
                    totalPages: 1
                }
            }
        }).as('getFeaturedNews');

        cy.visit('/featured-news');
        cy.wait('@getFeaturedNews');

        cy.contains('Featured News').should('be.visible');
        cy.get('[data-testid="featured-news-item"]').should('have.length', 2);
        cy.contains('Featured Story 1').should('be.visible');

        // Check link attribute
        cy.contains('Featured Story 1')
            .closest('article')
            .find('a[href="https://example.com/story1"]')
            .should('exist');
    });

    it('should show empty state when no news', () => {
        cy.intercept('GET', '**/featured-news*', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    data: [],
                    totalPages: 0
                }
            }
        }).as('getEmptyNews');

        cy.visit('/featured-news');
        cy.wait('@getEmptyNews');

        cy.contains('No featured news available').should('be.visible');
    });

    it('should display error message on API failure', () => {
        cy.intercept('GET', '**/featured-news*', {
            statusCode: 500,
            body: {
                success: false,
                message: 'Failed to fetch news'
            }
        }).as('getNewsError');

        cy.visit('/featured-news');
        cy.wait('@getNewsError');

        cy.contains('Failed to fetch news').should('be.visible');
    });

});
