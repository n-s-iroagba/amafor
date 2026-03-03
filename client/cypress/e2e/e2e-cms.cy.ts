/**
 * ============================================================
 * E2E TEST SUITE — CMS (ARTICLES & VIDEOS)
 * Journeys: UJ-CMS-001, UJ-CMS-002
 *
 * SERVER RESPONSE SHAPES (from ArticleController, VideoController):
 *   GET  /articles          → { success, data: Article[] }
 *   GET  /articles/published → { success, data: Article[] }
 *   POST /articles          → inferred: { success, data: Article }
 *   GET  /articles/:id      → { success, data: Article }
 *   PUT  /articles/:id      → { success, data: Article }
 *   DELETE /articles/:id    → { success, message }
 *   GET  /articles/analytics → { success, data: ArticleAnalytics[] }
 *   GET  /videos            → { success, data: Video[], pagination: { page, limit, total, pages } }
 *   POST /videos            → 201 { success, message: 'Video created successfully', data: Video }
 *   GET  /videos/:id        → { success, data: Video }  ← inferred from service
 *   PUT  /videos/:id        → { success, message: 'Video updated successfully', data: Video }
 *   DELETE /videos/:id      → { success, message: 'Video deleted successfully' }
 *   GET  /auth/me           → AuthUser (no wrapper)
 *
 * Article fields: id, title, excerpt, body, status, imageUrl, authorId, createdAt, updatedAt
 * Video fields: id, title, excerpt, thumbnail, videoUrl, duration, createdAt, updatedAt
 * ============================================================
 */

const adminMe = () =>
    cy.intercept('GET', '**/api/auth/me*', {
        statusCode: 200,
        body: { id: 'adm1', email: 'admin@test.com', firstName: 'Admin', lastName: 'User', role: 'admin', status: 'active', emailVerified: true },
    });

const mockArticle = {
    id: 'art_1',
    title: 'Season Preview',
    excerpt: 'A great season ahead.',
    body: '<p>Full content.</p>',
    status: 'published',
    imageUrl: '/img.jpg',
    authorId: 'adm1',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
};

const mockVideo = {
    id: 'vid_1',
    title: 'Match Highlights',
    excerpt: 'Amafor vs Rivers highlights',
    thumbnail: '/thumb.jpg',
    videoUrl: 'https://youtube.com/watch?v=abc',
    duration: 380,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
};

// ─────────────────────────────────────────────────────────────
// UJ-CMS-001 — Publish Article
// BR: BR-CE-01, BR-CE-05 | SRS: REQ-CMS-01..REQ-CMS-03
// Screens: SC-026..SC-031
// ─────────────────────────────────────────────────────────────
describe('UJ-CMS-001 — Publish Article', () => {
    describe('Happy Path', () => {
        it('E2E-CMS-001-H01: Article admin list — GET /articles returns { success, data: Article[] }', () => {
            adminMe();
            cy.intercept('GET', '**/api/articles*', {
                statusCode: 200,
                body: { success: true, data: [mockArticle] },
            }).as('getArticles');

            cy.visit('/dashboard/admin/cms/articles');
            cy.wait('@getArticles');
            cy.get('[data-testid="btn-add-article"]').should('be.visible');
            cy.contains(mockArticle.title).should('be.visible');
        });

        it('E2E-CMS-001-H02: Create article — POST /articles returns { success, data: Article } with status "draft"', () => {
            adminMe();
            cy.intercept('POST', '**/api/articles*', {
                statusCode: 201,
                body: { success: true, data: { ...mockArticle, id: 'art_new', title: 'New Draft', status: 'draft' } },
            }).as('createArticle');

            cy.visit('/dashboard/admin/cms/articles/new');
            cy.get('[data-testid="article-title"]').type('New Draft Article');
            cy.get('[data-testid="article-content"]').type('Content here.', { force: true });
            cy.get('[data-testid="btn-save-article"]').click();

            cy.wait('@createArticle').its('response.body.data.status').should('eq', 'draft');
            cy.contains(/saved|draft/i).should('be.visible');
        });

        it('E2E-CMS-001-H03: Edit article — GET /articles/:id then PUT /articles/:id returns { success, data: Article }', () => {
            adminMe();
            cy.intercept('GET', `/articles/${mockArticle.id}*`, {
                statusCode: 200, body: { success: true, data: mockArticle },
            }).as('getArt');
            cy.intercept('PUT', `/articles/${mockArticle.id}*`, {
                statusCode: 200,
                body: { success: true, data: { ...mockArticle, title: 'Updated Season Preview', status: 'published' } },
            }).as('updateArticle');

            cy.visit(`/dashboard/admin/cms/articles/${mockArticle.id}/edit`);
            cy.wait('@getArt');
            cy.get('[data-testid="article-title"]').clear().type('Updated Season Preview');
            cy.get('[data-testid="btn-save-article"]').click();

            cy.wait('@updateArticle').its('response.body.data.title').should('eq', 'Updated Season Preview');
        });

        it('E2E-CMS-001-H04: Delete article — DELETE /articles/:id returns { success, message }', () => {
            adminMe();
            cy.intercept('GET', `/articles/${mockArticle.id}*`, { body: { success: true, data: mockArticle } });
            cy.intercept('DELETE', `/articles/${mockArticle.id}*`, {
                statusCode: 200,
                body: { success: true, message: 'Article deleted successfully' },
            }).as('delArticle');

            cy.visit(`/dashboard/admin/cms/articles/${mockArticle.id}`);
            cy.get('[data-testid="btn-delete-article"]').click();
            cy.get('[data-testid="btn-confirm-delete"]').click();
            cy.wait('@delArticle').its('response.body.success').should('eq', true);
        });

        it('E2E-CMS-001-H05: Analytics — GET /articles/analytics returns { success, data: ArticleAnalytics[] } (BR-CE-05)', () => {
            adminMe();
            cy.intercept('GET', '**/api/articles/analytics*', {
                statusCode: 200,
                body: { success: true, data: [{ articleId: 'art_1', title: 'Season Preview', views: 120, uniqueViews: 98 }] },
            }).as('getAnalytics');

            cy.visit('/dashboard/admin/cms/analytics');
            cy.wait('@getAnalytics');
            cy.contains('Season Preview').should('be.visible');
            cy.contains('120').should('be.visible');
        });
    });

    describe('Failure Path', () => {
        it('E2E-CMS-001-F01: Save article disabled when title empty', () => {
            adminMe();
            cy.visit('/dashboard/admin/cms/articles/new');
            cy.get('[data-testid="btn-save-article"]').should('be.disabled');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-CMS-002 — Manage Video Content
// BR: BR-CE-01 | SRS: REQ-CMS-04 | Screens: SC-030, SC-032, SC-033
// Video list returns pagination: { page, limit, total, pages }
// ─────────────────────────────────────────────────────────────
describe('UJ-CMS-002 — Manage Video Content', () => {
    describe('Happy Path', () => {
        it('E2E-CMS-002-H01: Video list — GET /videos returns { success, data, pagination }', () => {
            adminMe();
            cy.intercept('GET', '**/api/videos*', {
                statusCode: 200,
                body: {
                    success: true,
                    data: [mockVideo],
                    pagination: { page: 1, limit: 10, total: 1, pages: 1 },
                },
            }).as('getVideos');

            cy.visit('/dashboard/admin/cms/videos');
            cy.wait('@getVideos');
            cy.get('[data-testid="btn-add-video"]').should('be.visible');
            cy.contains(mockVideo.title).should('be.visible');
        });

        it('E2E-CMS-002-H02: Create video — POST /videos → 201 { success, message: "Video created successfully", data: Video }', () => {
            adminMe();
            cy.intercept('POST', '**/api/videos*', {
                statusCode: 201,
                body: {
                    success: true,
                    message: 'Video created successfully',
                    data: { ...mockVideo, id: 'vid_2', title: 'New Video', videoUrl: 'https://youtube.com/watch?v=xyz' },
                },
            }).as('createVideo');

            cy.visit('/dashboard/admin/cms/videos/new');
            cy.get('input[name="title"]').type('New Video');
            cy.get('[data-testid="apply-url"], input[name="embedUrl"], input[name="videoUrl"]').first().type('https://youtube.com/watch?v=xyz');
            cy.get('[data-testid="btn-add-video"], [data-testid="btn-create-video"], button[type="submit"]').first().click();

            cy.wait('@createVideo').its('response.body.message').should('eq', 'Video created successfully');
        });

        it('E2E-CMS-002-H03: Edit video — PUT /videos/:id → { success, message: "Video updated successfully", data: Video }', () => {
            adminMe();
            cy.intercept('GET', `/videos/${mockVideo.id}*`, { statusCode: 200, body: { success: true, data: mockVideo } }).as('getVideo');
            cy.intercept('PUT', `/videos/${mockVideo.id}*`, {
                statusCode: 200,
                body: { success: true, message: 'Video updated successfully', data: { ...mockVideo, title: 'Updated Highlights' } },
            }).as('updateVideo');

            cy.visit(`/dashboard/admin/cms/videos/${mockVideo.id}/edit`);
            cy.wait('@getVideo');
            cy.get('input[name="title"]').clear().type('Updated Highlights');
            cy.get('[data-testid="btn-edit-video"], button[type="submit"]').first().click();

            cy.wait('@updateVideo').its('response.body.message').should('eq', 'Video updated successfully');
        });

        it('E2E-CMS-002-H04: Delete video — DELETE /videos/:id → { success, message: "Video deleted successfully" }', () => {
            adminMe();
            cy.intercept('GET', '**/api/videos*', { body: { success: true, data: [mockVideo], pagination: { page: 1, limit: 10, total: 1, pages: 1 } } });
            cy.intercept('DELETE', `/videos/${mockVideo.id}*`, {
                statusCode: 200,
                body: { success: true, message: 'Video deleted successfully' },
            }).as('delVideo');

            cy.visit('/dashboard/admin/cms/videos');
            cy.get('[data-testid="btn-delete-video"]').first().click();
            cy.get('[data-testid="btn-confirm-delete"]').click();
            cy.wait('@delVideo').its('response.body.message').should('eq', 'Video deleted successfully');
        });
    });
});
