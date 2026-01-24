describe("Admin System Journeys", () => {
    beforeEach(() => {
        cy.login("super_admin@example.com", "password");
    });

    // UJ-ADM-007: Manage Users & Permissions
    describe("UJ-ADM-007: Manage Users & Permissions", () => {
        it("should allow managing users", () => {
            cy.visit("/dashboard/admin/users");
            cy.contains("Invite User").click();
            cy.url().should("include", "/invite");

            cy.get('input[name="email"]').type(`newuser-${Date.now()}@example.com`);
            cy.get('select[name="role"]').select("scout");
            cy.get('button[type="submit"]').click();
        });
    });

    // UJ-ADM-008: Manage RSS Feeds
    describe("UJ-ADM-008: Manage RSS Feeds", () => {
        it("should allow managing RSS feeds", () => {
            cy.visit("/dashboard/admin/rss-feeds");
            cy.contains("New Feed").click();

            cy.get('input[name="url"]').type("https://news.bbc.co.uk/rss.xml");
            cy.get('button[type="submit"]').click();
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
