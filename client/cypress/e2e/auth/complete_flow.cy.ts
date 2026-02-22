/**
 * Comprehensive Authentication Flow Tests
 *
 * All API calls are intercepted so tests run without a live backend.
 * Roles tested: admin, scout, advertiser (the only 3 valid roles).
 */

const API = {
    login: '**/auth/login',
    signup: '**/auth/signup',
    forgotPassword: '**/auth/forgot-password',
    resetPassword: '**/auth/reset-password',
    verifyEmail: '**/auth/verify-email',
    resendCode: '**/auth/resend-code',
};

// Helper: stub a successful login response for a given role
const stubLogin = (role: 'admin' | 'scout' | 'advertiser') => {
    cy.intercept('POST', API.login, {
        statusCode: 200,
        body: {
            accessToken: 'fake-access-token',
            user: {
                id: 'user-123',
                username: `${role}@test.com`,
                role,
                status: 'active',
                emailVerified: true,
            },
        },
    }).as('loginRequest');
};

const fillLogin = (email: string, password = 'Password123!') => {
    cy.visit('/auth/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-btn"]').click();
};

// ─────────────────────────────────────────────────────────────────────────────
describe('Comprehensive Authentication Flow', () => {

    // ── Admin Login ─────────────────────────────────────────────────────────
    describe('Admin Authentication', () => {
        it('should log in as Admin and redirect to Admin Dashboard', () => {
            stubLogin('admin');
            fillLogin('admin@academy.com');

            cy.wait('@loginRequest');
            cy.url().should('include', '/dashboard/admin');
        });
    });

    // ── Scout Login ──────────────────────────────────────────────────────────
    describe('Scout Authentication', () => {
        it('should log in as Scout and redirect to Scout Dashboard', () => {
            stubLogin('scout');
            fillLogin('scout@academy.com');

            cy.wait('@loginRequest');
            cy.url().should('include', '/dashboard/scout');
        });
    });

    // ── Advertiser Login ─────────────────────────────────────────────────────
    describe('Advertiser Authentication', () => {
        it('should log in as Advertiser and redirect to Advertiser Dashboard', () => {
            stubLogin('advertiser');
            fillLogin('advertiser@academy.com');

            cy.wait('@loginRequest');
            cy.url().should('include', '/dashboard/advertiser');
        });
    });

    // ── Unverified user → redirect to verify email ───────────────────────────
    describe('Unverified User Flow', () => {
        it('should redirect to verify-email when account is unverified', () => {
            cy.intercept('POST', API.login, {
                statusCode: 200,
                body: {
                    verificationToken: 'tok-abc123',
                    id: 'user-999',
                },
            }).as('unverifiedLogin');

            fillLogin('unverified@example.com');
            cy.wait('@unverifiedLogin');
            cy.url().should('include', '/auth/verify-email/tok-abc123');
        });
    });

    // ── Invalid credentials ──────────────────────────────────────────────────
    describe('Invalid Credentials', () => {
        it('should show error on wrong password', () => {
            cy.intercept('POST', API.login, {
                statusCode: 401,
                body: { message: 'Invalid credentials' },
            }).as('badLogin');

            fillLogin('someone@example.com', 'wrongpass');
            cy.wait('@badLogin');
            cy.contains(/invalid email or password|invalid credentials/i).should('be.visible');
        });
    });

    // ── Signup Entry Point ────────────────────────────────────────────────────
    describe('Signup Entry Point', () => {
        it('should redirect to /advertise/register when Create Account is clicked', () => {
            cy.visit('/auth/login');
            cy.get('[data-testid="signup-link"]').click();
            cy.url().should('include', '/advertise/register');
        });
    });

    // ── Forgot Password Flow ──────────────────────────────────────────────────
    describe('Forgot Password Flow', () => {
        it('should submit forgot password form and show success message', () => {
            cy.intercept('POST', API.forgotPassword, {
                statusCode: 200,
                body: { message: 'Reset email sent' },
            }).as('forgotRequest');

            cy.visit('/auth/forgot-password');
            cy.get('[data-testid="email-input"]').type('user@example.com');
            cy.get('[data-testid="send-reset-btn"]').click();
            cy.wait('@forgotRequest');

            cy.contains(/password reset email has been sent/i).should('be.visible');
        });

        it('should show Back to Login link on forgot password page', () => {
            cy.visit('/auth/forgot-password');
            cy.contains(/back to login/i).should('be.visible');
        });
    });

    // ── Reset Password Flow ───────────────────────────────────────────────────
    describe('Reset Password Flow', () => {
        it('should reset password and show success message', () => {
            cy.intercept('POST', API.resetPassword, {
                statusCode: 200,
                body: {
                    accessToken: 'new-access-token',
                    user: {
                        id: 'user-123',
                        username: 'user@example.com',
                        role: 'admin',
                        status: 'active',
                        emailVerified: true,
                    },
                },
            }).as('resetRequest');

            cy.visit('/auth/reset-password/fake-token-123');

            cy.get('[data-testid="password-input"]').type('NewPassword123!');
            cy.get('[data-testid="confirmPassword-input"]').type('NewPassword123!');
            cy.get('[data-testid="reset-password-btn"]').click();
            cy.wait('@resetRequest');

            cy.contains(/password reset successful|success/i).should('be.visible');
        });

        it('should show error when passwords do not match', () => {
            cy.visit('/auth/reset-password/fake-token-123');

            cy.get('[data-testid="password-input"]').type('Password123!');
            cy.get('[data-testid="confirmPassword-input"]').type('Different456!');
            cy.get('[data-testid="reset-password-btn"]').click();

            cy.contains(/passwords don't match/i).should('be.visible');
        });
    });

    // ── Email Verification Page ───────────────────────────────────────────────
    describe('Email Verification Page', () => {
        it('should show 6-digit code inputs', () => {
            cy.visit('/auth/verify-email/fake-token-abc');

            for (let i = 0; i < 6; i++) {
                cy.get(`[data-testid="verify-code-input-${i}"]`).should('be.visible');
            }

            cy.get('[data-testid="verify-email-btn"]').should('be.disabled');
        });

        it('should verify email on valid code and redirect', () => {
            cy.intercept('POST', API.verifyEmail, {
                statusCode: 200,
                body: {
                    accessToken: 'verify-access-token',
                    user: {
                        id: 'user-123',
                        username: 'user@example.com',
                        role: 'advertiser',
                        status: 'active',
                        emailVerified: true,
                    },
                },
            }).as('verifyRequest');

            cy.visit('/auth/verify-email/fake-token-abc');

            // Type each digit
            for (let i = 0; i < 6; i++) {
                cy.get(`[data-testid="verify-code-input-${i}"]`).type('1');
            }

            cy.get('[data-testid="verify-email-btn"]').click();
            cy.wait('@verifyRequest');

            cy.contains(/email verified successfully/i).should('be.visible');
        });
    });

    // ── Advertise Landing Page ────────────────────────────────────────────────
    describe('Advertise Landing Page', () => {
        it('should display the advertise info page with register buttons', () => {
            cy.visit('/advertise');
            cy.get('[data-testid="hero-register-btn"]').should('be.visible');
            cy.get('[data-testid="cta-register-btn"]').should('be.visible');
        });
    });
});
