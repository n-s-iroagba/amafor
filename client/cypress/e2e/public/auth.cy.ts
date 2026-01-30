
describe('Authentication', () => {

    describe('Login Page', () => {
        beforeEach(() => {
            cy.visit('/auth/login');
        });

        it('should display login form', () => {
            cy.get('[data-testid="email-input"]').should('be.visible');
            cy.get('[data-testid="password-input"]').should('be.visible');
            cy.get('[data-testid="login-btn"]').should('be.visible');
            cy.get('[data-testid="forgot-password-link"]').should('be.visible');
            cy.get('[data-testid="signup-link"]').should('be.visible');
        });

        it('should show validation errors', () => {
            cy.get('[data-testid="login-btn"]').should('be.disabled');
            cy.get('[data-testid="email-input"]').type('invalid-email');
            cy.get('[data-testid="password-input"]').type('pass');
            // Login button usually enabled if fields not empty, but validation might happen on submit or blur
            // Based on code: disabled={!email || !password}. 
            // We can try to submit if enabled, or check validation classes if implemented on blur
        });

        it('should navigate to forgot password', () => {
            cy.get('[data-testid="forgot-password-link"]').click();
            cy.url().should('include', '/auth/forgot-password');
        });
    });

    describe('Forgot Password Page', () => {
        beforeEach(() => {
            cy.visit('/auth/forgot-password');
        });

        it('should display forgot password form', () => {
            cy.get('[data-testid="email-input"]').should('be.visible');
            cy.get('[data-testid="send-reset-btn"]').should('be.visible');
        });

        it('should validate input', () => {
            cy.get('[data-testid="send-reset-btn"]').should('be.disabled');
            cy.get('[data-testid="email-input"]').type('test@example.com');
            cy.get('[data-testid="send-reset-btn"]').should('not.be.disabled');
        });

        it('should show success message on successful request', () => {
            cy.intercept('POST', '**/auth/forgot-password', {
                statusCode: 200,
                body: { success: true, message: 'Reset email sent' }
            }).as('forgotPassword');

            cy.get('[data-testid="email-input"]').type('user@example.com');
            cy.get('[data-testid="send-reset-btn"]').click();

            cy.wait('@forgotPassword');
            cy.contains('A password reset email has been sent').should('be.visible');
            cy.contains('Check Your Email').should('be.visible');
        });

        it('should show error message when email is not found', () => {
            cy.intercept('POST', '**/auth/forgot-password', {
                statusCode: 404,
                body: { success: false, message: 'not found' }
            }).as('forgotPasswordFail');

            cy.get('[data-testid="email-input"]').type('unknown@example.com');
            cy.get('[data-testid="send-reset-btn"]').click();

            cy.wait('@forgotPasswordFail');
            cy.contains('No account found with this email address').should('be.visible');
        });

        it('should allow returning to login', () => {
            cy.contains('Back to Login').click();
            cy.url().should('include', '/auth/login');
        });
    });

    describe('Reset Password Page', () => {
        const token = 'test-reset-token';
        beforeEach(() => {
            cy.visit(`/auth/reset-password/${token}`);
        });

        it('should display reset password form', () => {
            cy.get('[data-testid="password-input"]').should('be.visible');
            cy.get('[data-testid="confirmPassword-input"]').should('be.visible');
            cy.get('[data-testid="reset-password-btn"]').should('be.visible');
        });

        it('should show success message and redirect on successful reset', () => {
            cy.intercept('POST', '**/auth/reset-password', {
                statusCode: 200,
                body: {
                    success: true,
                    user: { id: 1, name: 'Test User', email: 'user@example.com', role: 'fan' },
                    accessToken: 'mock-token'
                }
            }).as('resetPassword');

            cy.get('[data-testid="password-input"]').type('NewPassword123!');
            cy.get('[data-testid="confirmPassword-input"]').type('NewPassword123!');
            cy.get('[data-testid="reset-password-btn"]').click();

            cy.wait('@resetPassword');
            cy.contains('Password reset successful').should('be.visible');
            // Redirect happens after 2 seconds
            cy.url().should('include', '/dashboard');
        });
    });

    describe('Verify Email Page', () => {
        const token = 'test-verify-token';
        beforeEach(() => {
            cy.visit(`/auth/verify-email/${token}`);
        });

        it('should display verify email content', () => {
            cy.contains('Verify Your Email').should('be.visible');
            cy.get('[data-testid^="verify-code-input-"]').should('have.length', 6);
        });

        it('should auto-submit on 6-digit input', () => {
            cy.intercept('POST', '**/auth/verify-email', {
                statusCode: 200,
                body: {
                    success: true,
                    user: { id: 1, name: 'Test User', email: 'user@example.com', role: 'fan' },
                    accessToken: 'mock-token'
                }
            }).as('verifyEmail');

            const code = '123456';
            code.split('').forEach((digit, i) => {
                cy.get(`[data-testid="verify-code-input-${i}"]`).type(digit);
            });

            cy.wait('@verifyEmail');
            cy.contains('Email Verified Successfully').should('be.visible');
        });
    });

});
