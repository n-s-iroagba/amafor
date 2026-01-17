import { Trialist, TrialistAttributes, TrialistCreationAttributes } from '../models/Trialist';
import { BaseRepository } from './BaseRepository';
export interface ITrialistRepository {
    create(data: TrialistCreationAttributes): Promise<Trialist>;
    findAllFiltered(filter?: any, options?: any): Promise<{
        rows: Trialist[];
        count: number;
    }>;
    findById(id: string): Promise<Trialist | null>;
    findByEmail(email: string): Promise<Trialist | null>;
    update(id: string, data: Partial<TrialistAttributes>): Promise<[number, Trialist[]]>;
    delete(id: string): Promise<number>;
    updateStatus(id: string, status: TrialistAttributes['status']): Promise<[number, Trialist[]]>;
    findByStatus(status: TrialistAttributes['status']): Promise<Trialist[]>;
    searchByKeyword(keyword: string): Promise<Trialist[]>;
    getStatistics(): Promise<{
        total: number;
        pending: number;
        reviewed: number;
        invited: number;
        rejected: number;
    }>;
}
export declare class TrialistRepository extends BaseRepository<Trialist> implements ITrialistRepository {
    constructor();
    findByEmail(email: string): Promise<Trialist | null>;
    updateStatus(id: string, status: TrialistAttributes['status']): Promise<[number, Trialist[]]>;
    findByStatus(status: TrialistAttributes['status']): Promise<Trialist[]>;
    searchByKeyword(keyword: string): Promise<Trialist[]>;
    getStatistics(): Promise<{
        total: number;
        pending: number;
        reviewed: number;
        invited: number;
        rejected: number;
    }>;
    findAllFiltered(filter?: {
        status?: string;
        position?: string;
        search?: string;
    }, options?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'ASC' | 'DESC';
    }): Promise<{
        rows: Trialist[];
        count: number;
    }>;
}
//# sourceMappingURL=TrialistRepository.d.ts.map