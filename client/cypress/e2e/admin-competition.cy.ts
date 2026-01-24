describe("Admin Competition Journeys", () => {
    beforeEach(() => {
        cy.login("sports_admin@example.com", "password");
    });

    // UJ-ADM-001: Manage Leagues
    describe("UJ-ADM-001: Manage Leagues", () => {
        it("should allow managing leagues", () => {
            cy.visit("/dashboard/admin/leagues");
            cy.contains("New League").click();
            cy.url().should("include", "/leagues/new");

            cy.get('input[name="name"]').type("Premier League 2026/27");
            cy.get('button[type="submit"]').click();

            // Manage statistics
            cy.visit("/dashboard/admin/leagues/1/league-statstics"); // Adjust ID
            cy.contains("Standings").should("be.visible");
        });
    });

    // UJ-ADM-002: Manage Fixtures
    describe("UJ-ADM-002: Manage Fixtures", () => {
        it("should allow managing fixtures", () => {
            // Assuming league ID 1 exists
            cy.visit("/dashboard/admin/leagues/1/fixtures");
            cy.contains("New Fixture").click();

            cy.get('select[name="homeTeam"]').select("Team A");
            cy.get('select[name="awayTeam"]').select("Team B");
            cy.get('input[name="date"]').type("2026-06-01T15:00");
            cy.get('button[type="submit"]').click();

            // Manage Lineup
            cy.visit("/dashboard/admin/leagues/1/fixtures/1/lineup");
            cy.contains("Starting XI").should("be.visible");

            // Manage Goals
            cy.visit("/dashboard/admin/leagues/1/fixtures/1/goals");
            cy.contains("Add Goal").click();

            // Manage Summary
            cy.visit("/dashboard/admin/leagues/1/fixtures/1/summary");
            cy.contains("Create Summary").should("exist");

            // Manage Images
            cy.visit("/dashboard/admin/leagues/1/fixtures/1/images");
            cy.contains("Upload Image").should("exist");
        });
    });
});
