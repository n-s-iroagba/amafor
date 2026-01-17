import { Model, Optional } from 'sequelize';
export interface TrialistAttributes {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: Date;
    position: string;
    preferredFoot: 'LEFT' | 'RIGHT' | 'BOTH';
    height?: number;
    weight?: number;
    previousClub?: string;
    videoUrl?: string;
    cvUrl?: string;
    status: 'PENDING' | 'REVIEWED' | 'INVITED' | 'REJECTED';
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface TrialistCreationAttributes extends Optional<TrialistAttributes, 'id' | 'status' | 'notes'> {
}
export declare class Trialist extends Model<TrialistAttributes, TrialistCreationAttributes> implements TrialistAttributes {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: Date;
    position: string;
    preferredFoot: 'LEFT' | 'RIGHT' | 'BOTH';
    height?: number;
    weight?: number;
    previousClub?: string;
    videoUrl?: string;
    cvUrl?: string;
    status: 'PENDING' | 'REVIEWED' | 'INVITED' | 'REJECTED';
    notes?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Trialist;
//# sourceMappingURL=Trialist.d.ts.map