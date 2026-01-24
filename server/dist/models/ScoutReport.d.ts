import { Model, Optional } from 'sequelize';
interface ScoutReportAttributes {
    id: string;
    playerId: string;
    scoutId: string;
    reportType: string;
    reportUrl: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface ScoutReportCreationAttributes extends Optional<ScoutReportAttributes, 'id'> {
}
declare class ScoutReport extends Model<ScoutReportAttributes, ScoutReportCreationAttributes> implements ScoutReportAttributes {
    id: string;
    playerId: string;
    scoutId: string;
    reportType: string;
    reportUrl: string;
    content: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default ScoutReport;
//# sourceMappingURL=ScoutReport.d.ts.map