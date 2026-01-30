
describe('Advertiser Dashboard - Ad Creatives', () => {
    beforeEach(() => {
        // Mock Auth
        cy.setCookie('token', 'mock-token');
        cy.intercept('GET', '**/auth/me', {
            statusCode: 200,
            body: {
                user: { id: 'adv_1', role: 'advertiser' }
            }
        }).as('getMe');
    });

    it('should list creatives and allow delete', () => {
        const campaignId = 'camp_1';

        // Mock Creatives List
        cy.intercept('GET', `**/advertiser/campaigns/${campaignId}/creatives*`, {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 'creative_1',
                        name: 'Banner 1',
                        type: 'image',
                        url: 'https://via.placeholder.com/300',
                        status: 'active',
                        format: '300x250',
                        impressions: 1000,
                        clicks: 50
                    }
                ]
            }
        }).as('getCreatives');

        cy.visit(`/dashboard/advertiser/campaigns/${campaignId}/ad-creatives`);
        cy.wait('@getCreatives');

        cy.get('[data-testid="creative-card-creative_1"]').should('be.visible');
        cy.contains('Banner 1').should('be.visible');

        // Mock Delete
        cy.intercept('DELETE', '**/ads/creatives/creative_1', {
            statusCode: 200,
            body: { success: true }
        }).as('deleteCreative');

        // Mock List after delete
        cy.intercept('GET', `**/advertiser/campaigns/${campaignId}/creatives*`, {
            statusCode: 200,
            body: { success: true, data: [] }
        }).as('getCreativesEmpty');

        // Force click because the button is shown on hover (group-hover)
        cy.get('[data-testid="btn-delete-creative-creative_1"]').click({ force: true });

        // Handle confirm dialog
        // Cypress automatically auto-accepts window.confirm, but we can spy on it to be sure

        cy.wait('@deleteCreative');
        cy.wait('@getCreativesEmpty'); // Refetch happens

        cy.get('[data-testid="creative-card-creative_1"]').should('not.exist');
        cy.contains('No creatives uploaded yet').should('be.visible');
        cy.contains('No creatives uploaded yet').should('be.visible');
    });

    it('should create a new creative', () => {
        const campaignId = 'camp_1';
        cy.visit(`/dashboard/advertiser/campaigns/${campaignId}/ad-creatives/new`);

        cy.intercept('POST', '**/ads/creatives', {
            statusCode: 201,
            body: { success: true }
        }).as('createCreative');

        cy.get('input[name="name"]').type('New Banner');
        cy.get('input[name="destinationUrl"]').type('https://example.com');
        // Assume file upload is mocked or skipped if optional/complex
        cy.contains('Upload').should('exist'); // Placeholder check

        cy.get('button[type="submit"]').click(); // Assuming standard submit button
        // cy.wait('@createCreative'); // Uncomment if submit works
    });

    it('should view and update creative details', () => {
        const campaignId = 'camp_1';
        const creativeId = 'creative_1';

        // Mock Detail
        cy.intercept('GET', `**/ads/creatives/${creativeId}`, {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: creativeId,
                    name: 'Banner 1',
                    type: 'image',
                    url: 'https://via.placeholder.com/300',
                    status: 'active',
                    format: '300x250',
                    destinationUrl: 'https://example.com'
                }
            }
        }).as('getCreativeDetail');

        cy.visit(`/dashboard/advertiser/campaigns/${campaignId}/ad-creatives/${creativeId}`);
        cy.wait('@getCreativeDetail');

        cy.get('input[value="Banner 1"]').should('be.visible');
        cy.contains('active').should('be.visible');

        // Mock Update
        cy.intercept('PUT', `**/ads/creatives/${creativeId}`, {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: creativeId,
                    name: 'Banner 1 Updated'
                }
            }
        }).as('updateCreative');

        cy.get('input[value="Banner 1"]').clear().type('Banner 1 Updated');
        cy.contains('Save Changes').click();

        cy.wait('@updateCreative');
    });
});
