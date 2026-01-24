describe("Admin People Management Journeys", () => {
    beforeEach(() => {
        cy.login("sports_admin@example.com", "password");
    });

    // UJ-ADM-003: Manage Players
    describe("UJ-ADM-003: Manage Players", () => {
        it("should allow managing players", () => {
            cy.visit("/dashboard/admin/players");
            cy.contains("New Player").click();

            cy.get('input[name="firstName"]').type("John");
            cy.get('input[name="lastName"]').type("Doe");
            cy.get('select[name="position"]').select("Midfielder");
            cy.get('button[type="submit"]').click();
        });
    });

    // UJ-ADM-004: Manage Coaches
    describe("UJ-ADM-004: Manage Coaches", () => {
        it("should allow managing coaches", () => {
            cy.visit("/dashboard/admin/coaches");
            cy.contains("New Coach").click();

            cy.get('input[name="name"]').type("Coach Smith");
            cy.get('select[name="role"]').select("Head Coach");
            cy.get('button[type="submit"]').click();
        });
    });

    // UJ-ADM-005: Manage Academy
    describe("UJ-ADM-005: Manage Academy", () => {
        it("should allow managing academy staff and trialists", () => {
            // Trialists
            cy.visit("/dashboard/admin/academy/trialist");
            cy.get('[data-testid="trialist-row"]').first().click();
            cy.contains("Review Application").should("be.visible");

            // Staff
            cy.visit("/dashboard/admin/academy/staff");
            cy.contains("New Staff").click();
            cy.get('input[name="name"]').type("Academy Coach");
            cy.get('button[type="submit"]').click();
        });
    });

    // UJ-ADM-006: Manage Patrons
    describe("UJ-ADM-006: Manage Patrons", () => {
        it("should allow managing patrons", () => {
            cy.visit("/dashboard/admin/patrons");
            cy.get('[data-testid="patron-row"]').should("exist");
        });
    });
});
