import { Model, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
export interface LineupAttributes {
    id: string;
    fixtureId: string;
    playerId: string;
    position: string;
    isStarter: boolean;
    jerseyNumber?: number | null;
    captain: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export type LineupCreationAttributes = Omit<LineupAttributes, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
export declare class Lineup extends Model<InferAttributes<Lineup>, InferCreationAttributes<Lineup>> {
    id: CreationOptional<string>;
    fixtureId: string;
    playerId: string;
    position: string;
    isStarter: boolean;
    jerseyNumber: CreationOptional<number | null>;
    captain: CreationOptional<boolean>;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
    isCaptain(): boolean;
    isSubstitute(): boolean;
    getPositionCategory(): string;
    static getFixtureLineup(fixtureId: string): Promise<Lineup[]>;
    static getPlayerFixtures(playerId: string): Promise<Lineup[]>;
}
export default Lineup;
//# sourceMappingURL=Lineup.d.ts.map