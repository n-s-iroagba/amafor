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

            cy.get('input[name="title"]').type("New Club Record");
            // Rich text editor interaction might be complex, simplified here
            cy.get('.ql-editor').type("Detailed article content...");

            cy.get('button[type="submit"]').click();

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

            cy.get('input[name="title"]').type("Match Highlights");
            cy.get('input[name="url"]').type("https://youtube.com/watch?v=123");

            cy.get('button[type="submit"]').click();

            cy.contains("Match Highlights").should("be.visible");
        });
    });
});
