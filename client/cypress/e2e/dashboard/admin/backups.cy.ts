
describe('Admin Dashboard - Backups', () => {
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

    it('should list backups, create new one, and delete', () => {
        // Mock Backup List
        cy.intercept('GET', '**/system/backups*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 'bk_1',
                        name: 'backup-2024-01-01',
                        createdAt: new Date().toISOString(),
                        size: '50MB',
                        status: 'completed',
                        type: 'full'
                    }
                ]
            }
        }).as('getBackups');

        cy.visit('/dashboard/admin/backups');
        cy.wait('@getBackups');

        cy.get('[data-testid="backup-row"]').should('have.length', 1);
        cy.contains('backup-2024-01-01').should('be.visible');

        // Mock Create
        cy.intercept('POST', '**/system/backups', {
            statusCode: 201,
            body: {
                success: true,
                data: {
                    id: 'bk_new',
                    name: 'backup-new',
                    createdAt: new Date().toISOString(),
                    size: '10MB',
                    status: 'in_progress',
                    type: 'full'
                }
            }
        }).as('createBackup');

        // Refetch after create
        cy.intercept('GET', '**/system/backups*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    { id: 'bk_1', name: 'backup-2024-01-01', createdAt: new Date().toISOString(), size: '50MB', status: 'completed', type: 'full' },
                    { id: 'bk_new', name: 'backup-new', createdAt: new Date().toISOString(), size: '10MB', status: 'in_progress', type: 'full' }
                ]
            }
        }).as('getBackupsAfterCreate');

        cy.get('[data-testid="btn-create-backup"]').click();
        cy.wait('@createBackup');
        cy.wait('@getBackupsAfterCreate');

        cy.get('[data-testid="backup-row"]').should('have.length', 2);

        // Mock Delete
        cy.intercept('DELETE', '**/system/backups/bk_1', {
            statusCode: 200,
            body: { success: true }
        }).as('deleteBackup');

        // Refetch after delete
        cy.intercept('GET', '**/system/backups*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    { id: 'bk_new', name: 'backup-new', createdAt: new Date().toISOString(), size: '10MB', status: 'in_progress', type: 'full' }
                ]
            }
        }).as('getBackupsAfterDelete');

        // Mock window.confirm
        cy.on('window:confirm', () => true);

        // Click delete on first item (bk_1)
        cy.get('[data-testid="btn-delete-backup"]').first().click();
        cy.wait('@deleteBackup');
        cy.wait('@getBackupsAfterDelete');

        cy.get('[data-testid="backup-row"]').should('have.length', 1);
        cy.contains('backup-2024-01-01').should('not.exist');
    });
});
