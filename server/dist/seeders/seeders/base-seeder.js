"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSeederAlt = exports.BaseSeeder = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
class BaseSeeder {
    constructor(model, name) {
        this.model = model;
        this.name = name;
    }
    // Add this method to satisfy the Seeder interface
    getName() {
        return this.name;
    }
    async seed(options = {}) {
        const { truncate = false, transaction: providedTransaction, environment = process.env.NODE_ENV || 'development', skipIfExists = false, batchSize = 1000, validate = true } = options;
        const useTransaction = !providedTransaction;
        const transaction = providedTransaction || await this.model.sequelize.transaction();
        logger_1.default.info(`Starting ${this.name} seeder for ${environment} environment...`);
        try {
            // Check if we should skip seeding
            if (skipIfExists) {
                const existingCount = await this.model.count({ transaction });
                if (existingCount > 0) {
                    logger_1.default.info(`Skipping ${this.name} seeder - table already has ${existingCount} records`);
                    if (useTransaction)
                        await transaction.commit();
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
                logger_1.default.info(`Truncated ${this.name} table`);
            }
            // Get data for environment
            let data = await this.getData(environment);
            if (!data || data.length === 0) {
                logger_1.default.warn(`No data to seed for ${this.name} in ${environment} environment`);
                if (useTransaction)
                    await transaction.commit();
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
            }
            else {
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
                        logger_1.default.debug(`Seeded batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(data.length / batchSize)} for ${this.name}`);
                    }
                }
            }
            if (useTransaction) {
                await transaction.commit();
            }
            logger_1.default.info(`Successfully seeded ${seededCount} ${this.name} records`);
            return seededCount;
        }
        catch (error) {
            if (useTransaction) {
                await transaction.rollback();
            }
            logger_1.default.error(`Error seeding ${this.name}:`, {
                error: error.message,
                stack: error.stack,
                environment
            });
            throw error;
        }
    }
    async clear(transaction) {
        try {
            const count = await this.model.count();
            await this.model.destroy({
                where: {},
                force: true,
                truncate: true,
                cascade: true,
                transaction
            });
            logger_1.default.info(`Cleared ${count} ${this.name} records`);
            return count;
        }
        catch (error) {
            logger_1.default.error(`Error clearing ${this.name}:`, error);
            throw error;
        }
    }
}
exports.BaseSeeder = BaseSeeder;
// Alternative: Type-safe version with both Model and Attributes
class BaseSeederAlt {
    constructor(model, name) {
        this.model = model;
        this.name = name;
    }
    // Add this method to satisfy the Seeder interface
    getName() {
        return this.name;
    }
    async seed(options = {}) {
        const data = await this.getData(options.environment || process.env.NODE_ENV || 'development');
        // Type assertion is safe here because T extends CreationAttributes<M>
        const result = await this.model.bulkCreate(data, {
            transaction: options.transaction,
            validate: options.validate !== false,
            returning: true,
            ignoreDuplicates: true
        });
        return result.length;
    }
}
exports.BaseSeederAlt = BaseSeederAlt;
//# sourceMappingURL=base-seeder.js.map