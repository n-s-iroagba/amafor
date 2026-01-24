// data/development/trialist.ts
import { TrialistAttributes } from "../../../models/Trialist";

export const developmentTrialists: TrialistAttributes[] = [
  {
    id: 't1t1t1t1-t1t1-t1t1-t1t1-t1t1t1t1t1t1',
    firstName: 'Emmanuel',
    lastName: 'Chigozie',
    email: 'emmanuel.c@example.com',
    phone: '+2348123456780',
    dob: new Date('2007-03-12'), // 18 years old approx
    position: 'Midfielder',
    preferredFoot: 'RIGHT',
    height: 175,
    weight: 68,
    previousClub: 'Grassroots FC',
    videoUrl: 'https://youtube.com/watch?v=trialist1',
    cvUrl: 'https://docs.google.com/document/d/trialist1',
    status: 'PENDING',
    notes: 'Submitted application via portal. Claims to have played in state finals.',
    consentEmail: true,
    consentSmsWhatsapp: true,
    guardianConsent: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 't2t2t2t2-t2t2-t2t2-t2t2-t2t2t2t2t2t2',
    firstName: 'Tunde',
    lastName: 'Bakare',
    email: 'tunde.b@example.com',
    phone: '+2348098765431',
    dob: new Date('2006-11-05'),
    position: 'Goalkeeper',
    preferredFoot: 'BOTH',
    height: 188,
    weight: 75,
    previousClub: 'Lagos United Academy',
    videoUrl: 'https://youtube.com/watch?v=trialist2',
    cvUrl: undefined,
    status: 'INVITED',
    notes: 'Scouted during open trials. Excellent reflexes. Invited for 2-week observation.',
    consentEmail: true,
    consentSmsWhatsapp: false,
    guardianConsent: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];