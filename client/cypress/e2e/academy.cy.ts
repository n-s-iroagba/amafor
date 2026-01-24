describe("Academy Journeys", () => {
    // UJ-ACA-001: Submit Trial Application
    describe("UJ-ACA-001: Submit Trial Application", () => {
        it("should allow a prospective player to apply for a trial", () => {
            cy.visit("/academy");
            cy.contains("Apply").click();
            cy.url().should("include", "/academy/apply");

            cy.get('input[name="fullName"]').type("Young Talent");
            cy.get('input[name="dob"]').type("2010-01-01");
            cy.get('select[name="position"]').select("Forward");
            cy.get('input[name="videoUrl"]').type("https://youtube.com/example");

            cy.get('button[type="submit"]').click();

            cy.contains("application submitted").should("be.visible");
        });
    });
});
