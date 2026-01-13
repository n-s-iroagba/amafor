// types/staff.ts
export interface AcademyStaff {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials?: string;
  imageUrl?: string;
  category?: string; // e.g., 'coaching', 'medical', 'administrative'
  qualifications?: string[];
  yearsOfExperience?: number;
}

export interface Trialist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  position: string;
  preferredFoot: 'LEFT' | 'RIGHT' | 'BOTH';
  height?: number; // in cm
  weight?: number; // in kg
  previousClub?: string;
  videoUrl?: string; // Link to highlight reel
  cvUrl?: string; // Link to resume
  status: 'PENDING' | 'REVIEWED' | 'INVITED' | 'REJECTED';
  notes?: string; // Internal scout notes
  createdAt?: Date;
  updatedAt?: Date;
}