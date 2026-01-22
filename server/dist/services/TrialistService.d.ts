import { ITrialistRepository } from '@repositories/TrialistRepository';
import { TrialistAttributes, TrialistCreationAttributes } from '../models/Trialist';
export interface CreateTrialistData extends Omit<TrialistCreationAttributes, 'id' | 'videoUrl' | 'cvUrl'> {
    videoFile?: Express.Multer.File;
    cvFile?: Express.Multer.File;
}
export interface UpdateTrialistData extends Partial<Omit<TrialistAttributes, 'id' | 'videoUrl' | 'cvUrl'>> {
    videoFile?: Express.Multer.File;
    cvFile?: Express.Multer.File;
}
export declare class TrialistService {
    private repository;
    constructor(repository?: ITrialistRepository);
    createTrialist(data: CreateTrialistData): Promise<TrialistAttributes>;
    getTrialistById(id: string): Promise<TrialistAttributes>;
    getAllTrialists(filters?: {
        status?: string;
        position?: string;
        search?: string;
    }, options?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'ASC' | 'DESC';
    }): Promise<{
        trialists: TrialistAttributes[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    updateTrialist(id: string, data: UpdateTrialistData): Promise<TrialistAttributes>;
    deleteTrialist(id: string): Promise<void>;
    updateTrialistStatus(id: string, status: TrialistAttributes['status']): Promise<TrialistAttributes>;
    searchTrialists(keyword: string): Promise<TrialistAttributes[]>;
    getTrialistStatistics(): Promise<{
        total: number;
        pending: number;
        reviewed: number;
        invited: number;
        rejected: number;
    }>;
    private calculateAge;
    private uploadFiles;
}
//# sourceMappingURL=TrialistService.d.ts.map