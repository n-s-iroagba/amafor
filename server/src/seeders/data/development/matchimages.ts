// data/development/match-image.ts
import { FixtureImageAttributes } from "../../../models/FixtureImage";

// IDs from previous steps
// Note: Fixture ID in FixtureImage model is defined as UUID in DB but referred to in interface
// Ensure the ID string matches exactly.
const FIXTURE_ID = 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1';

export const developmentFixtureImages: FixtureImageAttributes[] = [
  {
    id: '1e5e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e51',
    fixtureId: FIXTURE_ID as any, // Type casting if interface expects number vs UUID string
    imageUrl: 'https://placehold.co/800x600/1d3557/ffffff?text=Fixture+Kickoff',
    caption: 'The teams lining up before the kickoff.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '1e5e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e52',
    fixtureId: FIXTURE_ID as any,
    imageUrl: 'https://placehold.co/800x600/e63946/ffffff?text=Goal+Celebration',
    caption: 'Musa Ibrahim celebrating the opening goal.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];