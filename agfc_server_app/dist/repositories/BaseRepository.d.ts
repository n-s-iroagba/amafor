import { Model, ModelCtor, FindOptions, CreateOptions, UpdateOptions, DestroyOptions, WhereOptions } from 'sequelize';
export interface PaginationOptions {
    page?: number;
    limit?: number;
    offset?: number;
}
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
export declare abstract class BaseRepository<T extends Model> {
    protected model: ModelCtor<T>;
    constructor(model: ModelCtor<T>);
    findById(id: string, options?: FindOptions): Promise<T | null>;
    findAll(options?: FindOptions): Promise<T[]>;
    findOne(options: FindOptions): Promise<T | null>;
    create(data: any, options?: CreateOptions): Promise<T>;
    update(id: string, data: any, options?: UpdateOptions): Promise<[number, T[]]>;
    delete(id: string, options?: DestroyOptions): Promise<number>;
    count(options?: FindOptions): Promise<number>;
    paginate(page?: number, limit?: number, options?: Omit<FindOptions, 'limit' | 'offset'>): Promise<PaginatedResult<T>>;
    exists(id: string): Promise<boolean>;
    bulkCreate(data: any[], options?: CreateOptions): Promise<T[]>;
    findByAttributes(where: WhereOptions, options?: FindOptions): Promise<T[]>;
}
//# sourceMappingURL=BaseRepository.d.ts.map