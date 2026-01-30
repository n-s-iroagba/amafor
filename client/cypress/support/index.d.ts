/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to login via UI.
         * @example cy.login('user@example.com', 'password')
         */
        login(email: string, password: string): Chainable<void>;
    }
}
