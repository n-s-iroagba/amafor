import { Model, Optional } from 'sequelize';
export interface CoachAttributes {
    id: number;
    name: string;
    role: string;
    imageUrl: string;
    bio: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface CoachCreationAttributes extends Optional<CoachAttributes, 'id'> {
}
declare class Coach extends Model<CoachAttributes, CoachCreationAttributes> implements CoachAttributes {
    id: number;
    name: string;
    role: string;
    imageUrl: string;
    bio: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Coach;
//# sourceMappingURL=Coach.d.ts.map