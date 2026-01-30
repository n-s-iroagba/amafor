
describe('Admin Dashboard - Coaches Management', () => {
    beforeEach(() => {
        // Mock Auth
        cy.setCookie('token', 'mock-token');
        cy.intercept('GET', '**/api/auth/me', {
            statusCode: 200,
            body: {
                user: {
                    id: 'admin_1',
                    email: 'admin@example.com',
                    role: 'admin',
                    name: 'Admin User'
                }
            }
        }).as('getMe');

        // Mock Video Upload signature
        cy.intercept('POST', '**/videos/upload/signature', {
            statusCode: 200,
            body: { signature: 'mock_sig', timestamp: 1234567890, cloudName: 'demo', apiKey: '123' }
        }).as('getUploadSig');
    });

    it('should list coaches and allow search', () => {
        cy.intercept('GET', '**/academy-staff*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 'coach_1',
                        name: 'Coach Carter',
                        role: 'Head Coach',
                        category: 'coaching',
                        imageUrl: 'https://via.placeholder.com/150',
                        bio: 'Legendary coach',
                        createdAt: new Date().toISOString()
                    }
                ],
                totalPages: 1
            }
        }).as('getCoaches');

        cy.visit('/dashboard/admin/coaches');
        cy.wait('@getCoaches');

        cy.get('[data-testid="coach-card"]').should('have.length', 1);
        cy.contains('Coach Carter').should('be.visible');
    });

    it('should create a new coach', () => {
        cy.intercept('GET', '**/academy-staff*', { body: { data: [] } }).as('getEmpty');
        cy.visit('/dashboard/admin/coaches');
        cy.wait('@getEmpty');

        cy.get('[data-testid="btn-add-coach"]').click();

        // Mock Create
        cy.intercept('POST', '**/academy-staff', {
            statusCode: 201,
            body: {
                success: true,
                data: { id: 'coach_new', name: 'New Coach' }
            }
        }).as('createCoach');

        cy.get('[data-testid="input-coach-name"]').type('New Coach');
        cy.get('[data-testid="select-coach-role"]').select('Head Coach');
        cy.get('[data-testid="textarea-coach-bio"]').type('Bio info');

        cy.get('[data-testid="btn-save-coach"]').click();
        cy.wait('@createCoach');
        cy.url().should('include', '/dashboard/admin/coaches');
    });

    it('should edit a coach', () => {
        cy.intercept('GET', '**/academy-staff/coach_1*', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 'coach_1',
                    name: 'Coach Carter',
                    role: 'Head Coach',
                    bio: 'Legendary coach',
                    category: 'coaching',
                    imageUrl: 'https://via.placeholder.com/150'
                }
            }
        }).as('getCoachDetail');

        cy.visit('/dashboard/admin/coaches/coach_1/edit');
        cy.wait('@getCoachDetail');

        // Mock Update
        cy.intercept('PUT', '**/academy-staff/coach_1', {
            statusCode: 200,
            body: { success: true, data: { id: 'coach_1', name: 'Coach Carter Updated' } }
        }).as('updateCoach');

        cy.get('[data-testid="input-coach-name"]').clear().type('Coach Carter Updated');
        cy.get('[data-testid="btn-update-coach"]').click();
        cy.wait('@updateCoach');
    });

    it('should delete a coach', () => {
        cy.intercept('GET', '**/academy-staff*', {
            statusCode: 200,
            body: {
                success: true,
                data: [{ id: 'coach_1', name: 'Coach Carter' }]
            }
        }).as('getCoaches');

        cy.visit('/dashboard/admin/coaches');
        cy.wait('@getCoaches');

        // Mock Delete
        cy.intercept('DELETE', '**/academy-staff/coach_1', {
            statusCode: 200,
            body: { success: true }
        }).as('deleteCoach');

        cy.contains('Delete').click();
        // Assuming there is a confirmation or direct delete. 
    });

    it('should view coach details', () => {
        cy.intercept('GET', '**/academy-staff/coach_1', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 'coach_1',
                    name: 'Coach Carter',
                    role: 'Head Coach',
                    bio: 'Details view',
                    imageUrl: 'https://via.placeholder.com/150'
                }
            }
        }).as('getCoachView');

        cy.visit('/dashboard/admin/coaches/coach_1');
        cy.wait('@getCoachView');

        cy.contains('Coach Carter').should('be.visible');
        cy.contains('Details view').should('be.visible');
    });
});
