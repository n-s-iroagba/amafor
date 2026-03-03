/**
 * ============================================================
 * E2E TEST SUITE — PUBLIC CONTENT
 * Journeys: UJ-PUB-001 to UJ-PUB-006
 *
 * SERVER RESPONSE SHAPES:
 *   GET  /fixtures            → { success, results, data: Fixture[] }  (FixtureController.listMatches)
 *   GET  /fixtures/one/:id    → { success, data: Fixture }             (FixtureController.getMatch)
 *   GET  /fixtures/gallery    → { success, data: Fixture[], ... }
 *   GET  /articles/published  → { success, data: Article[], meta? }   (ArticleController)
 *   GET  /articles/:id        → { success, data: Article }
 *   GET  /featured-news/homepage → { success, data: FeaturedNews[] }
 *   GET  /academy-staff       → { success, data: AcademyStaff[] }     (AcademyStaffController — data is list directly)
 *   GET  /players             → { success, results: N, data: Player[] }
 *   GET  /players/:id         → { success, data: Player }
 *   GET  /leagues             → { success, data: League[] }
 *   GET  /leagues/:id         → { success, data: League }
 *   POST /scout/applications  → { success, data: ScoutApplication }
 *   GET  /api/fixtures/:id    → { success, data: Fixture }   (gallery detail)
 *   GET  /api/fixtures/:id/images → { success, data: FixtureImage[] }
 *
 * Fixture fields: id, matchDate, homeTeam, awayTeam, leagueId, venue, status,
 *   homeScore, awayScore, attendance, referee, weather, metadata
 * Player fields: id, name, dateOfBirth, position, height, nationality,
 *   jerseyNumber, imageUrl, status, joinedDate
 * AcademyStaff fields: id, name, role, bio, initials, imageUrl, category,
 *   qualifications, yearsOfExperience
 * League fields: id, name, season, isFriendly
 * ScoutApplication fields: id, name, email, organization, socialUrl, reason, status
 * ============================================================
 */

// ─── Shared fixtures ──────────────────────────────────────────
const serverFixture = {
    id: 'fix_1',
    matchDate: '2026-04-01T15:00:00Z',
    homeTeam: 'Amafor FC',
    awayTeam: 'United FC',
    leagueId: 'lg1',
    venue: 'Amafor Stadium',
    status: 'completed',
    homeScore: 2,
    awayScore: 1,
    attendance: 1200,
    referee: 'Mr. Eze',
    weather: 'Sunny',
    metadata: {},
};

const serverArticle = {
    id: 'art_1',
    title: 'Season Preview',
    excerpt: 'A great season ahead.',
    body: '<p>Full content.</p>',
    status: 'published',
    imageUrl: '/img.jpg',
    authorId: 'u1',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
};

const serverPlayer = {
    id: 'p1',
    name: 'Chidera Nwosu',
    dateOfBirth: '2005-06-15',
    position: 'Forward',
    height: 178,
    nationality: 'Nigerian',
    jerseyNumber: 9,
    imageUrl: '/player.jpg',
    status: 'active',
    joinedDate: '2024-01-01',
};

const serverCoach = {
    id: 'c1',
    name: 'Coach Obi',
    role: 'Head Coach',
    bio: 'Experienced head coach',
    initials: 'CO',
    imageUrl: '/coach.jpg',
    category: 'Coaching',
    qualifications: ['UEFA B'],
    yearsOfExperience: 10,
};

const serverLeague = { id: 'lg1', name: 'Anambra State League', season: '2025/26', isFriendly: false };

// ─────────────────────────────────────────────────────────────
// UJ-PUB-001 — Browse Fixtures
// SRS: REQ-PUB-01, REQ-PUB-02 | Screens: SC-019, SC-020
// ─────────────────────────────────────────────────────────────
describe('UJ-PUB-001 — Browse Fixtures', () => {
    describe('Happy Path', () => {
        it('E2E-PUB-001-H01: Fixture list — GET /fixtures returns { success, results, data: Fixture[] }', () => {
            cy.intercept('GET', '**/api/fixtures*', {
                statusCode: 200,
                body: { success: true, results: 1, data: [serverFixture] },
            }).as('getFixtures');
            cy.intercept('GET', '**/api/leagues*', {
                statusCode: 200, body: { success: true, data: [serverLeague] },
            });

            cy.visit('/fixtures');
            cy.wait('@getFixtures');
            cy.contains(serverFixture.homeTeam).should('be.visible');
            cy.contains(serverFixture.awayTeam).should('be.visible');
        });

        it('E2E-PUB-001-H02: Fixture detail — GET /fixtures/one/:id returns { success, data: Fixture }', () => {
            cy.intercept('GET', `/fixtures/one/${serverFixture.id}*`, {
                statusCode: 200,
                body: { success: true, data: { ...serverFixture, goals: [{ id: 'g1', scorer: 'Emeka', minute: 34, isPenalty: false }], lineups: [] } },
            }).as('getFixture');

            cy.visit(`/fixtures/${serverFixture.id}`);
            cy.wait('@getFixture');
            cy.contains('Emeka').should('be.visible');
            cy.contains('34').should('be.visible');
        });
    });

    describe('Edge Case', () => {
        it('E2E-PUB-001-E01: Empty fixture list shows friendly empty state', () => {
            cy.intercept('GET', '**/api/fixtures*', { statusCode: 200, body: { success: true, results: 0, data: [] } });
            cy.intercept('GET', '**/api/leagues*', { statusCode: 200, body: { success: true, data: [] } });
            cy.visit('/fixtures');
            cy.contains(/no fixtures|coming soon/i).should('be.visible');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-PUB-002 — Browse News
// SRS: REQ-PUB-03, REQ-PUB-04 | Screens: SC-022, SC-023, SC-024
// ─────────────────────────────────────────────────────────────
describe('UJ-PUB-002 — Browse News', () => {
    describe('Happy Path', () => {
        it('E2E-PUB-002-H01: News list — GET /articles/published returns { success, data: Article[] }', () => {
            cy.intercept('GET', '**/api/articles/published*', {
                statusCode: 200,
                body: { success: true, data: [serverArticle] },
            }).as('getPublished');

            cy.visit('/news');
            cy.wait('@getPublished');
            cy.contains(serverArticle.title).should('be.visible');
        });

        it('E2E-PUB-002-H02: Article detail — GET /articles/:id returns { success, data: Article }', () => {
            cy.intercept('GET', `/articles/${serverArticle.id}*`, {
                statusCode: 200,
                body: { success: true, data: serverArticle },
            }).as('getArticle');

            cy.visit(`/news/${serverArticle.id}`);
            cy.wait('@getArticle');
            cy.get('[data-testid="article-title"]').should('contain', serverArticle.title);
            cy.get('[data-testid="article-content"]').should('be.visible');
        });

        it('E2E-PUB-002-H03: Featured news — GET /featured-news/homepage returns { success, data }', () => {
            cy.intercept('GET', '**/api/featured-news/homepage*', {
                statusCode: 200,
                body: { success: true, data: [{ id: 'fn1', articleId: 'art_1', article: serverArticle }] },
            }).as('getFeatured');

            cy.visit('/featured-news');
            cy.wait('@getFeatured');
            cy.contains(serverArticle.title).should('be.visible');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-PUB-003 — View Team & Players
// SRS: REQ-PUB-05 | Screens: SC-021, SC-010, SC-013
// AcademyStaff list: { success, data: AcademyStaff[] }  (data directly, not { data: { data } })
// Player list:       { success, results: N, data: Player[] }
// ─────────────────────────────────────────────────────────────
describe('UJ-PUB-003 — View Team & Players', () => {
    describe('Happy Path', () => {
        it('E2E-PUB-003-H01: Team page fetches /academy-staff { success, data } and /players { success, results, data }', () => {
            cy.intercept('GET', '**/api/academy-staff*', {
                statusCode: 200,
                body: { success: true, data: [serverCoach] },
            }).as('getCoaches');
            cy.intercept('GET', '**/api/players*', {
                statusCode: 200,
                body: { success: true, results: 1, data: [serverPlayer] },
            }).as('getPlayers');

            cy.visit('/team');
            cy.wait('@getCoaches');
            cy.wait('@getPlayers');
            cy.contains(serverPlayer.name).should('be.visible');
            cy.contains(serverCoach.name).should('be.visible');
        });

        it('E2E-PUB-003-H02: Player profile — GET /players/:id returns { success, data: Player }', () => {
            cy.intercept('GET', `/players/${serverPlayer.id}*`, {
                statusCode: 200,
                body: { success: true, data: { ...serverPlayer, bio: 'Elite striker', goals: 10 } },
            }).as('getPlayer');

            cy.visit(`/player/${serverPlayer.id}`);
            cy.wait('@getPlayer');
            cy.contains(serverPlayer.name).should('be.visible');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-PUB-004 — League Statistics
// SRS: REQ-PUB-06 | Screens: SC-101, SC-102
// League list: { success, data: League[] }
// League detail: { success, data: League }
// ─────────────────────────────────────────────────────────────
describe('UJ-PUB-004 — League Statistics', () => {
    describe('Happy Path', () => {
        it('E2E-PUB-004-H01: League list uses GET /leagues; { success, data: League[] }', () => {
            cy.intercept('GET', '**/api/leagues*', { statusCode: 200, body: { success: true, data: [serverLeague] } }).as('getLeagues');
            cy.visit('/league-statistics');
            cy.wait('@getLeagues');
            cy.contains(serverLeague.name).should('be.visible');
        });

        it('E2E-PUB-004-H02: League table — GET /leagues/:id { success, data: League + standings }', () => {
            cy.intercept('GET', `/leagues/${serverLeague.id}*`, {
                statusCode: 200,
                body: {
                    success: true,
                    data: {
                        ...serverLeague,
                        standings: [{ team: 'Amafor FC', played: 10, won: 7, drawn: 2, lost: 1, gf: 20, ga: 8, pts: 23 }],
                    },
                },
            }).as('getLeagueDetail');

            cy.visit(`/league-statistics/${serverLeague.id}`);
            cy.wait('@getLeagueDetail');
            cy.contains('Amafor FC').should('be.visible');
            cy.contains('23').should('be.visible');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-PUB-005 — Fixture Gallery
// SRS: REQ-PUB-07 | Screens: SC-103
// ─────────────────────────────────────────────────────────────
describe('UJ-PUB-005 — Fixture Gallery', () => {
    describe('Happy Path', () => {
        it('E2E-PUB-005-H01: Gallery list — GET /fixtures/gallery returns { success, data: Fixture[] }', () => {
            cy.intercept('GET', '**/api/fixtures/gallery*', {
                statusCode: 200,
                body: { success: true, data: [serverFixture] },
            }).as('getGallery');
            cy.intercept('GET', '**/api/api/leagues*', { statusCode: 200, body: { success: true, data: [serverLeague] } });

            cy.visit('/gallery');
            cy.wait('@getGallery');
            cy.contains(serverFixture.homeTeam).should('be.visible');
        });

        it('E2E-PUB-005-H02: Gallery detail — /api/fixtures/:id + /api/fixtures/:id/images both { success, data }', () => {
            cy.intercept('GET', `/api/fixtures/${serverFixture.id}*`, {
                statusCode: 200,
                body: { success: true, data: serverFixture },
            }).as('getGalleryFixture');
            cy.intercept('GET', `/api/fixtures/${serverFixture.id}/images*`, {
                statusCode: 200,
                body: {
                    success: true,
                    data: [{ id: 'img1', fixtureId: serverFixture.id, imageUrl: '/img.jpg', caption: 'Goal moment' }],
                },
            }).as('getImages');

            cy.visit(`/gallery/${serverFixture.id}`);
            cy.wait('@getGalleryFixture');
            cy.wait('@getImages');
            cy.contains('Goal moment').should('be.visible');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-PUB-006 — Pro View Scout Registration
// SRS: REQ-SCT-06 | Screens: SC-104, SC-105
// POST /scout/applications → { success, data: ScoutApplication }
// ScoutApplication fields: id, name, email, organization, socialUrl, reason, status
// ─────────────────────────────────────────────────────────────
describe('UJ-PUB-006 — Pro View Scout Registration', () => {
    describe('Happy Path', () => {
        it('E2E-PUB-006-H01: Scout application — POST /scout/applications returns { success, data: { id, status: "pending" } }', () => {
            cy.intercept('POST', '**/api/scout/applications*', {
                statusCode: 201,
                body: {
                    success: true,
                    data: {
                        id: 'sc_new',
                        name: 'Emeka Scout',
                        email: 'scout@test.com',
                        organization: 'Lagos FC Scouts',
                        reason: 'Looking for talent',
                        status: 'pending',
                        createdAt: '2026-03-01T12:00:00Z',
                    },
                },
            }).as('scoutApply');

            cy.visit('/pro-view/apply');
            cy.get('[data-testid="apply-name"]').type('Emeka Scout');
            cy.get('[data-testid="apply-org"]').type('Lagos FC Scouts');
            cy.get('[data-testid="apply-email"]').type('scout@test.com');
            cy.get('[data-testid="apply-reason"]').type('Looking for talent');
            cy.get('[data-testid="apply-btn"]').click();

            cy.wait('@scoutApply').its('response.body.data.status').should('eq', 'pending');
        });

        it('E2E-PUB-006-H02: Apply button disabled when required fields empty', () => {
            cy.visit('/pro-view/apply');
            cy.get('[data-testid="apply-btn"]').should('be.disabled');
        });
    });

    describe('Authorization', () => {
        it('E2E-PUB-006-A01: Pending scout sees awaiting-verification banner', () => {
            // getMe returns AuthUser directly (no success wrapper)
            cy.intercept('GET', '**/api/auth/me*', {
                statusCode: 200,
                body: {
                    id: 'sc1',
                    email: 'scout@test.com',
                    firstName: 'Tolu',
                    lastName: 'Bello',
                    role: 'scout',
                    status: 'pending_verification',
                    emailVerified: true,
                },
            });
            cy.visit('/dashboard/scout');
            cy.contains(/awaiting.*verification|pending.*approval/i).should('be.visible');
        });
    });
});
