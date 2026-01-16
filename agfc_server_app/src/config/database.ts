import { Dialect, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

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

const config: DatabaseConfig = {
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '97chocho',
  database: process.env.DB_NAME || 'agfc',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  dialect: 'mysql',
  logging: process.env.NODE_ENV !== 'production' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool
  }
);

export default sequelize;
export { Sequelize };