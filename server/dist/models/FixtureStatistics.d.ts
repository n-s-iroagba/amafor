import { Model, Optional } from 'sequelize';
export interface FixtureStatisticsAttributes {
    id: string;
    fixtureId: string;
    homePossession: number;
    awayPossession: number;
    homeShots: number;
    awayShots: number;
    homeShotsOnTarget: number;
    awayShotsOnTarget: number;
    homeCorners: number;
    awayCorners: number;
    homeFouls: number;
    awayFouls: number;
    homeYellowCards: number;
    awayYellowCards: number;
    homeRedCards: number;
    awayRedCards: number;
    homeOffsides: number;
    awayOffsides: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface FixtureStatisticsCreationAttributes extends Optional<FixtureStatisticsAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class FixtureStatistics extends Model<FixtureStatisticsAttributes, FixtureStatisticsCreationAttributes> implements FixtureStatisticsAttributes {
    id: string;
    fixtureId: string;
    homePossession: number;
    awayPossession: number;
    homeShots: number;
    awayShots: number;
    homeShotsOnTarget: number;
    awayShotsOnTarget: number;
    homeCorners: number;
    awayCorners: number;
    homeFouls: number;
    awayFouls: number;
    homeYellowCards: number;
    awayYellowCards: number;
    homeRedCards: number;
    awayRedCards: number;
    homeOffsides: number;
    awayOffsides: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default FixtureStatistics;
//# sourceMappingURL=FixtureStatistics.d.ts.map