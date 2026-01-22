import { Model, Optional } from 'sequelize';
export interface AcademyStaffAttributes {
    id: string;
    name: string;
    role: string;
    bio: string;
    initials?: string;
    imageUrl?: string;
    category?: string;
    qualifications?: string[];
    yearsOfExperience?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface AcademyStaffCreationAttributes extends Optional<AcademyStaffAttributes, 'id' | 'initials' | 'imageUrl' | 'category' | 'qualifications' | 'yearsOfExperience'> {
}
declare class AcademyStaff extends Model<AcademyStaffAttributes, AcademyStaffCreationAttributes> implements AcademyStaffAttributes {
    id: string;
    name: string;
    role: string;
    bio: string;
    initials?: string;
    imageUrl?: string;
    category?: string;
    qualifications?: string[];
    yearsOfExperience?: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default AcademyStaff;
//# sourceMappingURL=AcademyStaff.d.ts.map