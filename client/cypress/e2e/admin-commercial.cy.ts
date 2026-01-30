describe("Admin Commercial Journeys", () => {
    beforeEach(() => {
        cy.login("commercial_manager@example.com", "password");
    });

    // UJ-ADM-010: Manage Scouts (Applications)
    describe("UJ-ADM-010: Manage Scouts", () => {
        it("should allow managing scout applications", () => {
            cy.visit("/dashboard/admin/scouts");
            cy.get('[data-testid="scout-application-card"]').first().click();
            cy.get('[data-testid="link-view-dossier"]').should("exist");
        });
    });

    // UJ-ADM-011: Manage Advertisers
    describe("UJ-ADM-011: Manage Advertisers", () => {
        it("should allow managing advertisers", () => {
            cy.visit("/dashboard/admin/advertisers");
            cy.get('[data-testid="advertiser-app-card"]').first().click();
            cy.get('[data-testid="btn-authorize-advertiser"]').should("be.visible");
            cy.get('[data-testid="btn-deny-advertiser"]').should("be.visible");
        });
    });

    // UJ-ADM-012: Manage Patrons
    describe("UJ-ADM-012: Manage Patrons", () => {
        it("should allow managing patrons", () => {
            cy.visit("/dashboard/admin/patrons");
            cy.get('[data-testid="btn-add-patron"]').click();

            cy.get('[data-testid="input-patron-name"]').type("VIP Patron");
            cy.get('[data-testid="input-patron-position"]').type("Donor");
            cy.get('[data-testid="btn-save-patron"]').click();

            // Edit
            cy.get('[data-testid="patron-card"]').first().click();
            cy.visit("/dashboard/admin/patrons/1/edit"); // Assuming ID 1
            cy.get('[data-testid="input-patron-name"]').should("have.value", "VIP Patron");
        });
    });

    // UJ-ADM-015: Manage Subscriptions
    describe("UJ-ADM-015: Manage Subscriptions", () => {
        it("should allow managing subscriptions", () => {
            cy.visit("/dashboard/admin/subscriptions");
            cy.get('[data-testid="btn-create-subscription"]').click();

            cy.get('[data-testid="select-subscription-tier"]').select("PLATINUM");
            cy.get('[data-testid="input-subscription-amount"]').type("50000");
            cy.get('[data-testid="btn-save-subscription"]').click();

            // Edit
            cy.get('[data-testid="sub-plan-card"]').first().within(() => {
                cy.get('[data-testid="btn-edit-plan"]').click();
            });
            cy.get('[data-testid="input-subscription-amount"]').clear().type("60000");
            cy.get('[data-testid="btn-update-subscription"]').click();
        });
    });
});
