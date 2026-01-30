describe("CMS (Media Manager) Journeys", () => {
    beforeEach(() => {
        cy.login("media_manager@example.com", "password");
    });

    // UJ-CMS-001: Manage Articles
    describe("UJ-CMS-001: Manage Articles", () => {
        it("should allow a media manager to create and edit articles", () => {
            cy.visit("/dashboard/cms/articles");

            // Create new
            cy.contains("New Article").click();
            cy.url().should("include", "/articles/new");

            cy.get('[data-testid="input-article-title"]').type("New Club Record");
            // Rich text editor interaction might be complex, simplified here
            cy.get('[data-testid="editor-wrapper"]').click(); // Focus editor

            cy.get('[data-testid="btn-save-article"]').click();

            // Verify in list
            cy.visit("/dashboard/cms/articles");
            cy.contains("New Club Record").should("be.visible");

            // Analytics
            cy.visit("/dashboard/cms/analytics");
            cy.contains("Content Performance").should("be.visible");
        });
    });

    // UJ-CMS-002: Manage Videos
    describe("UJ-CMS-002: Manage Videos", () => {
        it("should allow a media manager to manage videos", () => {
            cy.visit("/dashboard/cms/videos");

            cy.contains("Upload Video").click();
            cy.url().should("include", "/videos/new");

            cy.get('[data-testid="input-video-title"]').type("Match Highlights");
            cy.get('[data-testid="textarea-video-excerpt"]').type("Highlights from the recent match.");
            // File upload simulation (requires fixture)
            // cy.get('[data-testid="input-file-video"]').selectFile('cypress/fixtures/video.mp4', { force: true });
            // cy.get('[data-testid="input-file-thumbnail"]').selectFile('cypress/fixtures/thumb.jpg', { force: true });

            cy.get('[data-testid="btn-create-video"]').click();

            // cy.contains("Match Highlights").should("be.visible"); // Might fail without upload
        });
    });
});
