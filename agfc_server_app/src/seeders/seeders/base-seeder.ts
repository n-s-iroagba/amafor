// src/seeders/base-seeder.ts
import { ModelStatic, Transaction, CreationAttributes, Model } from 'sequelize';
import logger from '@utils/logger';

export interface SeedOptions {
  truncate?: boolean;
  transaction?: Transaction;
  environment?: string;
  skipIfExists?: boolean;
  batchSize?: number;
  validate?: boolean;
}

export abstract class BaseSeeder<T extends Model> {
  protected model: ModelStatic<T>;
  public name: string;
  
  constructor(model: ModelStatic<T>, name: string) {
    this.model = model;
    this.name = name;
  }
  
  // Return CreationAttributes<T> instead of T
  abstract getData(environment: string): CreationAttributes<T>[] | Promise<CreationAttributes<T>[]>;
  
  async seed(options: SeedOptions = {}): Promise<number> {
    const { 
      truncate = false, 
      transaction: providedTransaction,
      environment = process.env.NODE_ENV || 'development',
      skipIfExists = false,
      batchSize = 1000,
      validate = true
    } = options;
    
    const useTransaction = !providedTransaction;
    const transaction = providedTransaction || await this.model.sequelize!.transaction();
    
    logger.info(`Starting ${this.name} seeder for ${environment} environment...`);
    
    try {
      // Check if we should skip seeding
      if (skipIfExists) {
        const existingCount = await this.model.count({ transaction });
        if (existingCount > 0) {
          logger.info(`Skipping ${this.name} seeder - table already has ${existingCount} records`);
          if (useTransaction) await transaction.commit();
          return 0;
        }
      }
      
      // Truncate table if requested
      if (truncate) {
        await this.model.destroy({
          where: {},
          force: true,
          truncate: true,
          transaction
        });
        logger.info(`Truncated ${this.name} table`);
      }
      
      // Get data for environment
      let data = await this.getData(environment);
      
      if (!data || data.length === 0) {
        logger.warn(`No data to seed for ${this.name} in ${environment} environment`);
        if (useTransaction) await transaction.commit();
        return 0;
      }
      
      // Seed data with batching
      let seededCount = 0;
      
      if (data.length <= batchSize) {
        const result = await this.model.bulkCreate(data, {
          transaction,
          validate,
          returning: true,
          ignoreDuplicates: true,
          hooks: true
        });
        seededCount = result.length;
      } else {
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          const result = await this.model.bulkCreate(batch, {
            transaction,
            validate,
            returning: true,
            ignoreDuplicates: true,
            hooks: true
          });
          seededCount += result.length;
          
          if (i + batchSize < data.length) {
            logger.debug(`Seeded batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(data.length / batchSize)} for ${this.name}`);
          }
        }
      }
      
      if (useTransaction) {
        await transaction.commit();
      }
      
      logger.info(`Successfully seeded ${seededCount} ${this.name} records`);
      return seededCount;
      
    } catch (error: any) {
      if (useTransaction) {
        await transaction.rollback();
      }
      
      logger.error(`Error seeding ${this.name}:`, {
        error: error.message,
        stack: error.stack,
        environment
      });
      
      throw error;
    }
  }
  
  async clear(transaction?: Transaction): Promise<number> {
    try {
      const count = await this.model.count();
      
      await this.model.destroy({
        where: {},
        force: true,
        truncate: true,
        cascade: true,
        transaction
      });
      
      logger.info(`Cleared ${count} ${this.name} records`);
      return count;
    } catch (error: any) {
      logger.error(`Error clearing ${this.name}:`, error);
      throw error;
    }
  }
}

// Alternative: Type-safe version with both Model and Attributes
export abstract class BaseSeederAlt<M extends Model, T extends CreationAttributes<M>> {
  protected model: ModelStatic<M>;
  public name: string;
  
  constructor(model: ModelStatic<M>, name: string) {
    this.model = model;
    this.name = name;
  }
  
  abstract getData(environment: string): T[] | Promise<T[]>;
  
  async seed(options: SeedOptions = {}): Promise<number> {
    const data = await this.getData(options.environment || process.env.NODE_ENV || 'development');
    
    // Type assertion is safe here because T extends CreationAttributes<M>
    const result = await this.model.bulkCreate(data as CreationAttributes<M>[], {
      transaction: options.transaction,
      validate: options.validate !== false,
      returning: true,
      ignoreDuplicates: true
    });
    
    return result.length;
  }
}