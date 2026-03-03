/**
 * ============================================================
 * E2E TEST SUITE — AUTHENTICATION
 * Journeys: UJ-AUTH-001, UJ-AUTH-002, UJ-AUTH-003
 *
 * NOTE: These tests run against the REAL API without mocking.
 * They rely on the actual server backend (http://localhost:5000)
 * and the database being populated with seed data.
 * ============================================================
 */

describe('UJ-AUTH-001 — User Registration', () => {
    // Generate unique email to avoid "already registered" on multiple runs
    const email = `e2e_${Date.now()}@test.com`;
    const password = 'SecurePass123!';

    describe('Happy Path', () => {
        it('E2E-AUTH-001-H01: Sign-up link is accessible on the login page', () => {
            cy.visit('/auth/login');
            cy.get('[data-testid="signup-link"]').should('be.visible');
        });

        it('E2E-AUTH-001-H02: Valid registration succeeds and shows verification instruction', () => {
            // Spy on the real API call, do not mock the response
            cy.intercept('POST', '**/api/auth/signup').as('signup');

            cy.visit('/auth/login');
            cy.get('[data-testid="signup-link"]').click();

            cy.get('[data-testid="business-name-input"]').type('New Test Business', { force: true });
            cy.get('[data-testid="business-email-input"]').type(email, { force: true });
            cy.get('[data-testid="business-phone-input"]').type('+234800000000', { force: true });
            cy.get('[data-testid="submit-registration"]').click({ force: true });

            cy.wait('@signup');
            // If the server connects successfully to DB, we should see success message
            // If the DB is down, this will correctly fail the E2E test.
            cy.contains(/Application Received|Awaiting Verification/i).should('be.visible');
        });

        // Note: We cannot easily E2E test the exact OTP verification for a newly created user 
        // without accessing the test email inbox or DB directly.
        // We skip the direct OTP verification test in standard pure black-box E2E unless we have
        // a known seed token or a back-channel to fetch the token.
    });

    describe('Failure Path', () => {
        it.only('E2E-AUTH-001-F01: Duplicate email returns error', () => {
            cy.request({
                method: 'POST',
                url: 'http://localhost:5000/api/v1/auth/signup',
                failOnStatusCode: false,
                body: {
                    businessName: "Duplicate Business Name",
                    contactName: "Duplicate Contact",
                    email: "nnamdisolomon@gmail.com",
                    phone: "+234812345678",
                    password: "password123",
                    confirmPassword: "password123",
                    userType: "advertiser"
                }
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.message).to.match(/already registered|already exists|duplicate/i);
            });
        });

        it('E2E-AUTH-001-F02: Invalid OTP shows error', () => {
            cy.intercept('POST', '**/api/auth/verify-email').as('badOtp');

            cy.visit('/auth/verify-email/bad-token');
            '000000'.split('').forEach((d, i) =>
                cy.get(`[data-testid="verify-code-input-${i}"]`).type(d)
            );

            cy.wait('@badOtp');
            cy.contains(/invalid|expired/i).should('be.visible');
        });
    });
});

describe('UJ-AUTH-002 — User Login', () => {
    beforeEach(() => cy.visit('/auth/login'));

    describe('Happy Path', () => {
        it('E2E-AUTH-002-H01: Valid scout credentials log in successfully', () => {
            cy.intercept('POST', '**/api/auth/login').as('login');

            // Using known seeded development data
            cy.get('[data-testid="email-input"]').type('scout@academy.com');
            cy.get('[data-testid="password-input"]').type('password123');
            cy.get('[data-testid="login-btn"]').click();

            cy.wait('@login').its('response.statusCode').should('eq', 200);
            cy.url().should('include', '/dashboard');
        });

        it('E2E-AUTH-002-H02: Admin role navigates to admin dashboard', () => {
            cy.intercept('POST', '**/api/auth/login').as('loginAdmin');

            // Using known seeded admin data
            cy.get('[data-testid="email-input"]').type('nnamdisolommon@gmail.com');
            cy.get('[data-testid="password-input"]').type('12345678');
            cy.get('[data-testid="login-btn"]').click();

            cy.wait('@loginAdmin').its('response.statusCode').should('eq', 200);
            cy.url().should('include', '/dashboard');
        });

        it('E2E-AUTH-002-H03: Button disabled until email AND password filled', () => {
            cy.get('[data-testid="login-btn"]').should('be.disabled');
            cy.get('[data-testid="email-input"]').type('a@b.com');
            cy.get('[data-testid="login-btn"]').should('be.disabled');
            cy.get('[data-testid="password-input"]').type('x');
            cy.get('[data-testid="login-btn"]').should('not.be.disabled');
        });
    });

    describe('Failure Path', () => {
        it('E2E-AUTH-002-F01: Wrong credentials show error and user stays on login', () => {
            cy.intercept('POST', '**/api/auth/login').as('badLogin');

            cy.get('[data-testid="email-input"]').type('scout@academy.com');
            cy.get('[data-testid="password-input"]').type('WrongPass!');
            cy.get('[data-testid="login-btn"]').click();

            cy.wait('@badLogin').its('response.statusCode').should('not.eq', 200);
            cy.contains(/invalid|incorrect/i).should('be.visible');
            cy.url().should('include', '/auth/login');
        });
    });

    describe('Authorization', () => {
        it('E2E-AUTH-002-A01: No token → visiting /dashboard/admin redirects to /auth/login', () => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.visit('/dashboard/admin');
            cy.url().should('include', '/auth/login');
        });
    });
});

describe('UJ-AUTH-003 — Password Recovery', () => {
    describe('Happy Path', () => {
        it('E2E-AUTH-003-H01: Forgot-password link navigates to recovery page', () => {
            cy.visit('/auth/login');
            cy.get('[data-testid="forgot-password-link"]').click();
            cy.url().should('include', '/auth/forgot-password');
        });

        it('E2E-AUTH-003-H02: Valid email succeeds in requesting reset', () => {
            cy.intercept('POST', '**/api/auth/forgot-password').as('forgotPw');

            cy.visit('/auth/forgot-password');
            cy.get('[data-testid="email-input"]').type('scout@academy.com');
            cy.get('[data-testid="send-reset-btn"]').click();

            cy.wait('@forgotPw');
            cy.contains(/reset email sent|check your email/i).should('be.visible');
        });
    });

    describe('Failure Path', () => {
        it('E2E-AUTH-003-F01: Unknown email shows error', () => {
            cy.intercept('POST', '**/api/auth/forgot-password').as('notFound');

            cy.visit('/auth/forgot-password');
            cy.get('[data-testid="email-input"]').type('ghost_does_not_exist@example.com');
            cy.get('[data-testid="send-reset-btn"]').click();

            cy.wait('@notFound').its('response.statusCode').should('not.eq', 200);
            cy.contains(/no account found|not found/i).should('be.visible');
        });

        it('E2E-AUTH-003-F02: Expired token shows error', () => {
            cy.intercept('POST', '**/api/auth/reset-password').as('badToken');

            cy.visit('/auth/reset-password/expired-or-invalid-token');
            cy.get('[data-testid="password-input"]').type('AnyPass123!');
            cy.get('[data-testid="confirmPassword-input"]').type('AnyPass123!');
            cy.get('[data-testid="reset-password-btn"]').click();

            cy.wait('@badToken').its('response.statusCode').should('not.eq', 200);
            cy.contains(/expired|invalid/i).should('be.visible');
        });

        it('E2E-AUTH-003-F03: Mismatched passwords disable the reset button', () => {
            cy.visit('/auth/reset-password/any-token');
            cy.get('[data-testid="password-input"]').type('Pass123!');
            cy.get('[data-testid="confirmPassword-input"]').type('Different456!');
            cy.get('[data-testid="reset-password-btn"]').should('be.disabled');
        });
    });
});
