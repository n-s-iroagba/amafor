
describe('Public - Home Page', () => {
    beforeEach(() => {
        // Mock minimal necessary data for home page sections
        cy.intercept('GET', '**/fixtures/next-upcoming', { body: { success: true, data: null } }).as('getNextFixture');
        cy.intercept('GET', '**/articles/published*', { body: { success: true, data: [] } }).as('getNews');
        cy.intercept('GET', '**/fixtures/gallery*', { body: { success: true, data: [] } }).as('getGallery');
    });

    it('should render main home page sections', () => {
        cy.visit('/');

        // Header & Hero (Static mostly)
        cy.get('header').should('be.visible');

        // Sections check (IDs or distinctive text)
        // Let's check for the Support/Footer sections which are common
        cy.get('footer').should('be.visible');

        // Check navigation exist
        cy.contains('News').should('be.visible');
        cy.contains('Fixtures').should('be.visible');
    });
});
