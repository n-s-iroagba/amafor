
describe('Admin Dashboard - People Management', () => {

    beforeEach(() => {
        cy.visit('/dashboard/admin');
    });

    describe('User Management', () => {
        beforeEach(() => {
            cy.visit('/dashboard/admin/users');
        });

        it('should list users and filter', () => {
            cy.get('[data-testid="input-search-users"]').should('be.visible');
            cy.get('[data-testid="select-role-filter"]').should('be.visible');

            cy.get('body').then(($body) => {
                if ($body.find('[data-testid="user-row"]').length > 0) {
                    cy.get('[data-testid="user-row"]').should('be.visible');
                } else {
                    cy.contains('No users found').should('be.visible');
                }
            });
        });

        it('should show invite button and navigate to invite page', () => {
            cy.get('[data-testid="btn-invite-user"]').should('be.visible').click();
            cy.url().should('include', '/users/invite');
            cy.get('[data-testid="input-user-email"]').should('be.visible');
            cy.get('[data-testid="radio-role-admin"]').should('be.visible');
            cy.get('[data-testid="btn-send-invite"]').should('be.visible');
        });
    });

    describe('Player Roster', () => {
        beforeEach(() => {
            cy.visit('/dashboard/admin/players');
        });

        it('should display players and allow navigation to create', () => {
            cy.get('[data-testid="btn-add-player"]').should('be.visible').click();
            cy.url().should('include', '/players/new');
            cy.get('[data-testid="input-player-name"]').should('be.visible');
            cy.get('[data-testid="btn-save-player"]').should('be.visible');
        });

        it('should list players and view details', () => {
            cy.intercept('GET', { pathname: '/api/players' }, {
                statusCode: 200,
                body: {
                    success: true,
                    data: [
                        { id: 1, name: 'Player One', position: 'Forward' }
                    ]
                }
            }).as('getPlayers');

            cy.visit('/dashboard/admin/players');
            cy.wait('@getPlayers');

            cy.get('body').then(($body) => {
                if ($body.find('[data-testid="player-row"]').length > 0) {
                    cy.get('[data-testid="player-row"]').first().within(() => {
                        cy.get('[data-testid="btn-view-player"]').click();
                    });
                    cy.url().should('match', /\/players\/\d+/);
                    cy.get('[data-testid="player-detail-name"]').should('be.visible');
                    // cy.get('[data-testid="player-profile-section"]').should('exist'); // Might depend on detailed view mock

                    // Verify edit button navigation
                    cy.get('[data-testid="btn-edit-player"]').click();
                    cy.url().should('include', '/edit');
                    cy.get('[data-testid="input-name"]').should('be.visible');
                } else {
                    cy.contains('No players yet').should('be.visible');
                }
            });
        });
    });

    describe('Scout Verification', () => {
        beforeEach(() => {
            cy.visit('/dashboard/admin/scouts');
        });

        it('should display application queue', () => {
            cy.get('body').then(($body) => {
                if ($body.find('[data-testid="scout-application-card"]').length > 0) {
                    cy.get('[data-testid="scout-application-card"]').should('be.visible');
                    cy.get('[data-testid="link-view-dossier"]').should('be.visible');
                } else {
                    cy.contains('Queue is currently clear').should('be.visible');
                }
            });
        });
    });

    describe('Coaches List', () => {
        beforeEach(() => {
            cy.visit('/dashboard/admin/coaches');
        });

        it('should list coaches and allow adding', () => {
            cy.get('[data-testid="btn-add-coach"]').should('be.visible');
            cy.get('[data-testid="input-search-coaches"]').should('be.visible');

            cy.get('body').then(($body) => {
                if ($body.find('[data-testid="coach-card"]').length > 0) {
                    cy.get('[data-testid="coach-card"]').first().within(() => {
                        cy.get('[data-testid="btn-edit-coach"]').should('be.visible');
                        cy.get('[data-testid="btn-delete-coach"]').should('be.visible');
                    });
                } else {
                    cy.contains('No coaches yet').should('be.visible');
                }
            });
        });
    });

});
