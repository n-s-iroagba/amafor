// data/development/academy-staff.ts
import { AcademyStaffAttributes } from "../../../models/AcademyStaff";

export const developmentAcademyStaff: AcademyStaffAttributes[] = [
  {
    id: '99999999-9999-9999-9999-999999999999',
    name: 'Coach Michael Johnson',
    role: 'Head Coach',
    bio: 'Former national team captain with 15 years of coaching experience. Specializes in tactical analysis and youth development.',
    initials: 'MJ',
    category: 'coaching',
    imageUrl: 'https://placehold.co/400x400/1d3557/ffffff?text=MJ',
    qualifications: ['UEFA Pro License', 'CAF A License'],
    yearsOfExperience: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Dr. Chioma West',
    role: 'Head Physio',
    bio: 'Specialist in sports medicine and rehabilitation. Leads the medical team ensuring player safety and rapid recovery.',
    initials: 'CW',
    category: 'medical',
    imageUrl: 'https://placehold.co/400x400/e63946/ffffff?text=CW',
    qualifications: ['PhD Sports Medicine', 'Certified Physiotherapist'],
    yearsOfExperience: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'James Carter',
    role: 'Chief Scout',
    bio: 'Renowned talent spotter with a network across West Africa. Has discovered 5 current national team players.',
    initials: 'JC',
    category: 'scouting',
    imageUrl: 'https://placehold.co/400x400/457b9d/ffffff?text=JC',
    qualifications: ['FA Talent ID Level 4'],
    yearsOfExperience: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];