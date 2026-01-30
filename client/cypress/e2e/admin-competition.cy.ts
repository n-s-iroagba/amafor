describe("Admin Competition Journeys", () => {
    beforeEach(() => {
        cy.login("sports_admin@example.com", "password");
    });

    // UJ-ADM-001: Manage Leagues
    describe("UJ-ADM-001: Manage Leagues", () => {
        it("should allow managing leagues", () => {
            cy.visit("/dashboard/admin/leagues");
            cy.get('[data-testid="btn-create-league"]').click();
            cy.url().should("include", "/leagues/new");

            cy.get('[data-testid="input-league-name"]').type("Premier League 2026/27");
            cy.get('[data-testid="input-league-season"]').type("2026/27");
            cy.get('[data-testid="btn-save-league"]').click();

            // Manage statistics
            cy.get('[data-testid^="league-row-"]').first().within(() => {
                // Proceed to detail then stats
                cy.get('a[href*="/leagues/"]').click();
            });
            cy.contains("Standings").should("be.visible");
        });

        it("should allow editing a league", () => {
            cy.visit("/dashboard/admin/leagues");
            cy.get('[data-testid^="league-row-"]').first().within(() => {
                cy.get('[data-testid="btn-edit-league"]').click();
            });
            cy.get('[data-testid="input-league-name"]').clear().type("Updated League Name");
            cy.get('[data-testid="btn-update-league"]').click();
        });
    });

    // UJ-ADM-002: Manage Fixtures
    describe("UJ-ADM-002: Manage Fixtures", () => {
        it("should allow managing fixtures", () => {
            // Navigate to first league fixtures
            cy.visit("/dashboard/admin/leagues");
            cy.get('[data-testid^="league-row-"]').first().within(() => {
                cy.get('[data-testid="btn-view-fixtures"]').click();
            });

            cy.get('[data-testid="btn-create-fixture"]').click();

            // Using select by testid if possible, or fallback
            cy.get('[data-testid="select-home-team"]').select(1);
            cy.get('[data-testid="select-away-team"]').select(2);
            cy.get('[data-testid="input-fixture-date"]').type("2026-06-01T15:00");
            cy.get('[data-testid="btn-save-fixture"]').click();

            // Manage Goals
            cy.get('[data-testid^="fixture-row-"]').first().within(() => {
                cy.get('[data-testid="btn-manage-goals"]').click();
            });
            cy.get('[data-testid="input-goal-scorer"]').type("Player X");
            cy.get('[data-testid="input-goal-minute"]').type("45");
            cy.get('[data-testid="btn-add-goal"]').click();
        });
    });
});
