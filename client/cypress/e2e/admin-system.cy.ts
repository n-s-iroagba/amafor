describe("Admin System Journeys", () => {
    beforeEach(() => {
        cy.login("super_admin@example.com", "password");
    });

    // UJ-ADM-007: Manage Users & Permissions
    describe("UJ-ADM-007: Manage Users & Permissions", () => {
        it("should allow managing users", () => {
            cy.visit("/dashboard/admin/users");
            cy.get('[data-testid="btn-invite-user"]').click();
            cy.url().should("include", "/invite");

            cy.get('[data-testid="input-user-email"]').type(`newuser-${Date.now()}@example.com`);
            cy.get('[data-testid^="radio-role-"]').first().click();
            cy.get('[data-testid="btn-send-invite"]').click();
        });
    });

    // UJ-ADM-008: Manage RSS Feeds
    describe("UJ-ADM-008: Manage RSS Feeds", () => {
        it("should allow managing RSS feeds", () => {
            cy.visit("/dashboard/admin/rss-feeds");
            cy.get('[data-testid="btn-add-feed"]').click();

            cy.get('[data-testid="input-feed-name"]').type("BBC News");
            cy.get('[data-testid="input-feed-url"]').type("https://news.bbc.co.uk/rss.xml");
            // Select category
            cy.get('[data-testid^="btn-category-"]').first().click();
            cy.get('[data-testid="btn-save-feed"]').click();

            // Verify and Edit
            cy.get('[data-testid="feed-item"]').first().click();
            cy.get('[data-testid="btn-edit-feed"]').click();
            cy.get('[data-testid="input-feed-name"]').clear().type("BBC News Updated");
            cy.get('[data-testid="btn-update-feed"]').click();
        });
    });

    // UJ-ADM-009: System Administration
    describe("UJ-ADM-009: System Administration", () => {
        it("should allow access to system admin pages", () => {
            cy.visit("/dashboard/admin");

            // Visit various system pages
            cy.visit("/dashboard/admin/audit");
            cy.contains("Audit Logs").should("be.visible");

            cy.visit("/dashboard/admin/backups");
            cy.contains("Backups").should("be.visible");

            cy.visit("/dashboard/admin/health");
            cy.contains("System Health").should("be.visible");

            cy.visit("/dashboard/admin/notifications");
            cy.contains("Notifications").should("be.visible");

            cy.visit("/dashboard/admin/settings");
            cy.contains("Settings").should("be.visible");
        });
    });
});
