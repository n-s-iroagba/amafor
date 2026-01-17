import { FindOptions } from 'sequelize';
import { BaseRepository } from './BaseRepository';
import AcademyStaff from '@models/AcademyStaff';
export interface StaffFindOptions extends FindOptions {
    includeCategory?: boolean;
    searchTerm?: string;
    category?: string;
    minExperience?: number;
    maxExperience?: number;
}
export declare class AcademyStaffRepository extends BaseRepository<AcademyStaff> {
    constructor();
    findByCategory(category: string, options?: FindOptions): Promise<AcademyStaff[]>;
    searchStaff(searchTerm: string, options?: FindOptions): Promise<AcademyStaff[]>;
    findByExperienceRange(min: number, max: number, options?: FindOptions): Promise<AcademyStaff[]>;
    getStaffStats(): Promise<{
        total: number;
        byCategory: Record<string, number>;
        averageExperience: number;
        withQualifications: number;
    }>;
    getQualificationCounts(): Promise<Record<string, number>>;
    findWithAdvancedOptions(options: StaffFindOptions): Promise<AcademyStaff[]>;
}
//# sourceMappingURL=AcademyStaffRepository.d.ts.map