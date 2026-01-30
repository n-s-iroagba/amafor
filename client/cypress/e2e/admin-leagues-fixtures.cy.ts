describe('Admin Leagues & Fixtures Management', () => {
    beforeEach(() => {
        // Mock API Base
        cy.intercept('GET', '**/api/leagues*', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        id: 1,
                        name: 'Premier League',
                        season: '2023/2024',
                        isFriendly: false,
                        createdAt: '2023-01-01T00:00:00Z',
                        updatedAt: '2023-01-01T00:00:00Z',
                    },
                ],
            },
        }).as('getLeagues');

        cy.intercept('GET', '**/api/leagues/1', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 1,
                    name: 'Premier League',
                    season: '2023/2024',
                    isFriendly: false,
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                },
            },
        }).as('getLeagueDetail');

        cy.intercept('GET', '**/api/fixtures/league/1*', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    data: [
                        {
                            id: 101,
                            leagueId: 1,
                            homeTeam: 'Team A',
                            awayTeam: 'Team B',
                            date: '2023-05-15T15:00:00Z',
                            matchDate: '2023-05-15T15:00:00Z', // Add matchDate matching date for component usage
                            status: 'scheduled',
                            venue: 'Stadium A',
                        },
                    ],
                    pagination: { page: 1, limit: 10, total: 1 }
                },
            },
        }).as('getLeagueFixtures');

        cy.intercept('GET', '**/api/fixtures/one/101', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 101,
                    leagueId: 1,
                    homeTeam: 'Team A',
                    awayTeam: 'Team B',
                    date: '2023-05-15T15:00:00Z',
                    status: 'scheduled',
                    venue: 'Stadium A',
                    league: {
                        name: 'Premier League',
                        season: '2023/2024',
                        isFriendly: false,
                    },
                    goals: [],
                    interviews: [],
                    images: [],
                },
            },
        }).as('getFixtureDetail');

        // Mock Auth
        cy.intercept('POST', '**/api/auth/login', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    user: {
                        id: 1,
                        email: 'admin@amafor.com',
                        userType: 'super_admin',
                        roles: ['admin'],
                        firstName: 'Admin',
                        lastName: 'User',
                        status: 'active',
                        emailVerified: true
                    },
                    accessToken: 'fake-jwt-token'
                }
            }
        }).as('login');

        cy.intercept('GET', '**/api/auth/me', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 1,
                    email: 'admin@amafor.com',
                    userType: 'super_admin',
                    roles: ['admin'],
                    firstName: 'Admin',
                    lastName: 'User',
                    status: 'active',
                    emailVerified: true
                }
            }
        }).as('me');

        // Auth bypass if needed or login
        cy.login('admin@amafor.com', 'password');
        cy.viewport(1280, 800);
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from failing the test
        return false;
    });

    it('should navigate to leagues list and view a league', () => {
        cy.visit('/dashboard/admin/leagues');
        cy.wait('@getLeagues');
        cy.get('[data-testid="btn-create-league"]').should('be.visible');
        cy.contains('Premier League').should('be.visible');

        // Click edit on the first league (mocked)
        // In real app, we might check row content.
        // For now, let's just visit the detail page directly or click a row link if we had IDs
        cy.visit('/dashboard/admin/leagues/1');
        cy.wait('@getLeagueDetail');

        cy.get('h1').should('contain', 'Premier League');
        cy.get('[data-testid="btn-edit-league"]').should('be.visible');
    });

    it('should create a new league', () => {
        cy.intercept('POST', '**/api/leagues', {
            statusCode: 201,
            body: { success: true, data: { id: 2 } },
        }).as('createLeague');

        cy.visit('/dashboard/admin/leagues/new');

        cy.get('[data-testid="input-league-name"]').type('New Championship');
        cy.get('[data-testid="input-league-season"]').type('2024/2025');
        cy.get('[data-testid="checkbox-league-friendly"]').click();

        cy.get('[data-testid="btn-save-league"]').click();
        cy.wait('@createLeague');

        // Should redirect to leagues list (mocked view) or detail
        cy.url().should('include', '/dashboard/admin/leagues');
    });

    it('should edit an existing league', () => {
        cy.intercept('PUT', '**/api/leagues/1', {
            statusCode: 200,
            body: { success: true },
        }).as('updateLeague');

        cy.visit('/dashboard/admin/leagues/1/edit');
        cy.wait('@getLeagueDetail');

        cy.get('[data-testid="input-league-name"]').clear().type('Premier League Updated');
        cy.get('[data-testid="btn-update-league"]').click();
        cy.wait('@updateLeague');

        cy.url().should('include', '/dashboard/admin/leagues/1');
    });

    it('should manage fixtures for a league', () => {
        cy.visit('/dashboard/admin/leagues/1/fixtures');
        // It might redirect or just show list.
        // Page: client/src/app/dashboard/admin/leagues/[id]/fixtures/page.tsx
        // It fetches 'getLeagueFixtures'
        cy.wait('@getLeagueFixtures');

        cy.contains('Team A').should('be.visible');
        cy.get('[data-testid="btn-view-fixture-101"]').click();

        cy.url().should('include', '/fixtures/101'); // Route might be absolute in component
    });

    it('should edit fixture details', () => {
        cy.intercept('PUT', '**/api/fixtures/101', {
            statusCode: 200,
            body: { success: true }
        }).as('updateFixture');

        cy.visit('/dashboard/admin/leagues/1/fixtures/101/edit');
        cy.wait('@getFixtureDetail');

        cy.contains('Edit Fixture').should('be.visible');
        cy.get('[data-testid="input-home-team"]').should('exist'); // Assuming form
        cy.get('[data-testid="btn-save-fixture"]').click();

        cy.wait('@updateFixture');
    });

    it('should view fixture details and tabs', () => {
        // Mock goals
        cy.intercept('GET', '**/api/goals*', {
            statusCode: 200,
            body: { success: true, data: [] }
        }).as('getGoals');

        // Mock lineup
        cy.intercept('GET', '**/api/lineups*', {
            statusCode: 200,
            body: { success: true, data: [] }
        }).as('getLineup');

        // Mock summary
        cy.intercept('GET', '**/api/match-summaries*', {
            statusCode: 200,
            body: { success: true, data: null } // No summary yet
        }).as('getSummary');

        // Mock gallery
        cy.intercept('GET', '**/api/match-gallery*', {
            statusCode: 200,
            body: { success: true, data: [] }
        }).as('getGallery');

        cy.visit('/dashboard/admin/leagues/1/fixtures/101');
        cy.wait('@getFixtureDetail');

        // Check Overview tab (default)
        cy.get('[data-testid="tab-overview"]').should('have.class', 'border-sky-500');

        // Check Goals Tab and Navigation
        cy.get('[data-testid="tab-goals"]').click();
        cy.get('[data-testid="btn-manage-goals"]').should('be.visible').click();
        cy.url().should('include', '/goals');
        cy.get('[data-testid="btn-back-fixture-details"]').click();

        // Check Summary Tab and Navigation
        cy.get('[data-testid="tab-summary"]').click();
        cy.get('[data-testid="btn-create-summary"]').should('be.visible').click();
        cy.url().should('include', '/summary/new');
        cy.get('[data-testid="btn-cancel"]').click();

        // Check Gallery Tab and Navigation
        cy.get('[data-testid="tab-gallery"]').click();
        cy.get('[data-testid="btn-manage-gallery"]').should('be.visible').click();
        cy.url().should('include', '/images');
        cy.get('[data-testid="btn-back-details"]').click();
    });

    it('should manage fixture goals', () => {
        // Mock players for dropdown
        cy.intercept('GET', '**/api/players*', {
            statusCode: 200,
            body: { success: true, data: [{ id: 99, name: 'Player One' }] }
        }).as('getPlayers');

        cy.intercept('POST', '**/api/goals/101', {
            statusCode: 201,
            body: { success: true, data: { id: 55 } }
        }).as('createGoal');

        cy.visit('/dashboard/admin/leagues/1/fixtures/101/goals/new');

        cy.get('[data-testid="radio-side-amafor"]').click();
        cy.get('[data-testid="select-scorer"]').select('99');
        cy.get('[data-testid="input-goal-minute"]').type('45');
        cy.get('[data-testid="btn-add-goal"]').click();

        cy.wait('@createGoal');
        cy.url().should('include', '/goals'); // Redirects to list
    });

    it('should edit fixture goal', () => {
        // Mock existing goal fetch if page logic requires it
        cy.visit('/dashboard/admin/leagues/1/fixtures/101/goals/goal_55/edit');
        // Assuming standard edit page structure
        cy.get('[data-testid="btn-update-goal"]').should('exist');
    });

    it('should manage fixture summary', () => {
        cy.intercept('POST', '**/api/match-summaries/101', {
            statusCode: 201,
            body: { success: true, data: { id: 77 } }
        }).as('createSummary');

        cy.visit('/dashboard/admin/leagues/1/fixtures/101/summary/new');

        cy.get('[data-testid="textarea-summary"]').type('This is a test summary of the match. It was a very exciting game with many goals and events.'.repeat(2)); // > 50 chars
        cy.get('[data-testid="btn-create-summary"]').click();

        cy.wait('@createSummary');
        // Redirects to fixture detail
        cy.url().should('include', '/fixtures/101');
    });

    it('should edit fixture summary', () => {
        cy.visit('/dashboard/admin/leagues/1/fixtures/101/summary/details/sum_77/edit');
        cy.get('[data-testid="textarea-summary"]').should('exist');
        cy.get('[data-testid="textarea-summary"]').should('exist');
        cy.get('[data-testid="btn-update-summary"]').should('exist');
    });

    it('should view fixture summary details', () => {
        cy.intercept('GET', '**/match-summaries/sum_77', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 'sum_77',
                    summary: 'This is the match summary details.'
                }
            }
        }).as('getSummaryDetail');

        cy.visit('/dashboard/admin/leagues/1/fixtures/101/summary/details/sum_77');
        cy.wait('@getSummaryDetail');
        cy.contains('This is the match summary details.').should('be.visible');
    });

    it('should manage fixture lineup', () => {
        cy.visit('/dashboard/admin/leagues/1/fixtures/101/lineup');
        cy.contains('Lineup').should('be.visible');
        cy.get('[data-testid="btn-save-lineup"]').should('exist');
    });

    it('should view fixture goal details', () => {
        cy.intercept('GET', '**/api/goals/goal_55', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 'goal_55',
                    scorer: { name: 'Player One' },
                    minute: 45
                }
            }
        }).as('getGoalDetail');

        cy.visit('/dashboard/admin/leagues/1/fixtures/101/goals/goal_55');
        cy.wait('@getGoalDetail');
        cy.contains('Player One').should('be.visible');
        cy.contains('45').should('be.visible');
    });

    it('should view fixture images page', () => {
        // Just verify page load as upload is complex to mock fully in headless without fixtures
        cy.visit('/dashboard/admin/leagues/1/fixtures/101/images/new');
        cy.get('[data-testid="input-fixture-images"]').should('exist');
        cy.get('[data-testid="btn-cancel"]').click();
    });

    it('should edit fixture image', () => {
        // Mock image details fetch
        cy.intercept('GET', '**/match-gallery/img_123*', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 'img_123',
                    fixtureId: 101,
                    imageUrl: 'https://example.com/image.jpg',
                    caption: 'Old Caption',
                    createdAt: new Date().toISOString()
                }
            }
        }).as('getImageDetail');

        // Mock update
        cy.intercept('PUT', '**/match-gallery/img_123', {
            statusCode: 200,
            body: {
                success: true,
                data: { id: 'img_123', caption: 'New Caption' }
            }
        }).as('updateImage');

        cy.visit('/dashboard/admin/leagues/1/fixtures/101/images/img_123/edit');
        cy.wait('@getImageDetail');

        cy.contains('Edit Image Details').should('be.visible');
        cy.get('textarea[name="caption"]').clear().type('New Caption');
        cy.contains('Save Changes').click();

        cy.wait('@updateImage');
        // Should redirect back (mocking back behavior might be tricky, but we can check if update call happened)
    });

    it('should view league statistics', () => {
        cy.intercept('GET', '**/api/leagues/1/statistics', {
            statusCode: 200,
            body: { success: true, data: { id: 888 } } // redirect obj
        }).as('getLeagueStatsRedir');

        cy.intercept('GET', '**/api/league-stats/888', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 888,
                    leagueId: 1,
                    position: 1,
                    points: 30,
                    goalsFor: 20,
                    goalsAgainst: 5,
                    wins: 10,
                    draws: 0,
                    losses: 0,
                    league: { name: 'Premier League', season: '23/24' }
                }
            }
        }).as('getLeagueStatsDetail');

        cy.visit('/dashboard/admin/leagues/1/league-statstics');
        cy.wait('@getLeagueStatsRedir');
        // Should redirect
        cy.url().should('include', '/league-statstics/888');
        cy.wait('@getLeagueStatsDetail');

        cy.contains('30').should('be.visible'); // Points
        cy.get('[data-testid="btn-edit-stats"]').click();
        cy.url().should('include', '/edit');
    });

    it('should manage fixture interviews', () => {
        cy.intercept('GET', '**/api/match-interviews*', {
            statusCode: 200,
            body: { success: true, data: [] }
        }).as('getInterviews');

        cy.intercept('POST', '**/api/match-interviews/101', {
            statusCode: 201,
            body: { success: true, data: { id: 33 } }
        }).as('createInterview');

        cy.visit('/dashboard/admin/leagues/1/fixtures/101/interviews/new');

        cy.get('[data-testid="input-interview-person"]').type('Coach Carter');
        cy.get('[data-testid="input-interview-role"]').type('Head Coach');
        cy.get('[data-testid="textarea-interview-content"]').type('We played well and deserved the win.');
        cy.get('[data-testid="btn-save-interview"]').click();

        cy.wait('@createInterview');
        cy.url().should('include', '/interviews');
    });

    it('should edit fixture interview', () => {
        cy.intercept('GET', '**/match-interviews/33*', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 33,
                    personName: 'Coach Carter',
                    role: 'Head Coach',
                    content: 'Old content'
                }
            }
        }).as('getInterviewDetail');

        cy.intercept('PUT', '**/match-interviews/33', {
            statusCode: 200,
            body: { success: true }
        }).as('updateInterview');

        cy.visit('/dashboard/admin/leagues/1/fixtures/101/interviews/33/edit');
        cy.wait('@getInterviewDetail');

        cy.get('[data-testid="textarea-interview-content"]').clear().type('New content');
        cy.get('[data-testid="btn-update-interview"]').click();

        cy.wait('@updateInterview');
    });
});
