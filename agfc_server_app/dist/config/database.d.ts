import { Dialect, Sequelize } from 'sequelize';
export interface DatabaseConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
    dialect: Dialect;
    logging: boolean | ((sql: string, timing?: number) => void);
    pool: {
        max: number;
        min: number;
        acquire: number;
        idle: number;
    };
}
declare const sequelize: any;
export default sequelize;
export { Sequelize };
//# sourceMappingURL=database.d.ts.map