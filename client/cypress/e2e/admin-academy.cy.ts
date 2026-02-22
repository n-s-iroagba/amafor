describe('Admin Academy Staff & Trialist Management', () => {
    beforeEach(() => {
        // Catch-all: intercept ANY request to the backend (localhost:5000) to prevent hangs.
        // The Axios client sends requests to http://localhost:5000/api, not through localhost:3000.
        cy.intercept('GET', 'http://localhost:5000/**', { statusCode: 200, body: { success: true, data: [] } });
        cy.intercept('POST', 'http://localhost:5000/**', { statusCode: 200, body: { success: true, data: {} } });
        cy.intercept('PUT', 'http://localhost:5000/**', { statusCode: 200, body: { success: true, data: {} } });
        cy.intercept('PATCH', 'http://localhost:5000/**', { statusCode: 200, body: { success: true, data: {} } });
        cy.intercept('DELETE', 'http://localhost:5000/**', { statusCode: 200, body: { success: true, data: {} } });

        // Mock /api/auth/me (used by AuthProvider on every page load)
        cy.intercept('GET', '**/api/auth/me', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 1,
                    email: 'admin@academy.com',
                    userType: 'super_admin',
                    roles: ['admin'],
                    firstName: 'Admin',
                    lastName: 'User',
                    status: 'active',
                    emailVerified: true
                }
            }
        }).as('me');

        cy.intercept('GET', '**/api/geolocation/country', { statusCode: 200, body: { country: 'NG', code: 'NG' } }).as('geo');
        cy.intercept('POST', '**/api/auth/refresh-token', { statusCode: 200, body: { accessToken: 'fake-jwt-token' } }).as('refreshToken');
        cy.intercept('GET', '**/api/analytics/dashboard*', { statusCode: 200, body: { success: true, data: { totalRevenue: 0, totalUsers: 10 } } }).as('analytics');

        // Mock staff list
        cy.intercept('GET', '**/api/academy-staff', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    data: [
                        {
                            id: 1, name: 'Coach Carter', role: 'Head Coach', initials: 'CC',
                            category: 'coaching', experience: 15, yearsOfExperience: 15,
                            bio: 'Experienced football coach.', qualifications: ['UEFA A License'],
                            imageUrl: '', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-06-01T00:00:00Z'
                        },
                        {
                            id: 2, name: 'Dr. Smith', role: 'Physio', initials: 'DS',
                            category: 'medical', experience: 10, yearsOfExperience: 10,
                            bio: 'Sports physiotherapist.', qualifications: ['BSc Physiotherapy'],
                            imageUrl: '', createdAt: '2023-02-01T00:00:00Z', updatedAt: '2023-06-01T00:00:00Z'
                        }
                    ],
                    meta: { total: 2, page: 1, limit: 100 }
                }
            }
        }).as('getStaffList');

        // Mock individual staff GET (for detail/edit pages)
        cy.intercept('GET', '**/api/academy-staff/*', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 1, name: 'Coach Carter', role: 'Head Coach', initials: 'CC',
                    category: 'coaching', yearsOfExperience: 15,
                    bio: 'Experienced football coach with UEFA A License.',
                    qualifications: ['UEFA A License', 'FA Level 3'],
                    imageUrl: '', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-06-01T00:00:00Z'
                }
            }
        }).as('getStaffDetail');

        // Mock staff create/update
        cy.intercept('POST', '**/api/academy-staff', { statusCode: 201, body: { success: true, data: { id: 3 } } }).as('createStaff');
        cy.intercept('PUT', '**/api/academy-staff/*', { statusCode: 200, body: { success: true, data: { id: 1 } } }).as('updateStaff');

        // Mock trialists list
        cy.intercept('GET', '**/api/trialists', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    data: [
                        {
                            id: 10, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com',
                            phone: '08012345678', dob: '2005-06-15', dateOfBirth: '2005-06-15',
                            position: 'Striker', preferredFoot: 'RIGHT', height: 178, weight: 72,
                            previousClub: 'Youth FC', status: 'PENDING', notes: 'Promising talent.',
                            createdAt: '2023-03-01T00:00:00Z', updatedAt: '2023-06-01T00:00:00Z'
                        },
                        {
                            id: 11, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com',
                            phone: '08098765432', dob: '2004-09-20', dateOfBirth: '2004-09-20',
                            position: 'Midfielder', preferredFoot: 'LEFT', height: 165, weight: 60,
                            previousClub: 'Academy FC', status: 'ACCEPTED', notes: 'Great vision.',
                            createdAt: '2023-04-01T00:00:00Z', updatedAt: '2023-06-01T00:00:00Z'
                        }
                    ],
                    meta: { total: 2, page: 1, limit: 100 }
                }
            }
        }).as('getTrialistList');

        // Mock individual trialist GET
        cy.intercept('GET', '**/api/trialists/*', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 10, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com',
                    phone: '08012345678', dob: '2005-06-15', dateOfBirth: '2005-06-15',
                    position: 'Striker', preferredFoot: 'RIGHT', height: 178, weight: 72,
                    previousClub: 'Youth FC', status: 'PENDING', notes: 'Promising talent.',
                    createdAt: '2023-03-01T00:00:00Z', updatedAt: '2023-06-01T00:00:00Z'
                }
            }
        }).as('getTrialistDetail');

        // Mock trialist create/update
        cy.intercept('POST', '**/api/trialists', { statusCode: 201, body: { success: true, data: { id: 12 } } }).as('createTrialist');
        cy.intercept('PUT', '**/api/trialists/*', { statusCode: 200, body: { success: true, data: { id: 10 } } }).as('updateTrialist');

        // Upload mock
        cy.intercept('POST', '**/upload*', { statusCode: 200, body: { success: true, data: { url: 'https://placehold.co/200' } } }).as('upload');

        // Bypass UI login
        cy.session('admin-academy-session', () => {
            window.localStorage.setItem('accessToken', 'fake-jwt-token');
        });

        cy.visit('/dashboard/admin', { failOnStatusCode: false });
        cy.viewport(1280, 800);
    });

    Cypress.on('uncaught:exception', () => false);

    // ==========================================
    // STAFF TESTS
    // ==========================================

    it('should navigate to staff list page', () => {
        cy.visit('/dashboard/admin/academy/staff', { failOnStatusCode: false });
        cy.get('[data-testid="btn-add-academy-staff"]', { timeout: 15000 }).should('be.visible');
        cy.get('[data-testid="input-search-academy-staff"]').should('exist');
    });

    it('should create a new staff member', () => {
        cy.visit('/dashboard/admin/academy/staff/new', { failOnStatusCode: false });

        cy.get('[data-testid="input-staff-name"]', { timeout: 15000 }).type('New Coach');
        cy.get('[data-testid="input-staff-role"]').type('Assistant Coach');
        cy.get('[data-testid="input-staff-initials"]').type('NC');
        cy.get('[data-testid="select-staff-category"]').select('coaching');
        cy.get('[data-testid="input-staff-experience"]').type('5');
        cy.get('[data-testid="textarea-staff-bio"]').type('A passionate coach.');
        // Fill qualification (required by form validation)
        cy.get('[data-testid="input-staff-qualification-0"]').type('FA Level 2');
        cy.get('[data-testid="btn-save-staff"]').click();

        cy.wait('@createStaff', { timeout: 10000 });
    });

    it('should view staff member details', () => {
        cy.visit('/dashboard/admin/academy/staff/1', { failOnStatusCode: false });
        cy.wait('@getStaffDetail', { timeout: 10000 });
        cy.contains('Coach Carter', { timeout: 10000 }).should('be.visible');
    });

    it('should edit a staff member', () => {
        cy.visit('/dashboard/admin/academy/staff/1/edit', { failOnStatusCode: false });
        cy.wait('@getStaffDetail', { timeout: 10000 });

        cy.get('[data-testid="input-staff-name"]', { timeout: 15000 }).should('have.value', 'Coach Carter');
        cy.get('[data-testid="input-staff-role"]').should('have.value', 'Head Coach');
        cy.get('[data-testid="btn-update-staff"]').should('exist');
    });

    // ==========================================
    // TRIALIST TESTS
    // ==========================================

    it('should navigate to trialist list page', () => {
        cy.visit('/dashboard/admin/academy/trialist', { failOnStatusCode: false });
        cy.get('[data-testid="btn-add-trialist"]', { timeout: 15000 }).should('be.visible');
        cy.get('[data-testid="input-search-trialists"]').should('exist');
    });

    it('should create a new trialist', () => {
        cy.visit('/dashboard/admin/academy/trialist/new', { failOnStatusCode: false });

        cy.get('[data-testid="input-trialist-firstname"]', { timeout: 15000 }).type('New');
        cy.get('[data-testid="input-trialist-lastname"]').type('Talent');
        cy.get('[data-testid="input-trialist-email"]').type('talent@example.com');
        cy.get('[data-testid="input-trialist-phone"]').type('08012345678');
        cy.get('[data-testid="input-trialist-dob"]').type('2005-01-01');
        cy.get('[data-testid="select-trialist-position"]').select('Striker');
        cy.get('[data-testid="select-trialist-foot"]').select('RIGHT');
        cy.get('[data-testid="input-trialist-height"]').type('175');
        cy.get('[data-testid="input-trialist-weight"]').type('70');
        cy.get('[data-testid="input-trialist-club"]').type('Youth FC');
        cy.get('[data-testid="btn-save-trialist"]').click();

        cy.wait('@createTrialist', { timeout: 10000 });
    });

    it('should view trialist details', () => {
        cy.visit('/dashboard/admin/academy/trialist/10', { failOnStatusCode: false });
        cy.wait('@getTrialistDetail', { timeout: 10000 });
        cy.contains('John', { timeout: 10000 }).should('be.visible');
    });

    it('should edit a trialist', () => {
        cy.visit('/dashboard/admin/academy/trialist/10/edit', { failOnStatusCode: false });
        cy.wait('@getTrialistDetail', { timeout: 10000 });

        cy.get('[data-testid="input-trialist-firstname"]', { timeout: 15000 }).should('have.value', 'John');
        cy.get('[data-testid="input-trialist-lastname"]').should('have.value', 'Doe');
        cy.get('[data-testid="btn-update-trialist"]').should('exist');
    });
});
