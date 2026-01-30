describe('Coach Profile', () => {
    it('should display coach details', () => {
        cy.intercept('GET', '**/academy-staff/1', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 1,
                    name: 'Coach Carter',
                    role: 'Head Coach',
                    bio: 'Experienced coach with 10+ years.',
                    imageUrl: 'https://placehold.co/400'
                }
            }
        }).as('getCoach');

        cy.visit('/coaches/1');
        cy.wait('@getCoach');

        cy.get('[data-testid="coach-name"]').should('contain', 'Coach Carter');
        cy.get('[data-testid="coach-role"]').should('contain', 'Head Coach');
        cy.get('[data-testid="coach-bio"]').should('contain', 'Experienced coach');
        cy.get('[data-testid="coach-image"]').should('be.visible');
        cy.get('[data-testid="back-link"]').should('be.visible');
    });

    it('should show placeholder for missing image', () => {
        cy.intercept('GET', '**/academy-staff/2', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    id: 2,
                    name: 'Coach NoImage',
                    role: 'Assistant',
                    bio: 'Bio text',
                    imageUrl: null
                }
            }
        }).as('getCoachNoImage');

        cy.visit('/coaches/2');
        cy.wait('@getCoachNoImage');

        cy.get('[data-testid="coach-image-placeholder"]').should('be.visible');
    });
});
