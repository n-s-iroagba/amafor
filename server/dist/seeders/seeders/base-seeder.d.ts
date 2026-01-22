import { ModelStatic, Transaction, CreationAttributes, Model } from 'sequelize';
export interface SeedOptions {
    truncate?: boolean;
    transaction?: Transaction;
    environment?: string;
    skipIfExists?: boolean;
    batchSize?: number;
    validate?: boolean;
}
export declare abstract class BaseSeeder<T extends Model> {
    protected model: ModelStatic<T>;
    name: string;
    constructor(model: ModelStatic<T>, name: string);
    getName(): string;
    abstract getData(environment: string): CreationAttributes<T>[] | Promise<CreationAttributes<T>[]>;
    seed(options?: SeedOptions): Promise<number>;
    clear(transaction?: Transaction): Promise<number>;
}
export declare abstract class BaseSeederAlt<M extends Model, T extends CreationAttributes<M>> {
    protected model: ModelStatic<M>;
    name: string;
    constructor(model: ModelStatic<M>, name: string);
    getName(): string;
    abstract getData(environment: string): T[] | Promise<T[]>;
    seed(options?: SeedOptions): Promise<number>;
}
//# sourceMappingURL=base-seeder.d.ts.map