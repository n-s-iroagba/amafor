import { AcademyStaffRepository } from '@/repositories/AcademyStaffRepository';
import { AuditService } from './AuditService';
import AcademyStaff, { AcademyStaffCreationAttributes, AcademyStaffAttributes } from '@/models/AcademyStaff';
import { logger } from '@/utils/logger';
import { tracer } from '@/utils/tracer';

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

export interface UpdateStaffDTO extends Partial<CreateStaffDTO> {}

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
  topQualifications: Array<{ qualification: string; count: number }>;
}

export class AcademyStaffService {
  private staffRepository: AcademyStaffRepository;
  private auditService: AuditService;

  constructor() {
    this.staffRepository = new AcademyStaffRepository();
    this.auditService = new AuditService();
  }

  async createStaff(data: CreateStaffDTO, userId: string): Promise<AcademyStaff> {
    return tracer.startActiveSpan('service.AcademyStaffService.createStaff', async (span) => {
      try {
        span.setAttributes({
          staffName: data.name,
          userId,
          role: data.role
        });

        // Generate initials if not provided
        if (!data.initials) {
          data.initials = data.name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);
        }

        // Validate category
        const validCategories = ['coaching', 'medical', 'administrative', 'technical', 'scouting'];
        if (data.category && !validCategories.includes(data.category)) {
          throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
        }

        const staff = await this.staffRepository.create(data);

        // Audit log
        await this.auditService.logAction({
          userId,
          userType: 'admin',
          action: 'CREATE',
          entityType: 'STAFF',
          entityId: staff.id,
          entityName: staff.name,
          changes: Object.keys(data).map(field => ({
            field,
            newValue: (data as any)[field]
          })),
          ipAddress: '0.0.0.0',
          metadata: { role: data.role, category: data.category }
        });

        logger.info('STAFF_CREATED', {
          staffId: staff.id,
          name: staff.name,
          role: staff.role,
          userId
        });

        return staff;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('STAFF_CREATE_ERROR', {
          error: error.message,
          data,
          userId
        });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getStaffById(id: string): Promise<AcademyStaff | null> {
    return tracer.startActiveSpan('service.AcademyStaffService.getStaffById', async (span) => {
      try {
        span.setAttribute('staffId', id);
        return await this.staffRepository.findById(id, {
          attributes: { exclude: ['deletedAt'] }
        });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('STAFF_FETCH_ERROR', { error: error.message, staffId: id });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getAllStaff(filters: StaffFilters = {}): Promise<{
    data: AcademyStaff[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    return tracer.startActiveSpan('service.AcademyStaffService.getAllStaff', async (span) => {
      try {
        const {
          page = 1,
          limit = 20,
          category,
          searchTerm,
          minExperience,
          maxExperience,
          sortBy = 'name',
          sortOrder = 'asc'
        } = filters;

        const where: any = {};
        
        if (category) where.category = category;
        if (searchTerm) {
          where[AcademyStaff.sequelize!.Op.or] = [
            { name: { [AcademyStaff.sequelize!.Op.like]: `%${searchTerm}%` } },
            { role: { [AcademyStaff.sequelize!.Op.like]: `%${searchTerm}%` } }
          ];
        }
        
        if (minExperience !== undefined || maxExperience !== undefined) {
          where.yearsOfExperience = {};
          if (minExperience !== undefined) {
            where.yearsOfExperience[AcademyStaff.sequelize!.Op.gte] = minExperience;
          }
          if (maxExperience !== undefined) {
            where.yearsOfExperience[AcademyStaff.sequelize!.Op.lte] = maxExperience;
          }
        }

        const order: any = [[sortBy, sortOrder]];

        const result = await this.staffRepository.paginate(page, limit, {
          where,
          order,
          attributes: { exclude: ['deletedAt'] }
        });

        span.setAttributes({
          page,
          limit,
          total: result.total,
          filteredCount: result.data.length
        });

        return result;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('STAFF_LIST_ERROR', { error: error.message, filters });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async updateStaff(id: string, data: UpdateStaffDTO, userId: string): Promise<AcademyStaff> {
    return tracer.startActiveSpan('service.AcademyStaffService.updateStaff', async (span) => {
      try {
        span.setAttributes({
          staffId: id,
          userId
        });

        // Get existing staff to log changes
        const existingStaff = await this.getStaffById(id);
        if (!existingStaff) {
          throw new Error('Staff member not found');
        }

        // Validate category if provided
        if (data.category) {
          const validCategories = ['coaching', 'medical', 'administrative', 'technical', 'scouting'];
          if (!validCategories.includes(data.category)) {
            throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
          }
        }

        const [updatedCount, updatedStaff] = await this.staffRepository.update(id, data);
        
        if (updatedCount === 0) {
          throw new Error('Staff member not found or no changes made');
        }

        // Log changes for audit
        const changes = Object.keys(data)
          .filter(key => (data as any)[key] !== (existingStaff as any)[key])
          .map(field => ({
            field,
            oldValue: (existingStaff as any)[field],
            newValue: (data as any)[field]
          }));

        if (changes.length > 0) {
          await this.auditService.logAction({
            userId,
            userType: 'admin',
            action: 'UPDATE',
            entityType: 'STAFF',
            entityId: id,
            entityName: existingStaff.name,
            changes,
            ipAddress: '0.0.0.0',
            metadata: { updateFields: Object.keys(data) }
          });
        }

        logger.info('STAFF_UPDATED', {
          staffId: id,
          changes: changes.length,
          userId
        });

        return updatedStaff[0];
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('STAFF_UPDATE_ERROR', {
          error: error.message,
          staffId: id,
          data,
          userId
        });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async deleteStaff(id: string, userId: string): Promise<void> {
    return tracer.startActiveSpan('service.AcademyStaffService.deleteStaff', async (span) => {
      try {
        span.setAttributes({
          staffId: id,
          userId
        });

        const staff = await this.getStaffById(id);
        if (!staff) {
          throw new Error('Staff member not found');
        }

        const deletedCount = await this.staffRepository.delete(id);
        
        if (deletedCount === 0) {
          throw new Error('Failed to delete staff member');
        }

        // Audit log
        await this.auditService.logAction({
          userId,
          userType: 'admin',
          action: 'DELETE',
          entityType: 'STAFF',
          entityId: id,
          entityName: staff.name,
          changes: [],
          ipAddress: '0.0.0.0',
          metadata: { 
            role: staff.role,
            category: staff.category,
            experience: staff.yearsOfExperience
          }
        });

        logger.info('STAFF_DELETED', {
          staffId: id,
          name: staff.name,
          userId
        });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('STAFF_DELETE_ERROR', {
          error: error.message,
          staffId: id,
          userId
        });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getStaffStats(): Promise<StaffStats> {
    return tracer.startActiveSpan('service.AcademyStaffService.getStaffStats', async (span) => {
      try {
        const stats = await this.staffRepository.getStaffStats();
        const qualificationCounts = await this.staffRepository.getQualificationCounts();
        
        // Get top 5 qualifications
        const topQualifications = Object.entries(qualificationCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([qualification, count]) => ({ qualification, count }));

        const result = {
          ...stats,
          topQualifications
        };

        span.setAttributes({
          totalStaff: stats.total,
          categories: Object.keys(stats.byCategory).length,
          averageExperience: stats.averageExperience
        });

        return result;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('STAFF_STATS_ERROR', { error: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async searchStaffByName(name: string): Promise<AcademyStaff[]> {
    return tracer.startActiveSpan('service.AcademyStaffService.searchStaffByName', async (span) => {
      try {
        span.setAttribute('searchName', name);
        const staff = await this.staffRepository.searchStaff(name, {
          attributes: { exclude: ['deletedAt'] },
          limit: 10
        });
        span.setAttribute('results', staff.length);
        return staff;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('STAFF_SEARCH_ERROR', { error: error.message, name });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getStaffByCategory(category: string): Promise<AcademyStaff[]> {
    return tracer.startActiveSpan('service.AcademyStaffService.getStaffByCategory', async (span) => {
      try {
        span.setAttribute('category', category);
        const staff = await this.staffRepository.findByCategory(category, {
          attributes: { exclude: ['deletedAt'] },
          order: [['name', 'ASC']]
        });
        span.setAttribute('count', staff.length);
        return staff;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('STAFF_CATEGORY_ERROR', { error: error.message, category });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async bulkImportStaff(staffData: CreateStaffDTO[], userId: string): Promise<AcademyStaff[]> {
    return tracer.startActiveSpan('service.AcademyStaffService.bulkImportStaff', async (span) => {
      try {
        span.setAttribute('importCount', staffData.length);
        
        // Validate all records
        const validCategories = ['coaching', 'medical', 'administrative', 'technical', 'scouting'];
        const invalidRecords: string[] = [];
        
        staffData.forEach((data, index) => {
          if (data.category && !validCategories.includes(data.category)) {
            invalidRecords.push(`Record ${index + 1}: Invalid category "${data.category}"`);
          }
        });
        
        if (invalidRecords.length > 0) {
          throw new Error(`Invalid data: ${invalidRecords.join(', ')}`);
        }
        
        // Generate initials for records without them
        const processedData = staffData.map(data => ({
          ...data,
          initials: data.initials || data.name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2)
        }));
        
        const importedStaff = await this.staffRepository.bulkCreate(processedData);
        
        // Audit log for bulk import
        await this.auditService.logAction({
          userId,
          userType: 'admin',
          action: 'BULK_IMPORT',
          entityType: 'STAFF',
          entityId: 'bulk_import',
          entityName: `${importedStaff.length} staff members`,
          changes: [],
          ipAddress: '0.0.0.0',
          metadata: { 
            count: importedStaff.length,
            categories: [...new Set(staffData.map(s => s.category))].filter(Boolean)
          }
        });
        
        logger.info('STAFF_BULK_IMPORTED', {
          count: importedStaff.length,
          userId
        });
        
        return importedStaff;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('STAFF_BULK_IMPORT_ERROR', {
          error: error.message,
          count: staffData.length,
          userId
        });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}