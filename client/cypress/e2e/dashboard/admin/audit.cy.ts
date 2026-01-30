
describe('Admin Dashboard - Audit Trail', () => {
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

    it('should list audit logs and allow export', () => {
        // Mock Audit List
        cy.intercept('GET', '**/system/audit*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 'log_1',
                        action: 'LOGIN',
                        entityType: 'User',
                        entityId: 'user_1',
                        userId: 'user_1',
                        userName: 'John Doe',
                        timestamp: new Date().toISOString(),
                        ipAddress: '127.0.0.1'
                    },
                    {
                        id: 'log_2',
                        action: 'DELETE',
                        entityType: 'Campaign',
                        entityId: 'camp_99',
                        userId: 'admin_1',
                        userName: 'Test Admin',
                        timestamp: new Date().toISOString(),
                        ipAddress: '127.0.0.1'
                    }
                ]
            }
        }).as('getAuditLogs');

        cy.visit('/dashboard/admin/audit');
        cy.wait('@getAuditLogs');

        // Verify Rows
        cy.get('[data-testid="audit-log-row"]').should('have.length', 2);
        cy.contains('LOGIN').should('be.visible');
        cy.contains('DELETE').should('be.visible');
        cy.contains('John Doe').should('be.visible');

        // Test Export Flow
        cy.intercept('POST', '**/system/audit/export', {
            statusCode: 200,
            body: 'mock-csv-content',
            headers: { 'content-type': 'text/csv' }
        }).as('exportAudit');

        // Input dates
        cy.get('[data-testid="input-date-from"]').type('2024-01-01');
        cy.get('[data-testid="input-date-to"]').type('2024-12-31');

        // Click export
        cy.get('[data-testid="btn-export-audit"]').click();

        cy.wait('@exportAudit').then((interception) => {
            expect(interception.request.body).to.include({
                dateFrom: '2024-01-01',
                dateTo: '2024-12-31',
                format: 'csv'
            });
        });
    });
});
