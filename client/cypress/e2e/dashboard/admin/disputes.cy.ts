
describe('Admin Dashboard - Disputes', () => {
    beforeEach(() => {
        // Mock Auth
        cy.setCookie('token', 'mock-token');
        cy.intercept('GET', '**/auth/me', {
            statusCode: 200,
            body: {
                user: {
                    id: 'admin_1',
                    email: 'admin@example.com',
                    role: 'admin',
                    name: 'Test Admin'
                }
            }
        }).as('getMe');
    });

    it('should list disputes and resolve one', () => {
        const disputeId = 'case_999';

        // Mock Admin Disputes List
        cy.intercept('GET', '**/disputes/admin/all*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: disputeId,
                        subject: 'Campaign Issue',
                        status: 'open',
                        createdAt: new Date().toISOString(),
                        advertiser: { name: 'Advertiser A', email: 'adv@test.com' }
                    }
                ]
            }
        }).as('getAdminDisputes');

        cy.visit('/dashboard/admin/disputes');
        cy.wait('@getAdminDisputes');

        cy.get(`[data-testid="dispute-row-${disputeId}"]`).should('be.visible');
        cy.contains('Campaign Issue').should('be.visible');
        cy.contains('Advertiser A').should('be.visible');

        // Navigate to Detail
        // Mock Detail View (Common Route)
        cy.intercept('GET', `**/disputes/${disputeId}`, {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: disputeId,
                    subject: 'Campaign Issue',
                    description: 'Something went wrong.',
                    status: 'open',
                    createdAt: new Date().toISOString(),
                    advertiser: { name: 'Advertiser A', email: 'adv@test.com' }
                }
            }
        }).as('getDisputeDetail');

        cy.get(`[data-testid="dispute-row-${disputeId}"]`).click();
        cy.wait('@getDisputeDetail');

        // Resolve
        cy.get('[data-testid="dispute-status-header"]').should('contain', 'open');

        // Mock Resolve Action
        cy.intercept('PUT', `**/disputes/admin/${disputeId}/resolve`, {
            statusCode: 200,
            body: { success: true }
        }).as('resolveDispute');

        // The page basically reloads or updates status on success
        // We'll mock the reload by intercepting the GET again with new status if needed, 
        // but typically we just check the call was made.

        cy.get('[data-testid="textarea-resolution"]').type('Resolved by Admin.');
        cy.get('[data-testid="radio-status-resolved"]').click(); // Ensure "Resolve" is selected
        cy.get('[data-testid="btn-submit-resolution"]').click();

        cy.wait('@resolveDispute').then((interception) => {
            expect(interception.request.body).to.deep.equal({
                adminResponse: 'Resolved by Admin.',
                status: 'resolved'
            });
        });
    });
});
