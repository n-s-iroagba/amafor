
describe('Scout Dashboard - Reports Vault', () => {
    beforeEach(() => {
        // Mock Auth
        cy.setCookie('token', 'mock-token');
        cy.intercept('GET', '**/auth/me', {
            statusCode: 200,
            body: {
                user: {
                    id: 'scout_1',
                    email: 'scout@example.com',
                    role: 'scout',
                    name: 'Test Scout',
                    isApproved: true
                }
            }
        }).as('getMe');
    });

    it('should list saved reports and allow deletion', () => {
        // Mock Reports List
        cy.intercept('GET', '**/scout/reports', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 'rep_1',
                        player: 'Player One',
                        type: 'Match Report',
                        date: '2025-01-01'
                    }
                ]
            }
        }).as('getReports');

        cy.visit('/dashboard/scout/reports');
        cy.wait('@getReports');

        cy.contains('Saved Scout Reports').should('be.visible');
        cy.get('[data-testid="report-row-rep_1"]').should('be.visible');
        cy.contains('Player One').should('be.visible');

        // Test Deletion Mock
        cy.intercept('DELETE', '**/scout/reports/rep_1', {
            statusCode: 200,
            body: { success: true }
        }).as('deleteReport');

        // Trigger delete
        cy.get('[data-testid="btn-delete-report-rep_1"]').click();
        cy.wait('@deleteReport');

        // Since the UI optimistically updates or re-fetches, we can check calls
        // In this specific component implementation, it calls refetch() after delete.
        // We can just verify the delete call happened.
    });
});
