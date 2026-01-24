describe("Utility Journeys", () => {
    // UJ-UTL-001: Get Help & Support
    describe("UJ-UTL-001: Get Help & Support", () => {
        it("should allow a user to access help", () => {
            cy.visit("/help");
            cy.contains("Help Center").should("be.visible");
            // Check for FAQ items
            cy.get('[data-testid="faq-item"]').should("have.length.greaterThan", 0);
        });
    });

    // UJ-UTL-002: View Legal Pages
    describe("UJ-UTL-002: View Legal Pages", () => {
        it("should allow a user to view legal documents", () => {
            // Privacy
            cy.visit("/privacy");
            cy.contains("Privacy Policy").should("be.visible");

            // Terms
            cy.visit("/terms");
            cy.contains("Terms of Service").should("be.visible");

            // Compliance
            cy.visit("/compliance");
            cy.contains("Compliance").should("be.visible");

            // Data Request (GDPR/Compliance)
            cy.visit("/privacy/data-request");
            cy.get('input[name="email"]').type("user@example.com");
            cy.get('select[name="requestType"]').select("Export Data");
            cy.get('button[type="submit"]').click();

            cy.contains("request received").should("be.visible");
        });
    });
});
