describe("Scout Dashboard Journeys", () => {
    // UJ-SCT-001: Scout Dashboard
    describe("UJ-SCT-001: Scout Dashboard", () => {
        it("should allow a scout to access dashboard features", () => {
            cy.login("scout@example.com", "password");
            cy.visit("/dashboard/scout");

            // Check for pending status if applicable, or simulate approved scout
            cy.contains("Scout Dashboard").should("be.visible");

            // Browse Players
            cy.visit("/dashboard/scout/players");
            cy.get('[data-testid^="player-card-"]').should("have.length.greaterThan", 0);
            cy.get('[data-testid^="player-card-"]').first().click();
            cy.url().should("include", "/dashboard/scout/players/");

            // Match Analysis
            cy.visit("/dashboard/scout/matches");
            cy.get('[data-testid^="match-card-"]').first().click();
            cy.url().should("include", "/dashboard/scout/matches/");
            // Check for analysis components

            // Reports
            cy.visit("/dashboard/scout/reports");
            cy.contains("New Report").should("exist");
        });
    });
});
