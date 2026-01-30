
describe('Public - Help', () => {
    it('should display FAQs and submit contact form', () => {
        cy.visit('/help');

        cy.contains('Help & Contact').should('be.visible');
        cy.contains('Frequently Asked Questions').should('be.visible');
        cy.contains('How can I support the club').should('be.visible');

        // Test Contact Form
        cy.get('[data-testid="input-name"]').type('John Doe');
        cy.get('[data-testid="input-email"]').type('john@example.com');
        cy.get('[data-testid="input-subject"]').type('Inquiry');
        cy.get('[data-testid="textarea-message"]').type('Hello there.');

        cy.get('[data-testid="btn-send-message"]').click();

        // Check success message (Client side state)
        cy.contains('Message sent successfully!').should('be.visible');
    });
});
