
describe('Advertiser Dashboard - Campaigns', () => {
    beforeEach(() => {
        // Mock Auth
        cy.setCookie('token', 'mock-token');
        cy.intercept('GET', '**/auth/me', {
            statusCode: 200,
            body: {
                user: {
                    id: 'adv_1',
                    email: 'advertiser@example.com',
                    role: 'advertiser',
                    name: 'Test Advertiser'
                }
            }
        }).as('getMe');
    });

    it('should list campaigns and allow filter + search', () => {
        // Mock Campaigns List
        cy.intercept('GET', '**/advertiser/campaigns*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 'camp_1',
                        name: 'Summer Sale',
                        status: 'active',
                        viewsDelivered: 5000,
                        targetViews: 10000,
                        spent: 50000,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 'camp_2',
                        name: 'Winter Promo',
                        status: 'completed',
                        viewsDelivered: 10000,
                        targetViews: 10000,
                        spent: 100000,
                        createdAt: new Date().toISOString()
                    }
                ]
            }
        }).as('getCampaigns');

        cy.visit('/dashboard/advertiser/campaigns');
        cy.wait('@getCampaigns');

        cy.get('[data-testid^="campaign-card-"]').should('have.length', 2);
        cy.contains('Summer Sale').should('be.visible');

        // Filter
        cy.get('[data-testid="filter-btn-active"]').click();
        cy.get('[data-testid^="campaign-card-"]').should('have.length', 1);
        cy.contains('Winter Promo').should('not.exist');

        // Search
        cy.get('[data-testid="filter-btn-all"]').click();
        cy.get('[data-testid="input-search-campaigns"]').type('Winter');
        cy.get('[data-testid^="campaign-card-"]').should('have.length', 1);
        cy.contains('Summer Sale').should('not.exist');
        cy.contains('Winter Promo').should('be.visible');
    });

    it('should create a new campaign', () => {
        // Mock Zones
        cy.intercept('GET', '**/ads/zones*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 'zone_1',
                        name: 'Homepage Banner',
                        pricePerView: 5,
                        dimensions: '728x90',
                        description: 'Top banner on home'
                    }
                ]
            }
        }).as('getZones');

        cy.visit('/dashboard/advertiser/campaigns/new');
        cy.wait('@getZones');

        // Step 1: Select Zone
        cy.get('[data-testid="zone-option-zone_1"]').click();
        cy.contains('CONTINUE').click();

        // Step 2: Upload (Skip for now as it's optional in UI or mocked)
        cy.contains('CONTINUE').click();

        // Step 3: Targeting
        cy.get('[data-testid="tag-option-Football News"]').click();
        cy.contains('CONTINUE').click();

        // Step 4: Budget
        cy.get('[data-testid="input-target-views"]').clear().type('2000');
        // Check total calculation if visible
        cy.contains('₦10,000').should('exist'); // 2000 * 5

        // Mock Create
        cy.intercept('POST', '**/advertiser/campaigns', {
            statusCode: 201,
            body: {
                success: true,
                data: {
                    id: 'camp_new',
                    name: 'Homepage Banner Campaign',
                    status: 'draft'
                }
            }
        }).as('createCampaign');

        cy.get('[data-testid="btn-submit-campaign"]').click();
        cy.wait('@createCampaign');

        // Should redirect to detail
        cy.url().should('include', '/dashboard/advertiser/campaigns/camp_new');
    });

    it('should view campaign details', () => {
        cy.intercept('GET', '**/advertiser/campaigns/camp_1', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 'camp_1',
                    name: 'Summer Sale',
                    status: 'active',
                    viewsDelivered: 5000,
                    targetViews: 10000,
                    spent: 50000,
                    createdAt: new Date().toISOString()
                }
            }
        }).as('getCampaignDetail');

        cy.visit('/dashboard/advertiser/campaigns/camp_1');
        cy.wait('@getCampaignDetail');
        cy.contains('Summer Sale').should('be.visible');
        cy.contains('active').should('be.visible');
    });
});
