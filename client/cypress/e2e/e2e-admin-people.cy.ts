/**
 * ============================================================
 * E2E TEST SUITE — ADMIN: PEOPLE & TEAM MANAGEMENT
 * Journeys: UJ-ADM-003, UJ-ADM-004, UJ-ADM-006, UJ-ADM-007,
 *           UJ-ADM-010, UJ-ADM-013
 *
 * SERVER RESPONSE SHAPES (from PlayerController, AcademyStaffController, UserController, PatronageController):
 *   GET  /players           → { success, results: N, data: Player[] }
 *   POST /players           → 201 { success, data: Player }
 *   GET  /players/:id       → { success, data: Player }
 *   PUT  /players/:id       → { success, data: Player }  (updateStats)
 *   DELETE /players/:id     → inferred: { success, message }
 *   GET  /academy-staff     → { success, data: AcademyStaff[] }  ← FLAT array in data
 *   POST /academy-staff     → 201 { success, data: AcademyStaff, message }
 *   GET  /academy-staff/:id → { success, data: AcademyStaff }
 *   PUT  /academy-staff/:id → { success, data: AcademyStaff, message }
 *   DELETE /academy-staff/:id → { success, message: 'Staff member deleted successfully' }
 *   GET  /users             → { success, data: User[] }
 *   PUT  /users/:id         → { success, data: User }
 *   PUT  /users/:id/verify  → { success, data: User }
 *   POST /auth/invite       → 201 (response from authService.inviteUser)
 *   GET  /patrons           → { success, data: Patron[] }
 *   POST /patrons           → custom (admin add)
 *   GET  /patrons/packages  → { success, data: PatronSubscriptionPackage[] }
 *   GET  /auth/me           → AuthUser (no wrapper)
 *
 * Teams endpoints inferred from admin team management page:
 *   GET  /teams             → { success, data: Team[] }
 *   POST /teams             → { success, data: Team }
 *   GET  /teams/:id         → { success, data: Team }
 *   PUT  /teams/:id         → { success, data: Team }
 *   POST /teams/:id/players → { success, data }
 *   POST /teams/:id/players/remove → { success, data }
 *
 * User model: id, email, firstName, lastName, role, status, emailVerified, metadata
 * UserStatus: 'active' | 'pending_verification' | 'suspended'
 * UserRole: 'admin' | 'scout' | 'advertiser'
 * Player: id, name, dateOfBirth, position, height, nationality, jerseyNumber, imageUrl, status, joinedDate
 * AcademyStaff: id, name, role, bio, initials, imageUrl, category, qualifications, yearsOfExperience
 * Patron: id, name, email, phoneNumber, imageUrl, bio
 * PatronSubscriptionPackage: id, tier, frequency, miniumumAmount, benefits
 * ============================================================
 */

const adminMe = () =>
    cy.intercept('GET', '**/api/auth/me*', {
        statusCode: 200,
        body: { id: 'adm1', email: 'admin@test.com', firstName: 'Admin', lastName: 'User', role: 'admin', status: 'active', emailVerified: true },
    });
const superAdminMe = () =>
    cy.intercept('GET', '**/api/auth/me*', {
        statusCode: 200,
        body: { id: 'adm1', email: 'super@test.com', firstName: 'Super', lastName: 'Admin', role: 'admin', status: 'active', emailVerified: true },
    });

const player = { id: 'p1', name: 'Chidera Nwosu', dateOfBirth: '2005-06-15', position: 'Forward', height: 178, nationality: 'Nigerian', jerseyNumber: 9, imageUrl: '/p1.jpg', status: 'active', joinedDate: '2024-01-01' };
const coach = { id: 'c1', name: 'Coach Obi', role: 'Head Coach', bio: 'Experienced', initials: 'CO', imageUrl: '/c.jpg', category: 'Coaching', qualifications: ['UEFA B'], yearsOfExperience: 10 };
const team = { id: 'tm1', name: 'Amafor First XI', description: 'Senior squad', active: true, playerCount: 0 };
const patron = { id: 'pat1', name: 'Chief Emeka', email: 'chief@test.com', phoneNumber: '08012345678', imageUrl: null, bio: 'Supporter' };

// ─────────────────────────────────────────────────────────────
// UJ-ADM-003 — Player Management
// SRS: REQ-PCH-01 | Screens: SC-069..SC-072
// ─────────────────────────────────────────────────────────────
describe('UJ-ADM-003 — Player Management', () => {
    describe('Happy Path', () => {
        it('E2E-ADM-003-H01: Player list — GET /players returns { success, results, data: Player[] }', () => {
            adminMe();
            cy.intercept('GET', '**/api/players*', { statusCode: 200, body: { success: true, results: 1, data: [player] } }).as('getPlayers');

            cy.visit('/dashboard/admin/players');
            cy.wait('@getPlayers');
            cy.get('[data-testid="btn-add-player"]').should('be.visible');
            cy.contains(player.name).should('be.visible');
        });

        it('E2E-ADM-003-H02: Create player — POST /players → 201 { success, data: Player }', () => {
            adminMe();
            cy.intercept('GET', '**/api/players*', { body: { success: true, results: 0, data: [] } });
            cy.intercept('POST', '**/api/players*', {
                statusCode: 201, body: { success: true, data: { ...player, id: 'p_new', name: 'Ikenna Eze' } },
            }).as('createPlayer');

            cy.visit('/dashboard/admin/players/new');
            cy.get('input[name="name"]').type('Ikenna Eze');
            cy.get('input[name="jerseyNumber"]').type('10');
            cy.get('[data-testid="btn-save-player"]').click();

            cy.wait('@createPlayer').its('request.body.name').should('eq', 'Ikenna Eze');
        });

        it('E2E-ADM-003-H03: Edit player — PUT /players/:id returns { success, data: Player }', () => {
            adminMe();
            cy.intercept('GET', `/players/${player.id}*`, { body: { success: true, data: player } }).as('getPlayer');
            cy.intercept('PUT', `/players/${player.id}*`, { statusCode: 200, body: { success: true, data: { ...player, name: 'Chidera A. Nwosu' } } }).as('updatePlayer');

            cy.visit(`/dashboard/admin/players/${player.id}/edit`);
            cy.wait('@getPlayer');
            cy.get('input[name="name"]').clear().type('Chidera A. Nwosu');
            cy.get('[data-testid="btn-edit-player"], [data-testid="btn-save-player"]').click();
            cy.wait('@updatePlayer').its('response.body.data.name').should('eq', 'Chidera A. Nwosu');
        });

        it('E2E-ADM-003-H04: Delete player — DELETE /players/:id → { success, message }', () => {
            adminMe();
            cy.intercept('GET', '**/api/players*', { body: { success: true, results: 1, data: [player] } });
            cy.intercept('DELETE', `/players/${player.id}*`, {
                statusCode: 200, body: { success: true, message: 'Player deleted successfully' },
            }).as('deletePlayer');

            cy.visit('/dashboard/admin/players');
            cy.get('[data-testid="btn-delete-player"]').first().click();
            cy.get('[data-testid="btn-confirm-delete"]').click();
            cy.wait('@deletePlayer');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-ADM-004 — Coach Management
// SRS: REQ-PCH-02 | Screens: SC-034..SC-037
// AcademyStaffController: list → { success, data: Staff[] } NOT { data: { data } }
// ─────────────────────────────────────────────────────────────
describe('UJ-ADM-004 — Coach Management', () => {
    describe('Happy Path', () => {
        it('E2E-ADM-004-H01: Coach list — GET /academy-staff returns { success, data: AcademyStaff[] }', () => {
            adminMe();
            cy.intercept('GET', '**/api/academy-staff*', { statusCode: 200, body: { success: true, data: [coach] } }).as('getCoaches');

            cy.visit('/dashboard/admin/coaches');
            cy.wait('@getCoaches');
            cy.get('[data-testid="btn-add-coach"]').should('be.visible');
            cy.contains(coach.name).should('be.visible');
        });

        it('E2E-ADM-004-H02: Create coach — POST /academy-staff → 201 { success, data: AcademyStaff, message }', () => {
            adminMe();
            cy.intercept('POST', '**/api/academy-staff*', {
                statusCode: 201,
                body: { success: true, data: { ...coach, id: 'c_new', name: 'New Coach' }, message: 'Staff member created successfully' },
            }).as('createCoach');

            cy.visit('/dashboard/admin/coaches/new');
            cy.get('input[name="name"]').type('New Coach');
            cy.get('[data-testid="btn-save-coach"]').click();
            cy.wait('@createCoach').its('response.body.message').should('eq', 'Staff member created successfully');
        });

        it('E2E-ADM-004-H03: Edit coach — PUT /academy-staff/:id → { success, data, message: "Staff member updated successfully" }', () => {
            adminMe();
            cy.intercept('GET', `/academy-staff/${coach.id}*`, { body: { success: true, data: coach } }).as('getCoach');
            cy.intercept('PUT', `/academy-staff/${coach.id}*`, {
                statusCode: 200,
                body: { success: true, data: { ...coach, name: 'Coach E. Obi' }, message: 'Staff member updated successfully' },
            }).as('updateCoach');

            cy.visit(`/dashboard/admin/coaches/${coach.id}/edit`);
            cy.wait('@getCoach');
            cy.get('input[name="name"]').clear().type('Coach E. Obi');
            cy.get('[data-testid="btn-edit-coach"], [data-testid="btn-save-coach"]').click();
            cy.wait('@updateCoach').its('response.body.message').should('eq', 'Staff member updated successfully');
        });

        it('E2E-ADM-004-H04: Delete coach — DELETE /academy-staff/:id → { success, message: "Staff member deleted successfully" }', () => {
            adminMe();
            cy.intercept('GET', '**/api/academy-staff*', { body: { success: true, data: [coach] } });
            cy.intercept('DELETE', `/academy-staff/${coach.id}*`, {
                statusCode: 200, body: { success: true, message: 'Staff member deleted successfully' },
            }).as('deleteCoach');

            cy.visit('/dashboard/admin/coaches');
            cy.get('[data-testid="btn-delete-coach"]').first().click();
            cy.get('[data-testid="btn-confirm-delete"]').click();
            cy.wait('@deleteCoach').its('response.body.message').should('eq', 'Staff member deleted successfully');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-ADM-006 — User & Permissions Management
// SRS: REQ-USR-01, REQ-USR-02 | Screens: SC-073..SC-075
// UserController: list → { success, data: User[] }; invite → POST /auth/invite
// ─────────────────────────────────────────────────────────────
describe('UJ-ADM-006 — User & Permissions Management', () => {
    const user1 = { id: 'u1', email: 'staff@test.com', firstName: 'Staff', lastName: 'User', role: 'admin', status: 'active', emailVerified: true, metadata: {} };

    describe('Happy Path', () => {
        it('E2E-ADM-006-H01: User list — GET /users returns { success, data: User[] }', () => {
            adminMe();
            cy.intercept('GET', '**/api/users*', { statusCode: 200, body: { success: true, data: [user1] } }).as('getUsers');

            cy.visit('/dashboard/admin/users');
            cy.wait('@getUsers');
            cy.contains(user1.email).should('be.visible');
            cy.get('[data-testid="btn-invite-user"]').should('be.visible');
        });

        it('E2E-ADM-006-H02: Invite user — POST /auth/invite returns 201 with message', () => {
            adminMe();
            cy.intercept('GET', '**/api/users*', { body: { success: true, data: [] } });
            cy.intercept('POST', '**/api/auth/invite*', {
                statusCode: 201,
                body: { success: true, message: 'Invitation sent', data: { email: 'newstaff@test.com', role: 'admin' } },
            }).as('inviteUser');

            cy.visit('/dashboard/admin/users/invite');
            cy.get('input[name="email"]').type('newstaff@test.com');
            cy.get('select[name="role"]').select('admin');
            cy.get('[data-testid="btn-invite-user"]').click();

            cy.wait('@inviteUser').its('request.body.email').should('eq', 'newstaff@test.com');
            cy.contains(/invitation sent/i).should('be.visible');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-ADM-007 — Patron Administration
// SRS: REQ-SYS-02 | Screens: SC-064..SC-066, SC-068, SC-079..SC-081
// PatronageController: GET /patrons → { success, data: Patron[] }
// ─────────────────────────────────────────────────────────────
describe('UJ-ADM-007 — Patron Administration', () => {
    describe('Happy Path', () => {
        it('E2E-ADM-007-H01: Patron list — GET /patrons returns { success, data: Patron[] }', () => {
            adminMe();
            cy.intercept('GET', '**/api/patrons*', { statusCode: 200, body: { success: true, data: [patron] } }).as('getPatrons');
            cy.intercept('GET', '**/api/patrons/packages*', { body: { success: true, data: [] } });

            cy.visit('/dashboard/admin/patrons');
            cy.wait('@getPatrons');
            cy.contains(patron.name).should('be.visible');
            cy.get('[data-testid="btn-add-patron"]').should('be.visible');
        });

        it('E2E-ADM-007-H02: Packages list — GET /patrons/packages returns { success, data: Package[] } with miniumumAmount', () => {
            adminMe();
            cy.intercept('GET', '**/api/patrons/packages*', {
                body: {
                    success: true, data: [
                        { id: 'pkg1', tier: 'Sponsor', frequency: 'monthly', miniumumAmount: 50000, benefits: [] },
                    ],
                },
            }).as('getPlans');

            cy.visit('/dashboard/admin/subscriptions');
            cy.wait('@getPlans');
            cy.get('[data-testid="btn-create-subscription"]').should('be.visible');
        });

        it('E2E-ADM-007-H03: Update patron status — PUT /patrons/:id returns { success, message, data: Patron }', () => {
            adminMe();
            cy.intercept('GET', `/patrons/${patron.id}*`, { body: { success: true, data: patron } }).as('getPatron');
            cy.intercept('PUT', `/patrons/${patron.id}*`, {
                statusCode: 200, body: { success: true, message: 'Patron status updated successfully', data: { ...patron, active: false } },
            }).as('updatePatron');

            cy.visit(`/dashboard/admin/patrons/${patron.id}`);
            cy.wait('@getPatron');
            cy.get('[data-testid="btn-deactivate-patron"]').click();
            cy.wait('@updatePatron').its('response.body.message').should('eq', 'Patron status updated successfully');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-ADM-010 — Scout Approval
// SRS: REQ-USR-03 | Screens: SC-099, SC-100
// UserStatus enum: 'active' | 'pending_verification' | 'suspended'
// PUT /users/:id/verify → { success, data: User }
// ─────────────────────────────────────────────────────────────
describe('UJ-ADM-010 — Scout Approval', () => {
    const scout = { id: 'sc1', email: 'scout@test.com', firstName: 'Tolu', lastName: 'Bello', role: 'scout', status: 'pending_verification', emailVerified: false, metadata: {} };

    describe('Happy Path', () => {
        it('E2E-ADM-010-H01: Scout list — GET /users returns { success, data: User[] } with pending scouts', () => {
            adminMe();
            cy.intercept('GET', '**/api/users*', { statusCode: 200, body: { success: true, data: [scout] } }).as('getScouts');

            cy.visit('/dashboard/admin/scouts');
            cy.wait('@getScouts');
            cy.contains(scout.email).should('be.visible');
        });

        it('E2E-ADM-010-H02: Approve scout — PUT /users/:id/verify → { success, data: User } with status=active', () => {
            superAdminMe();
            cy.intercept('GET', '**/api/users*', { body: { success: true, data: [scout] } });
            cy.intercept('GET', `/users/${scout.id}*`, { body: { success: true, data: scout } }).as('getScout');
            cy.intercept('PUT', `/users/${scout.id}/verify*`, {
                statusCode: 200,
                body: { success: true, data: { ...scout, status: 'active', emailVerified: true } },
            }).as('approveScout');

            cy.visit(`/dashboard/admin/scouts/${scout.id}`);
            cy.wait('@getScout');
            cy.contains(/approve/i).click();
            cy.wait('@approveScout').its('response.body.data.status').should('eq', 'active');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-ADM-013 — Team Management
// SRS: REQ-TM-01..REQ-TM-08 | Screens: SC-126..SC-130
// ─────────────────────────────────────────────────────────────
describe('UJ-ADM-013 — Team Management', () => {
    describe('Happy Path: Team CRUD', () => {
        it('E2E-ADM-013-H01: Team list — GET /teams returns { success, data: Team[] }', () => {
            adminMe();
            cy.intercept('GET', '**/api/teams*', { statusCode: 200, body: { success: true, data: [team] } }).as('getTeams');

            cy.visit('/dashboard/admin/teams');
            cy.wait('@getTeams');
            cy.contains(team.name).should('be.visible');
            cy.get('[data-testid="btn-new-team"]').should('be.visible');
        });

        it('E2E-ADM-013-H02: Create team — POST /teams → { success, data: Team }', () => {
            adminMe();
            cy.intercept('GET', '**/api/teams*', { body: { success: true, data: [] } });
            cy.intercept('POST', '**/api/teams*', {
                statusCode: 201, body: { success: true, data: { ...team, id: 'tm_new' } },
            }).as('createTeam');

            cy.visit('/dashboard/admin/teams/new');
            cy.get('input[name="name"]').type('Amafor First XI');
            cy.get('textarea[name="description"]').type('Senior squad');
            cy.get('button[type="submit"]').click();

            cy.wait('@createTeam').its('request.body.name').should('eq', 'Amafor First XI');
        });

        it('E2E-ADM-013-H03: Deactivating team with players blocked by PUT /teams/:id → 409', () => {
            adminMe();
            cy.intercept('GET', `/teams/${team.id}*`, { body: { success: true, data: { ...team, players: [{ id: 'p1' }] } } });
            cy.intercept('PUT', `/teams/${team.id}*`, {
                statusCode: 409, body: { success: false, message: 'Cannot deactivate team with active players' },
            }).as('blockDeactivate');

            cy.visit(`/dashboard/admin/teams/${team.id}/edit`);
            cy.get('input[type="checkbox"][name="active"], input[name="status"]').first().uncheck({ force: true });
            cy.get('button[type="submit"]').click();

            cy.wait('@blockDeactivate');
            cy.contains(/active players|cannot deactivate/i).should('be.visible');
        });
    });

    describe('Happy Path: Player Assignment', () => {
        it('E2E-ADM-013-H04: Player assignment page uses GET /teams/:id + GET /players (unassigned)', () => {
            adminMe();
            cy.intercept('GET', `/teams/${team.id}*`, { body: { success: true, data: { ...team, players: [] } } }).as('getTeam');
            cy.intercept('GET', '**/api/players*', { body: { success: true, results: 1, data: [{ ...player, teamId: null }] } }).as('getPlayers');

            cy.visit(`/dashboard/admin/teams/${team.id}/players`);
            cy.wait('@getTeam');
            cy.wait('@getPlayers');
            cy.get('[data-testid="btn-promote-player"]').should('be.visible');
        });

        it('E2E-ADM-013-H05: Assign player — POST /teams/:id/players returns { success, data }', () => {
            adminMe();
            cy.intercept('GET', `/teams/${team.id}*`, { body: { success: true, data: { ...team, players: [] } } });
            cy.intercept('GET', '**/api/players*', { body: { success: true, results: 1, data: [player] } });
            cy.intercept('POST', `/teams/${team.id}/players*`, {
                statusCode: 201, body: { success: true, data: { playerId: 'p1', teamId: team.id } },
            }).as('assignPlayer');

            cy.visit(`/dashboard/admin/teams/${team.id}/players`);
            cy.get('[data-testid="btn-promote-player"]').first().click();
            cy.wait('@assignPlayer').its('response.body.data.teamId').should('eq', team.id);
        });

        it('E2E-ADM-013-H06: Remove player — POST /teams/:id/players/remove returns { success, data }', () => {
            adminMe();
            cy.intercept('GET', `/teams/${team.id}*`, { body: { success: true, data: { ...team, players: [player] } } });
            cy.intercept('GET', '**/api/players*', { body: { success: true, results: 0, data: [] } });
            cy.intercept('POST', `/teams/${team.id}/players/remove*`, {
                statusCode: 200, body: { success: true, data: {} },
            }).as('removePlayer');

            cy.visit(`/dashboard/admin/teams/${team.id}/players`);
            cy.contains(/remove/i).first().click({ force: true });
            cy.wait('@removePlayer');
        });

        it('E2E-ADM-013-H07: Player already on another team blocked with 409 (BR-TM-03)', () => {
            adminMe();
            cy.intercept('GET', `/teams/tm2*`, { body: { success: true, data: { ...team, id: 'tm2', players: [] } } });
            cy.intercept('GET', '**/api/players*', { body: { success: true, results: 1, data: [{ ...player, teamId: 'tm1' }] } });
            cy.intercept('POST', `/teams/tm2/players*`, {
                statusCode: 409, body: { success: false, message: 'Player already assigned to another team. Transfer required.' },
            }).as('blockAssign');

            cy.visit('/dashboard/admin/teams/tm2/players');
            cy.get('[data-testid="btn-promote-player"]').first().click({ force: true });
            cy.wait('@blockAssign');
            cy.contains(/already assigned|transfer required/i).should('be.visible');
        });
    });

    describe('Authorization', () => {
        it('E2E-ADM-013-A01: Non-admin cannot access team management', () => {
            cy.intercept('GET', '**/api/auth/me*', { body: { id: 'u1', email: 'adv@test.com', firstName: 'Adv', lastName: 'User', role: 'advertiser', status: 'active', emailVerified: true } });
            cy.visit('/dashboard/admin/teams');
            cy.url().should('include', '/auth/login')
                .or(cy.contains(/unauthorized|access denied/i).should('be.visible'));
        });
    });
});
