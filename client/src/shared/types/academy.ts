export interface AcademyStaff {
    id: string;
    name: string;
    role: string;
    bio: string;
    initials?: string;
    imageUrl?: string;
    category?: string;
    qualifications?: string[];
    yearsOfExperience?: number;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export interface Trialist {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string | Date;
    position: string;
    preferredFoot: 'LEFT' | 'RIGHT' | 'BOTH';
    height?: number;
    weight?: number;
    previousClub?: string;
    videoUrl?: string;
    cvUrl?: string;
    status: 'PENDING' | 'REVIEWED' | 'INVITED' | 'ATTENDED' | 'NO_SHOW' | 'ACCEPTED' | 'REJECTED';
    notes?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
