import AcademyStaff from "@models/AcademyStaff";
export interface CreateStaffDTO {
    name: string;
    role: string;
    bio: string;
    initials?: string;
    imageUrl?: string;
    category?: string;
    qualifications?: string[];
    yearsOfExperience?: number;
}
export interface UpdateStaffDTO extends Partial<CreateStaffDTO> {
}
export interface StaffFilters {
    category?: string;
    searchTerm?: string;
    minExperience?: number;
    maxExperience?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface StaffStats {
    total: number;
    byCategory: Record<string, number>;
    averageExperience: number;
    withQualifications: number;
    topQualifications: Array<{
        qualification: string;
        count: number;
    }>;
}
export declare class AcademyStaffService {
    private staffRepository;
    private auditService;
    constructor();
    createStaff(data: CreateStaffDTO, userId: string): Promise<AcademyStaff>;
    getStaffById(id: string): Promise<AcademyStaff | null>;
    getAllStaff(filters?: StaffFilters): Promise<{
        data: AcademyStaff[];
        total: number;
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    }>;
    updateStaff(id: string, data: UpdateStaffDTO, userId: string): Promise<AcademyStaff>;
    deleteStaff(id: string, userId: string): Promise<void>;
    getStaffStats(): Promise<StaffStats>;
    searchStaffByName(name: string): Promise<AcademyStaff[]>;
    getStaffByCategory(category: string): Promise<AcademyStaff[]>;
    bulkImportStaff(staffData: CreateStaffDTO[], userId: string): Promise<AcademyStaff[]>;
}
//# sourceMappingURL=AcademyStaffService.d.ts.map