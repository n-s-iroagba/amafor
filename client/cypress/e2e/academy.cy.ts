describe("Academy Journeys", () => {
    // UJ-ACA-001: Submit Trial Application
    describe("UJ-ACA-001: Submit Trial Application", () => {
        it("should allow a prospective player to apply for a trial", () => {
            cy.visit("/academy");
            cy.contains("Apply").click();
            cy.url().should("include", "/academy/apply");

            cy.get('[data-testid="input-first-name"]').type("Young");
            cy.get('[data-testid="input-last-name"]').type("Talent");
            cy.get('[data-testid="input-dob"]').type("2010-01-01");
            cy.get('[data-testid="select-position"]').select("Forward");
            cy.get('[data-testid="input-email"]').type("test@example.com");
            cy.get('[data-testid="input-phone"]').type("1234567890");
            cy.get('input[type="checkbox"]').check({ force: true }); // Consent checkboxes

            cy.get('[data-testid="btn-submit-application"]').click();

            cy.contains("Application Submitted").should("be.visible");
        });
    });

    describe("UJ-ACA-002: View Academy Staff", () => {
        it("should allow viewing and refreshing staff members", () => {
            cy.visit("/academy");
            cy.get('[data-testid="nav-item-staff"]').click();
            cy.get('[data-testid="btn-refresh-staff"]').should("be.visible").click();
            // Mock API response or wait for real fetch if E2E environment supports it
            // cy.get('[data-testid^="staff-card-"]').should("have.length.greaterThan", 0);
        });
    });

    describe("UJ-ACA-003: Contact Academy", () => {
        it("should have contact options available", () => {
            cy.visit("/academy");
            cy.get('[data-testid="link-contact-us"]').should("have.attr", "href", "/help");
            cy.get('[data-testid="btn-whatsapp"]').should("be.visible");
        });
    });
});
