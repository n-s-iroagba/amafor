import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../config/database';
import { syncDatabase } from '../models';
import { seeder } from '../seeders/seeders';
import logger from '../utils/logger';

const environment = process.env.NODE_ENV || 'development';

async function runSeeders() {
  try {
    logger.info(`Starting seed script for "${environment}" environment...`);

    // 1. Verify database connection
    await sequelize.authenticate();
    logger.info('Database connection established');

    // 2. Sync models (creates tables if they don't exist, no force drop)
    await syncDatabase(false);
    logger.info('Database models synchronized');

    // 3. Run all seeders in dependency order
    await seeder.runAll();
    logger.info(`All seeders completed successfully for "${environment}"`);

    process.exit(0);
  } catch (error) {
    logger.error('Failed to run seeders:', error);
    process.exit(1);
  }
}

runSeeders();

export { runSeeders };