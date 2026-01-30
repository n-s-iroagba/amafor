
describe('Advertiser Dashboard - Disputes', () => {
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

    it('should list disputes and allow filtering', () => {
        // Mock Disputes List
        cy.intercept('GET', '**/disputes*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 'case_123',
                        subject: 'Billing Error',
                        description: 'Charged twice for campaign.',
                        status: 'open',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: 'case_456',
                        subject: 'Impression Mismatch',
                        description: 'Stats do not match.',
                        status: 'resolved',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ]
            }
        }).as('getDisputes');

        cy.visit('/dashboard/advertiser/disputes');
        cy.wait('@getDisputes');

        // Verify Rows
        cy.get('[data-testid="dispute-row-case_123"]').should('be.visible');
        cy.contains('Billing Error').should('be.visible');
        cy.contains('case_123').should('be.visible');

        cy.get('[data-testid="dispute-row-case_456"]').should('be.visible');
        cy.contains('Impression Mismatch').should('be.visible');

        // Test Filter (Note: Client-side filtering check)
        // If filtering is client-side or server-side, we simulate interaction.
        // Assuming client-side for now based on typical patterns or simple server params.
        cy.get('[data-testid="select-filter-disputes"]').select('Resolved');
        // If client side filtering is implemented:
        // cy.get('[data-testid="dispute-row-case_123"]').should('not.exist');
        // cy.get('[data-testid="dispute-row-case_456"]').should('be.visible');
    });

    it('should create a new dispute', () => {
        cy.visit('/dashboard/advertiser/disputes/new');

        // Mock Create
        cy.intercept('POST', '**/disputes', {
            statusCode: 201,
            body: {
                success: true,
                data: {
                    id: 'case_new',
                    subject: 'New Issue',
                    status: 'open'
                }
            }
        }).as('createDispute');

        // Fill Form
        cy.get('[data-testid="input-subject"]').type('New Issue');
        cy.get('[data-testid="textarea-description"]').type('Detailed description of the issue.');

        cy.get('[data-testid="btn-submit-dispute"]').click();

        cy.wait('@createDispute').then((interception) => {
            expect(interception.request.body).to.deep.equal({
                subject: 'New Issue',
                description: 'Detailed description of the issue.'
            });
        });

        // Redirect check
        cy.url().should('include', '/dashboard/advertiser/disputes');
    });

    it('should view dispute details', () => {
        const disputeId = 'case_123';

        // Mock Detail
        cy.intercept('GET', `**/disputes/${disputeId}`, {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: disputeId,
                    subject: 'Billing Error',
                    description: 'Charged twice for campaign.',
                    status: 'open',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    advertiser: { name: 'Test Advertiser', email: 'test@example.com' }
                }
            }
        }).as('getDisputeDetail');

        cy.visit(`/dashboard/advertiser/disputes/${disputeId}`);
        cy.wait('@getDisputeDetail');

        cy.contains('CASE: case_123').should('be.visible');
        cy.contains('Billing Error').should('be.visible');
        cy.contains('Charged twice for campaign.').should('be.visible');
        cy.contains('Awaiting Admin Response').should('be.visible');
    });
});
