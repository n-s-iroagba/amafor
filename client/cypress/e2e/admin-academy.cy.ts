describe("Admin Academy Journeys", () => {
    beforeEach(() => {
        cy.login("academy_admin@example.com", "password");
    });

    // UJ-ADM-013: Manage Academy Staff
    describe("UJ-ADM-013: Manage Academy Staff", () => {
        it("should allow managing academy staff", () => {
            cy.visit("/dashboard/admin/academy/staff");

            // Create New Staff
            cy.get('[data-testid="btn-add-academy-staff"]').click();
            cy.url().should("include", "/academy/staff/new");

            cy.get('[data-testid="input-staff-name"]').type("Coach Carter");
            cy.get('[data-testid="input-staff-role"]').type("Head Coach");
            cy.get('[data-testid="select-staff-category"]').select("coaching");
            cy.get('[data-testid="btn-save-staff"]').click();

            // Verify and Edit
            cy.get('[data-testid^="academy-staff-item-"]').first().click(); // Should navigate to details
            // If details page is not clicked but edit button on card is used:
            // cy.get('[data-testid^="academy-staff-item-"]').first().find('[data-testid="btn-edit-staff"]').click(); 
            // The previous test assumed clicking the item opens details, then clicked edit. 
            // Let's assume detail view first:
            cy.get('[data-testid="btn-edit-staff"]').click();
            cy.get('[data-testid="input-staff-name"]').clear().type("Coach Carter (Updated)");
            cy.get('[data-testid="btn-update-staff"]').click();
        });
    });

    // UJ-ADM-014: Manage Trialists
    describe("UJ-ADM-014: Manage Trialists", () => {
        it("should allow managing trialists", () => {
            cy.visit("/dashboard/admin/academy/trialist");

            // Create New Trialist
            cy.get('[data-testid="btn-add-trialist"]').click();
            cy.url().should("include", "/academy/trialist/new");

            cy.get('[data-testid="input-trialist-firstname"]').type("New");
            cy.get('[data-testid="input-trialist-lastname"]').type("Talent");
            cy.get('[data-testid="input-trialist-email"]').type("talent@example.com");
            cy.get('[data-testid="input-trialist-phone"]').type("08012345678");
            cy.get('[data-testid="input-trialist-dob"]').type("2005-01-01");
            cy.get('[data-testid="select-trialist-position"]').select("Striker");
            cy.get('[data-testid="btn-save-trialist"]').click();

            // Verify and Edit
            cy.get('[data-testid^="trialist-row-"]').first().within(() => {
                cy.get('[data-testid="btn-view-trialist"]').click(); // Actually "View" link
            });
            // Detail page
            cy.get('[data-testid="btn-edit-trialist"]').should('be.visible').click();
            // Edit page
            cy.get('[data-testid="input-trialist-firstname"]').clear().type("New (Signed)");
            cy.get('[data-testid="btn-update-trialist"]').click();
        });
    });
});
