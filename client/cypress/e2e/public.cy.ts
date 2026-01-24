describe("Public Content Journeys", () => {
    // UJ-PUB-001: Browse Fixtures
    describe("UJ-PUB-001: Browse Fixtures", () => {
        it("should allow a fan to browse fixtures", () => {
            cy.visit("/fixtures");
            cy.get("h1").should("contain", "Fixtures"); // Adjust selector
            // Check for list of fixtures
            cy.get('[data-testid="fixture-item"]').should("have.length.greaterThan", 0);

            // Click on a fixture
            cy.get('[data-testid="fixture-item"]').first().click();
            cy.url().should("include", "/fixtures/");
            cy.get("h1").should("be.visible"); // Match details header
        });
    });

    // UJ-PUB-002: Browse News
    describe("UJ-PUB-002: Browse News", () => {
        it("should allow a fan to browse news", () => {
            cy.visit("/news");
            cy.get("h1").should("contain", "News");

            // Check for news items
            cy.get('[data-testid="news-item"]').should("have.length.greaterThan", 0);

            // Click on a news item
            cy.get('[data-testid="news-item"]').first().click();
            cy.url().should("include", "/news/");
            cy.get("article").should("be.visible");
        });
    });

    // UJ-PUB-003: View Team & Players
    describe("UJ-PUB-003: View Team & Players", () => {
        it("should allow a fan to view the team and player profiles", () => {
            cy.visit("/team");
            cy.contains("Team").should("be.visible");

            // Check for players
            cy.get('[data-testid="player-card"]').should("have.length.greaterThan", 0);

            // Click on a player
            cy.get('[data-testid="player-card"]').first().click();
            cy.url().should("include", "/player/");
            cy.get("h1").should("be.visible"); // Player name
        });
    });

    // UJ-PUB-004: View League Statistics
    describe("UJ-PUB-004: View League Statistics", () => {
        it("should allow a fan to view league statistics", () => {
            cy.visit("/league-statistics");
            cy.contains("League Statistics").should("be.visible");

            // Check for league items or table
            cy.get('[data-testid="league-item"]').first().click();
            cy.url().should("include", "/league-statistics/");
            cy.get("table").should("be.visible"); // Standings table
        });
    });

    // UJ-PUB-005: View Fixture Gallery
    describe("UJ-PUB-005: View Fixture Gallery", () => {
        it("should allow a fan to view fixture galleries", () => {
            cy.visit("/gallery");
            cy.contains("Gallery").should("be.visible");

            cy.get('[data-testid="gallery-item"]').first().click();
            cy.url().should("include", "/gallery/");
            // Check for images
            cy.get("img").should("have.length.greaterThan", 0);
        });
    });

    // UJ-PUB-006: Pro View (Scout Registration)
    describe("UJ-PUB-006: Pro View (Scout Registration)", () => {
        it("should allow a scout to apply for pro view", () => {
            cy.visit("/pro-view");
            cy.contains("Apply").click();
            cy.url().should("include", "/pro-view/apply");

            // Fill application
            cy.get('input[name="fullName"]').type("Scout Candidate");
            cy.get('input[name="email"]').type(`scout-${Date.now()}@example.com`);
            cy.get('input[name="organization"]').type("Scout Org");
            cy.get('input[name="socialUrl"]').type("https://linkedin.com/in/scout");
            cy.get('textarea[name="reason"]').type("Looking for talent");

            // Submit
            cy.get('button[type="submit"]').click();

            // Check success
            cy.contains("application has been submitted").should("be.visible");
        });
    });
});
