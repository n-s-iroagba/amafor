"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentMatchImages = void 0;
// IDs from previous steps
// Note: Fixture ID in MatchImage model is defined as UUID in DB but referred to in interface
// Ensure the ID string matches exactly.
const FIXTURE_ID = 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1';
exports.developmentMatchImages = [
    {
        id: 1,
        fixtureId: FIXTURE_ID,
        imageUrl: 'https://placehold.co/800x600/1d3557/ffffff?text=Match+Kickoff',
        caption: 'The teams lining up before the kickoff.',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 2,
        fixtureId: FIXTURE_ID,
        imageUrl: 'https://placehold.co/800x600/e63946/ffffff?text=Goal+Celebration',
        caption: 'Musa Ibrahim celebrating the opening goal.',
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];
//# sourceMappingURL=matchimages.js.map