
describe('CMS Dashboard - Articles', () => {
    beforeEach(() => {
        // Mock Auth
        cy.setCookie('token', 'mock-token');
        cy.intercept('GET', '**/auth/me', {
            statusCode: 200,
            body: {
                user: {
                    id: 'cms_1',
                    email: 'editor@example.com',
                    role: 'cms_editor',
                    name: 'Test Editor'
                }
            }
        }).as('getMe');
    });

    it('should list articles and allow navigation to create', () => {
        // Mock Articles List
        cy.intercept('GET', '**/articles?*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 'art_1',
                        title: 'Match Report: Finals',
                        summary: 'Great game.',
                        status: 'published',
                        createdAt: new Date().toISOString()
                    }
                ],
                totalPages: 1
            }
        }).as('getArticles');

        cy.visit('/dashboard/cms/articles');
        cy.wait('@getArticles');

        cy.get('[data-testid^="article-card-"]').should('have.length', 1);
        cy.contains('Match Report: Finals').should('be.visible');

        // Navigate to Create
        cy.get('[data-testid="btn-add-article"]').click();
        cy.url().should('include', '/dashboard/cms/articles/new');
    });

    it('should filter articles by tab', () => {
        // Mock Drafts
        cy.intercept('GET', '**/articles/unpublished*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    { id: 'art_2', title: 'Draft Article', status: 'draft', createdAt: new Date().toISOString() }
                ]
            }
        }).as('getDrafts');

        // Mock Published for initial load or reuse session
        cy.intercept('GET', '**/articles?*', { body: { success: true, data: [] } });

        cy.visit('/dashboard/cms/articles');

        cy.get('[data-testid="tab-draft"]').click();
        cy.wait('@getDrafts');

        cy.contains('Draft Article').should('be.visible');
    });

    it('should view and edit article', () => {
        cy.intercept('GET', '**/articles/art_1', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 'art_1',
                    title: 'Match Report: Finals',
                    summary: 'Great game.',
                    content: '<p>Content</p>',
                    status: 'published'
                }
            }
        }).as('getArticleDetail');

        cy.visit('/dashboard/cms/articles/art_1');
        cy.wait('@getArticleDetail');
        cy.contains('Match Report: Finals').should('be.visible');

        // Edit
        cy.get('[data-testid="btn-edit-article"]').click();
        cy.url().should('include', '/edit');

        cy.intercept('PUT', '**/articles/art_1', { statusCode: 200, body: { success: true } }).as('updateArticle');
        cy.get('[data-testid="input-article-title"]').clear().type('Updated Report');
        cy.get('[data-testid="btn-save-article"]').click();
        cy.wait('@updateArticle');
    });
});
