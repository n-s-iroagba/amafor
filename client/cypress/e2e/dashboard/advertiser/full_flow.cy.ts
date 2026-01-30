describe('Advertiser Dashboard Full Flow', () => {
    beforeEach(() => {
        // Login as advertiser
        cy.login('advertiser@amafor.com', 'password123'); // Adjust credentials as needed for mock
        cy.visit('/dashboard/advertiser');
    });

    it('should allow creating a new campaign', () => {
        // Navigate to Campaigns
        cy.get('[href="/dashboard/advertiser/campaigns"]').first().click();
        cy.url().should('include', '/dashboard/advertiser/campaigns');

        // Check list page
        cy.get('[data-testid="btn-create-campaign"]').should('be.visible').click();
        cy.url().should('include', '/new');

        // Step 1: Select Zone
        cy.get('[data-testid^="zone-option-"]').first().click();
        cy.contains('CONTINUE').click();

        // Step 2: Upload Creative (Skip/Mock)
        cy.get('[data-testid="dropzone-creative"]').should('be.visible');
        // For now we just skip or continue if allowed, or mock file upload if strictly required
        // Assuming optional or we can proceed
        cy.contains('CONTINUE').click();

        // Step 3: Targeting
        cy.get('[data-testid="tag-option-Football News"]').click();
        cy.contains('CONTINUE').click();

        // Step 4: Budget
        cy.get('[data-testid="input-target-views"]').clear().type('5000');
        cy.get('[data-testid="btn-submit-campaign"]').click();

        // Should redirect to detail
        cy.url().should('match', /\/dashboard\/advertiser\/campaigns\/[a-zA-Z0-9-]+/);
        cy.get('h1').should('contain', 'Campaign');
    });

    it('should manage an existing campaign', () => {
        cy.visit('/dashboard/advertiser/campaigns');
        // Click first campaign
        cy.get('[data-testid^="campaign-card-"]').first().click();

        // Check detail elements
        cy.get('[data-testid="btn-toggle-status"]').should('be.visible');
        cy.get('[data-testid="stat-delivered-views"]').should('exist');

        // Toggle status
        cy.get('[data-testid="btn-toggle-status"]').click();
        // Verify status change (text change)
        cy.get('[data-testid="btn-toggle-status"]').invoke('text').then((text) => {
            if (text.includes('RESUME')) {
                cy.get('[data-testid="badge-campaign-status"]').should('contain', 'paused');
            } else {
                cy.get('[data-testid="badge-campaign-status"]').should('contain', 'active');
            }
        });
    });

    it('should file a dispute', () => {
        cy.visit('/dashboard/advertiser/disputes');
        cy.get('[data-testid="input-search-disputes"]').should('be.visible');

        cy.get('[data-testid="btn-open-dispute"]').click();
        cy.url().should('include', '/new');

        cy.get('[data-testid="select-campaign"]').select(0); // Select first option
        cy.get('[data-testid="input-subject"]').type('Test Dispute Subject');
        cy.get('[data-testid="textarea-description"]').type('This is a test dispute description.');
        cy.get('[data-testid="btn-submit-dispute"]').click();

        // Should redirect back to list
        cy.url().should('include', '/dashboard/advertiser/disputes');
    });

    it('should view reports', () => {
        cy.visit('/dashboard/advertiser/reports');
        cy.get('[data-testid="btn-export-reports"]').should('be.visible');
        cy.get('[data-testid="select-date-range"]').should('have.value', 'Last 30 Days');

        // Check if table exists (even if empty)
        cy.get('table').should('exist');
    });
});
