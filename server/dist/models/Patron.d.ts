import { Model, Optional } from 'sequelize';
export interface PatronAttributes {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    imageUrl?: string;
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface PatronCreationAttributes extends Optional<PatronAttributes, 'id'> {
}
declare class Patron extends Model<PatronAttributes, PatronCreationAttributes> implements PatronAttributes {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    imageUrl: string;
    bio: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Patron;
//# sourceMappingURL=Patron.d.ts.map