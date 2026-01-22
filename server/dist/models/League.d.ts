import { Model, Optional } from 'sequelize';
export interface LeagueAttributes {
    id: string;
    name: string;
    season: string;
    isFriendly: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface LeagueCreationAttributes extends Optional<LeagueAttributes, 'id'> {
}
declare class League extends Model<LeagueAttributes, LeagueCreationAttributes> implements LeagueAttributes {
    id: string;
    name: string;
    season: string;
    isFriendly: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default League;
//# sourceMappingURL=League.d.ts.map