describe('CMS - Article Management', () => {
    beforeEach(() => {
        // Login as Media Manager (or Admin who has access)
        cy.visit('/auth/login');
        cy.get('input[name="email"]').type('media@academy.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        // Navigate
        cy.visit('/dashboard/cms/articles');
    });

    it('should display the articles dashboard', () => {
        cy.get('h1').contains('Sports Articles').should('be.visible');
        cy.contains('Add New Article').should('be.visible');
        cy.contains('All Articles').should('be.visible');
    });

    it('should switch tabs', () => {
        cy.contains('Drafts').click();
        // Check if tab is active (logic in component uses aria-pressed or class)
        // We can check if URL changed or UI updated specific draft content
    });

    it('should navigate to create article page', () => {
        cy.contains('Add New Article').click();
        cy.url().should('include', '/dashboard/cms/articles/new');
    });
});
