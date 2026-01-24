describe("Admin Commercial Journeys", () => {
    beforeEach(() => {
        cy.login("commercial_manager@example.com", "password");
    });

    // UJ-ADM-010: Manage Scouts (Applications)
    describe("UJ-ADM-010: Manage Scouts", () => {
        it("should allow managing scout applications", () => {
            cy.visit("/dashboard/admin/scouts");
            cy.get('[data-testid="scout-application-row"]').first().click();
            cy.contains("Approve").should("exist"); // Or Reject
        });
    });

    // UJ-ADM-011: Manage Advertisers
    describe("UJ-ADM-011: Manage Advertisers", () => {
        it("should allow managing advertisers", () => {
            cy.visit("/dashboard/admin/advertisers");
            cy.get('[data-testid="advertiser-row"]').first().click();
            cy.contains("Advertiser Details").should("be.visible");
        });
    });
});
