describe("Advertiser Journeys", () => {
    // UJ-ADV-001: Register as Advertiser
    describe("UJ-ADV-001: Register as Advertiser", () => {
        it("should allow a business to register", () => {
            cy.visit("/advertise/register");
            cy.get('input[name="companyName"]').type("Acme Corp");
            cy.get('input[name="contactPerson"]').type("John Doe");
            cy.get('input[name="email"]').type(`advertiser-${Date.now()}@example.com`);

            cy.get('button[type="submit"]').click();

            cy.contains("registration pending").should("be.visible");
        });
    });

    // UJ-ADV-002: Manage Ad Campaigns
    describe("UJ-ADV-002: Manage Ad Campaigns", () => {
        it("should allow an advertiser to manage campaigns", () => {
            cy.login("advertiser@example.com", "password"); // Custom command needed
            cy.visit("/dashboard/advertiser");

            // Create new campaign
            cy.contains("New Campaign").click();
            cy.url().should("include", "/campaigns/new");

            cy.get('input[name="name"]').type("Summer Sale");
            cy.get('input[name="budget"]').type("1000");
            cy.get('button[type="submit"]').click();

            // Verify campaign created
            cy.contains("Summer Sale").should("be.visible");

            // Manage Ad Creatives
            cy.contains("Manage Creatives").click();
            cy.url().should("include", "/ad-creatives");

            // Upload creative (mocking file upload might be needed)
            // cy.get('input[type="file"]').attachFile('ad-image.jpg'); 

            // Raise Dispute
            cy.visit("/dashboard/advertiser/disputes");
            cy.contains("New Dispute").click();
            cy.get('input[name="subject"]').type("Billing Error");
            cy.get('button[type="submit"]').click();

            // View Reports
            cy.visit("/dashboard/advertiser/reports");
            cy.get("canvas").should("be.visible"); // Assuming a chart exists
        });
    });
});
