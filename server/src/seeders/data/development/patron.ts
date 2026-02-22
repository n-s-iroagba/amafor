// data/development/patron.ts
import { PatronAttributes } from "../../../models/Patron";

export const developmentPatrons: PatronAttributes[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Dr. Nekezieh Francis Jonathan Ekeh',
    email: 'nekeziehekeh@amaforgaladiatorsfc.com',
    phoneNumber: '+2348012345678',
    imageUrl: 'https://res.cloudinary.com/dh2cpesxu/image/upload/v1764675944/amafor/cmzjxzz2xfgeyswhqeiv.jpg',
    bio: 'Project Sponsor. Intrested in youth development in Amafor Imerienwe.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Mr. Darlignton Nnanna E',
    email: 'darlingtonkeh@amaforgaladiators.com',
    phoneNumber: '+2348098765432',
    imageUrl: 'https://res.cloudinary.com/dh2cpesxu/image/upload/v1764470838/amafor/vpbd0pd2oghsniv47m3b.jpg',
    bio: 'Local business tycoon and philanthropist. Sponsors the annual under-17 tournament.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

];
