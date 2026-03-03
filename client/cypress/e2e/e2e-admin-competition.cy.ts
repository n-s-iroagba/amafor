/**
 * ============================================================
 * E2E TEST SUITE — ADMIN COMPETITION (LEAGUES & FIXTURES)
 * Journeys: UJ-ADM-001, UJ-ADM-002
 *
 * SERVER RESPONSE SHAPES:
 *   GET  /leagues                  → { success, data: League[] }
 *   POST /leagues                  → { success, data: League }
 *   GET  /leagues/:id              → { success, data: League }
 *   PUT  /leagues/:id              → { success, data: League }
 *   DELETE /leagues/:id            → { success, message: 'League deleted successfully' }
 *   GET  /leagues/:id/statistics   → ← via LeagueStatisticsController
 *     (meta returns { success, message, data, meta: { total, page, totalPages, limit } })
 *   PUT  /league-stats/:id         → { success, message: 'Statistics updated successfully', data: statistics }
 *
 *   GET  /fixtures                 → { success, results, data: Fixture[] }  (FixtureController.listMatches)
 *   GET  /fixtures/one/:id         → { success, data: Fixture }             (getMatch)
 *   POST /fixtures/:leagueId       → 201 { success, data: Fixture }
 *   PUT  /fixtures/:id             → { success, data: Fixture }
 *   DELETE /fixtures/:id           → { success, message: 'Fixture deleted successfully' }
 *
 *   ⚠️  GoalController returns RAW objects (no { success, data } wrapper):
 *   GET  /goals/fixture/:id        → Goal[]  (raw array, no wrapper)
 *   POST /goals                    → 201 Goal (raw, no wrapper)
 *   GET  /goals/:id                → Goal (raw, no wrapper)
 *   PUT  /goals/:id                → Goal (raw, no wrapper)
 *   DELETE /goals/:id              → 204 (no body)
 *
 *   ⚠️  LineupController returns RAW objects (no { success, data } wrapper):
 *   GET  /lineups/:fixtureId       → [] or Lineup (raw)
 *   POST /lineups                  → 201 LineupPlayer (raw)
 *
 *   GET  /match-summaries/fixture/:id → { success, data: MatchSummary }
 *   POST /match-summaries/:fixtureId  → { success, data: MatchSummary }
 *   GET  /match-gallery/:fixtureId    → FixtureImage[] (via FixtureImageController — raw)
 *
 * League fields: id, name, season, isFriendly
 * Fixture fields: id, matchDate, homeTeam, awayTeam, leagueId, venue, status,
 *   homeScore, awayScore, attendance, referee, weather, metadata
 * Goal fields: id, fixtureId, scorer, minute, isPenalty
 * ============================================================
 */

const adminMe = () =>
    cy.intercept('GET', '**/api/auth/me*', {
        statusCode: 200,
        body: { id: 'adm1', email: 'admin@test.com', firstName: 'Admin', lastName: 'User', role: 'admin', status: 'active', emailVerified: true },
    });

const league = { id: 'lg1', name: 'Anambra State League', season: '2025/26', isFriendly: false };
const fixture = { id: 'fix1', matchDate: '2026-04-01T15:00:00Z', homeTeam: 'Amafor FC', awayTeam: 'Rivers FC', leagueId: 'lg1', venue: 'Amafor Stadium', status: 'scheduled', homeScore: null, awayScore: null, attendance: null, referee: 'Mr. Eze', weather: 'Sunny', metadata: {} };
const goal = { id: 'gol1', fixtureId: 'fix1', scorer: 'Chidera', minute: 34, isPenalty: false };

// ─────────────────────────────────────────────────────────────
// UJ-ADM-001 — Manage Leagues & Statistics
// BR: BR-CE-02 | SRS: REQ-FIX-01, REQ-FIX-02
// ─────────────────────────────────────────────────────────────
describe('UJ-ADM-001 — Manage Leagues & Statistics', () => {
    describe('Happy Path: League CRUD', () => {
        it('E2E-ADM-001-H01: League list — GET /leagues returns { success, data: League[] }', () => {
            adminMe();
            cy.intercept('GET', '**/api/leagues*', { statusCode: 200, body: { success: true, data: [league] } }).as('getLeagues');

            cy.visit('/dashboard/admin/leagues');
            cy.wait('@getLeagues');
            cy.get('[data-testid="btn-create-league"]').should('be.visible');
            cy.contains(league.name).should('be.visible');
        });

        it('E2E-ADM-001-H02: Create league — POST /leagues → { success, data: League }', () => {
            adminMe();
            cy.intercept('GET', '**/api/leagues*', { body: { success: true, data: [] } });
            cy.intercept('POST', '**/api/leagues*', {
                statusCode: 201,
                body: { success: true, data: { id: 'lg_new', name: 'New League', season: '2026/27', isFriendly: false } },
            }).as('createLeague');

            cy.visit('/dashboard/admin/leagues/new');
            cy.get('input[name="name"]').type('New League');
            cy.get('input[name="season"]').type('2026/27');
            cy.get('[data-testid="btn-save-league"]').click();

            cy.wait('@createLeague').its('request.body.name').should('eq', 'New League');
        });

        it('E2E-ADM-001-H03: Edit league — PUT /leagues/:id returns { success, data: League }', () => {
            adminMe();
            cy.intercept('GET', `/leagues/${league.id}*`, { body: { success: true, data: league } }).as('getLeague');
            cy.intercept('PUT', `/leagues/${league.id}*`, { statusCode: 200, body: { success: true, data: { ...league, name: 'Updated League' } } }).as('updateLeague');

            cy.visit(`/dashboard/admin/leagues/${league.id}/edit`);
            cy.wait('@getLeague');
            cy.get('input[name="name"]').clear().type('Updated League');
            cy.get('[data-testid="btn-save-league"]').click();
            cy.wait('@updateLeague').its('response.body.data.name').should('eq', 'Updated League');
        });

        it('E2E-ADM-001-H04: Delete league — DELETE /leagues/:id → { success, message: "League deleted successfully" }', () => {
            adminMe();
            cy.intercept('GET', '**/api/leagues*', { body: { success: true, data: [league] } });
            cy.intercept('DELETE', `/leagues/${league.id}*`, {
                statusCode: 200,
                body: { success: true, message: 'League deleted successfully' },
            }).as('deleteLeague');

            cy.visit('/dashboard/admin/leagues');
            cy.get('[data-testid="btn-delete-league"]').first().click();
            cy.get('[data-testid="btn-delete-league-permanent"]').click({ force: true });
            cy.wait('@deleteLeague').its('response.body.message').should('eq', 'League deleted successfully');
        });

        it('E2E-ADM-001-H05: League stats update — PUT /league-stats/:id → { success, message, data }', () => {
            adminMe();
            cy.intercept('GET', `/leagues/${league.id}/statistics*`, {
                body: { success: true, message: 'League statistics retrieved successfully', data: [{ id: 'stat1', teamName: 'Amafor FC', played: 10, pts: 22 }], meta: { total: 1, page: 1, totalPages: 1, limit: 20 } },
            }).as('getStats');
            cy.intercept('PUT', `/league-stats/stat1*`, {
                statusCode: 200,
                body: { success: true, message: 'Statistics updated successfully', data: { id: 'stat1', pts: 25 } },
            }).as('updateStats');

            cy.visit(`/dashboard/admin/leagues/${league.id}/league-statstics/stat1/edit`);
            cy.wait('@getStats');
            cy.get('[data-testid="btn-edit-stats"]').click();
            cy.wait('@updateStats').its('response.body.data.pts').should('eq', 25);
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-ADM-002 — Manage Fixtures (Full Lifecycle)
// BR: BR-CE-03, BR-CE-07 | SRS: REQ-FIX-03..REQ-FIX-07
// ─────────────────────────────────────────────────────────────
describe('UJ-ADM-002 — Manage Fixtures (Full Lifecycle)', () => {

    describe('Happy Path: Fixture CRUD', () => {
        it('E2E-ADM-002-H01: Fixture list — GET /fixtures returns { success, results, data: Fixture[] }', () => {
            adminMe();
            cy.intercept('GET', '**/api/fixtures*', { body: { success: true, results: 1, data: [fixture] } }).as('getFixtures');
            cy.intercept('GET', '**/api/leagues/all*', { body: { success: true, data: [league] } });

            cy.visit(`/dashboard/admin/leagues/${league.id}/fixtures`);
            cy.wait('@getFixtures');
            cy.contains(fixture.homeTeam).should('be.visible');
        });

        it('E2E-ADM-002-H02: Create fixture — POST /fixtures/:leagueId returns { success, data: Fixture }', () => {
            adminMe();
            cy.intercept('GET', '**/api/leagues/all*', { body: { success: true, data: [league] } });
            cy.intercept('POST', `/fixtures/${league.id}*`, {
                statusCode: 201,
                body: { success: true, data: { ...fixture, id: 'fix_new', status: 'scheduled' } },
            }).as('createFixture');

            cy.visit(`/dashboard/admin/leagues/${league.id}/fixtures/new`);
            cy.get('[data-testid="btn-create-fixture"]').should('be.visible');
        });

        it('E2E-ADM-002-H03: Edit fixture — PUT /fixtures/:id returns { success, data: Fixture } with updated status', () => {
            adminMe();
            cy.intercept('GET', `/fixtures/one/${fixture.id}*`, { body: { success: true, data: fixture } }).as('getFixture');
            cy.intercept('PUT', `/fixtures/${fixture.id}*`, {
                statusCode: 200, body: { success: true, data: { ...fixture, status: 'IN_PROGRESS' } },
            }).as('updateFixture');

            cy.visit(`/dashboard/admin/leagues/${league.id}/fixtures/${fixture.id}/edit`);
            cy.wait('@getFixture');
            cy.get('select[name="status"]').select('IN_PROGRESS');
            cy.get('[data-testid="btn-edit-fixture"], button[type="submit"]').click();

            cy.wait('@updateFixture').its('response.body.data.status').should('eq', 'IN_PROGRESS');
        });

        it('E2E-ADM-002-H04: Delete fixture — DELETE /fixtures/:id → { success, message: "Fixture deleted successfully" }', () => {
            adminMe();
            cy.intercept('GET', `/fixtures/one/${fixture.id}*`, { body: { success: true, data: fixture } });
            cy.intercept('DELETE', `/fixtures/${fixture.id}*`, {
                statusCode: 200, body: { success: true, message: 'Fixture deleted successfully' },
            }).as('deleteFix');

            cy.visit(`/dashboard/admin/leagues/${league.id}/fixtures/${fixture.id}`);
            cy.get('[data-testid="btn-delete-fixture"]').click();
            cy.get('[data-testid="btn-confirm-delete-fixture"]').click();
            cy.wait('@deleteFix').its('response.body.message').should('eq', 'Fixture deleted successfully');
        });
    });

    describe('Happy Path: Goals — ⚠️ RAW response (no { success, data } wrapper)', () => {
        it('E2E-ADM-002-H05: Goals list — GET /goals/fixture/:id returns Goal[] (raw array)', () => {
            adminMe();
            // ⚠️ GoalController.getGoalsByFixture returns: res.json(goals) — plain array
            cy.intercept('GET', `/goals/fixture/${fixture.id}*`, {
                statusCode: 200, body: [goal],
            }).as('getGoals');

            cy.visit(`/dashboard/admin/leagues/${league.id}/fixtures/${fixture.id}/goals`);
            cy.wait('@getGoals');
            cy.get('[data-testid="btn-add-goal"]').should('be.visible');
            cy.contains('Chidera').should('be.visible');
        });

        it('E2E-ADM-002-H06: Add goal — POST /goals returns 201 Goal (raw object)', () => {
            adminMe();
            // ⚠️ GoalController.createGoal returns: res.status(201).json(goal) — plain object
            cy.intercept('GET', `/goals/fixture/${fixture.id}*`, { body: [] });
            cy.intercept('POST', `/goals*`, {
                statusCode: 201, body: goal,
            }).as('addGoal');

            cy.visit(`/dashboard/admin/leagues/${league.id}/fixtures/${fixture.id}/goals`);
            cy.get('[data-testid="btn-add-goal"]').click();
            cy.get('input[name="minute"]').type('34');
            cy.get('button[type="submit"]').click();
            cy.wait('@addGoal').its('response.body.minute').should('eq', 34);
        });

        it('E2E-ADM-002-H07: Update goal — PUT /goals/:id returns Goal (raw object)', () => {
            adminMe();
            // ⚠️ GoalController.updateGoal returns: res.json(goal) — plain object
            cy.intercept('GET', `/goals/${goal.id}*`, { body: goal }).as('getGoal');
            cy.intercept('PUT', `/goals/${goal.id}*`, {
                statusCode: 200, body: { ...goal, minute: 45 },
            }).as('editGoal');

            cy.visit(`/dashboard/admin/leagues/${league.id}/fixtures/${fixture.id}/goals/${goal.id}/edit`);
            cy.wait('@getGoal');
            cy.get('input[name="minute"]').clear().type('45');
            cy.get('[data-testid="btn-edit-goal"], button[type="submit"]').click();
            cy.wait('@editGoal').its('response.body.minute').should('eq', 45);
        });

        it('E2E-ADM-002-H08: Delete goal — DELETE /goals/:id → 204 no body', () => {
            adminMe();
            cy.intercept('GET', `/goals/fixture/${fixture.id}*`, { body: [goal] });
            // ⚠️ GoalController.deleteGoal: res.status(204).send() — no body
            cy.intercept('DELETE', `/goals/${goal.id}*`, { statusCode: 204, body: null }).as('deleteGoal');

            cy.visit(`/dashboard/admin/leagues/${league.id}/fixtures/${fixture.id}/goals`);
            cy.get('[data-testid="btn-delete-goal"]').first().click();
            cy.get('[data-testid="btn-confirm-delete"]').click();
            cy.wait('@deleteGoal').its('response.statusCode').should('eq', 204);
        });
    });

    describe('Happy Path: Lineup — ⚠️ RAW response (no { success, data } wrapper)', () => {
        it('E2E-ADM-002-H09: Lineup — GET /lineups/:fixtureId returns raw array or object', () => {
            adminMe();
            // ⚠️ LineupController.getLineupByFixture returns: res.json(lineup) — plain
            cy.intercept('GET', `/lineups/${fixture.id}*`, {
                statusCode: 200, body: [],
            }).as('getLineup');

            cy.visit(`/dashboard/admin/leagues/${league.id}/fixtures/${fixture.id}/lineup`);
            cy.wait('@getLineup');
            cy.get('[data-testid="btn-manage-lineup"]').should('be.visible');
        });
    });

    describe('Happy Path: Match Gallery — ⚠️ RAW response', () => {
        it('E2E-ADM-002-H10: Gallery — GET /match-gallery/:fixtureId returns FixtureImage[] (raw)', () => {
            adminMe();
            // ⚠️ FixtureImageController returns raw: res.json(images)
            cy.intercept('GET', `/match-gallery/${fixture.id}*`, {
                statusCode: 200,
                body: [{ id: 'img1', fixtureId: fixture.id, imageUrl: '/img.jpg', caption: 'Goal moment' }],
            }).as('getGallery');

            cy.visit(`/dashboard/admin/leagues/${league.id}/fixtures/${fixture.id}/gallery`);
            cy.wait('@getGallery');
            cy.contains('Goal moment').should('be.visible');
        });
    });

    describe('Happy Path: Match Summary', () => {
        it('E2E-ADM-002-H11: Summary — GET /match-summaries/fixture/:id + POST /match-summaries/:fixtureId both use { success, data }', () => {
            adminMe();
            cy.intercept('GET', `/match-summaries/fixture/${fixture.id}*`, {
                statusCode: 200, body: { success: true, data: null },
            }).as('getSummary');
            cy.intercept('POST', `/match-summaries/${fixture.id}*`, {
                statusCode: 201, body: { success: true, data: { id: 'sum1', fixtureId: fixture.id, content: 'Amafor dominated.' } },
            }).as('createSummary');

            cy.visit(`/dashboard/admin/leagues/${league.id}/fixtures/${fixture.id}/summary`);
            cy.wait('@getSummary');
            cy.get('[data-testid="btn-create-summary"]').click();
            cy.get('textarea, input[name="summary"]').first().type('Amafor dominated throughout.');
            cy.get('button[type="submit"]').click();
            cy.wait('@createSummary');
        });
    });
});
