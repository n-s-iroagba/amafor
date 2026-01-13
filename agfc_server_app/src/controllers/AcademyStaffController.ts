import { Request, Response, NextFunction } from 'express';
import { AcademyStaffService, CreateStaffDTO, UpdateStaffDTO, StaffFilters } from '@/services/AcademyStaffService';
import { logger } from '@/utils/logger';
import { tracer } from '@/utils/tracer';
import { validationResult } from 'express-validator';

export class AcademyStaffController {
  private staffService: AcademyStaffService;

  constructor() {
    this.staffService = new AcademyStaffService();
  }

  async createStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    return tracer.startActiveSpan('controller.AcademyStaffController.createStaff', async (span) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          span.setStatus({ code: 2, message: 'Validation failed' });
          res.status(400).json({
            success: false,
            errorCode: 'VALIDATION_ERROR',
            message: 'Validation failed',
            errors: errors.array()
          });
          return;
        }

        const data: CreateStaffDTO = req.body;
        const userId = (req as any).user?.id || 'system';

        const staff = await this.staffService.createStaff(data, userId);

        span.setAttributes({
          staffId: staff.id,
          staffName: staff.name
        });

        res.status(201).json({
          success: true,
          data: staff,
          message: 'Staff member created successfully'
        });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('CONTROLLER_STAFF_CREATE_ERROR', {
          error: error.message,
          body: req.body
        });
        
        const statusCode = error.message.includes('Invalid category') ? 400 : 500;
        res.status(statusCode).json({
          success: false,
          errorCode: 'STAFF_CREATE_ERROR',
          message: error.message || 'Failed to create staff member'
        });
      } finally {
        span.end();
      }
    });
  }

  async getStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    return tracer.startActiveSpan('controller.AcademyStaffController.getStaff', async (span) => {
      try {
        const { id } = req.params;
        
        span.setAttribute('staffId', id);
        
        const staff = await this.staffService.getStaffById(id);
        
        if (!staff) {
          span.setStatus({ code: 2, message: 'Staff not found' });
          res.status(404).json({
            success: false,
            errorCode: 'NOT_FOUND',
            message: 'Staff member not found'
          });
          return;
        }

        res.status(200).json({
          success: true,
          data: staff
        });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('CONTROLLER_STAFF_GET_ERROR', {
          error: error.message,
          staffId: req.params.id
        });
        
        res.status(500).json({
          success: false,
          errorCode: 'STAFF_FETCH_ERROR',
          message: 'Failed to fetch staff member'
        });
      } finally {
        span.end();
      }
    });
  }

  async getAllStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    return tracer.startActiveSpan('controller.AcademyStaffController.getAllStaff', async (span) => {
      try {
        const filters: StaffFilters = {
          page: parseInt(req.query.page as string) || 1,
          limit: parseInt(req.query.limit as string) || 20,
          category: req.query.category as string,
          searchTerm: req.query.search as string,
          minExperience: req.query.minExperience ? parseInt(req.query.minExperience as string) : undefined,
          maxExperience: req.query.maxExperience ? parseInt(req.query.maxExperience as string) : undefined,
          sortBy: req.query.sortBy as string || 'name',
          sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc'
        };

        span.setAttributes({
          page: filters.page,
          limit: filters.limit,
          hasCategory: !!filters.category,
          hasSearch: !!filters.searchTerm
        });

        const result = await this.staffService.getAllStaff(filters);

        res.status(200).json({
          success: true,
          data: result.data,
          pagination: {
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            hasNext: result.hasNext,
            hasPrevious: result.hasPrevious
          }
        });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('CONTROLLER_STAFF_LIST_ERROR', {
          error: error.message,
          query: req.query
        });
        
        res.status(500).json({
          success: false,
          errorCode: 'STAFF_LIST_ERROR',
          message: 'Failed to fetch staff list'
        });
      } finally {
        span.end();
      }
    });
  }

  async updateStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    return tracer.startActiveSpan('controller.AcademyStaffController.updateStaff', async (span) => {
      try {
        const { id } = req.params;
        const data: UpdateStaffDTO = req.body;
        const userId = (req as any).user?.id || 'system';

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          span.setStatus({ code: 2, message: 'Validation failed' });
          res.status(400).json({
            success: false,
            errorCode: 'VALIDATION_ERROR',
            message: 'Validation failed',
            errors: errors.array()
          });
          return;
        }

        span.setAttributes({
          staffId: id,
          updateFields: Object.keys(data).join(',')
        });

        const staff = await this.staffService.updateStaff(id, data, userId);

        res.status(200).json({
          success: true,
          data: staff,
          message: 'Staff member updated successfully'
        });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('CONTROLLER_STAFF_UPDATE_ERROR', {
          error: error.message,
          staffId: req.params.id,
          body: req.body
        });
        
        const statusCode = error.message.includes('not found') ? 404 : 
                          error.message.includes('Invalid category') ? 400 : 500;
        
        res.status(statusCode).json({
          success: false,
          errorCode: 'STAFF_UPDATE_ERROR',
          message: error.message || 'Failed to update staff member'
        });
      } finally {
        span.end();
      }
    });
  }

  async deleteStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    return tracer.startActiveSpan('controller.AcademyStaffController.deleteStaff', async (span) => {
      try {
        const { id } = req.params;
        const userId = (req as any).user?.id || 'system';

        span.setAttribute('staffId', id);

        await this.staffService.deleteStaff(id, userId);

        res.status(200).json({
          success: true,
          message: 'Staff member deleted successfully'
        });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('CONTROLLER_STAFF_DELETE_ERROR', {
          error: error.message,
          staffId: req.params.id
        });
        
        const statusCode = error.message.includes('not found') ? 404 : 500;
        
        res.status(statusCode).json({
          success: false,
          errorCode: 'STAFF_DELETE_ERROR',
          message: error.message || 'Failed to delete staff member'
        });
      } finally {
        span.end();
      }
    });
  }

  async getStaffStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    return tracer.startActiveSpan('controller.AcademyStaffController.getStaffStats', async (span) => {
      try {
        const stats = await this.staffService.getStaffStats();

        res.status(200).json({
          success: true,
          data: stats
        });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('CONTROLLER_STAFF_STATS_ERROR', { error: error.message });
        
        res.status(500).json({
          success: false,
          errorCode: 'STAFF_STATS_ERROR',
          message: 'Failed to fetch staff statistics'
        });
      } finally {
        span.end();
      }
    });
  }

  async searchStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    return tracer.startActiveSpan('controller.AcademyStaffController.searchStaff', async (span) => {
      try {
        const { name } = req.query;
        
        if (!name || typeof name !== 'string') {
          span.setStatus({ code: 2, message: 'Invalid search term' });
          res.status(400).json({
            success: false,
            errorCode: 'INVALID_SEARCH',
            message: 'Search term is required'
          });
          return;
        }

        span.setAttribute('searchTerm', name);

        const staff = await this.staffService.searchStaffByName(name);

        res.status(200).json({
          success: true,
          data: staff,
          count: staff.length
        });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('CONTROLLER_STAFF_SEARCH_ERROR', {
          error: error.message,
          query: req.query
        });
        
        res.status(500).json({
          success: false,
          errorCode: 'STAFF_SEARCH_ERROR',
          message: 'Failed to search staff'
        });
      } finally {
        span.end();
      }
    });
  }

  async getStaffByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    return tracer.startActiveSpan('controller.AcademyStaffController.getStaffByCategory', async (span) => {
      try {
        const { category } = req.params;
        const validCategories = ['coaching', 'medical', 'administrative', 'technical', 'scouting'];

        if (!validCategories.includes(category)) {
          span.setStatus({ code: 2, message: 'Invalid category' });
          res.status(400).json({
            success: false,
            errorCode: 'INVALID_CATEGORY',
            message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
          });
          return;
        }

        span.setAttribute('category', category);

        const staff = await this.staffService.getStaffByCategory(category);

        res.status(200).json({
          success: true,
          data: staff,
          count: staff.length
        });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('CONTROLLER_STAFF_CATEGORY_ERROR', {
          error: error.message,
          category: req.params.category
        });
        
        res.status(500).json({
          success: false,
          errorCode: 'STAFF_CATEGORY_ERROR',
          message: 'Failed to fetch staff by category'
        });
      } finally {
        span.end();
      }
    });
  }

  async bulkImportStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    return tracer.startActiveSpan('controller.AcademyStaffController.bulkImportStaff', async (span) => {
      try {
        const staffData = req.body;
        const userId = (req as any).user?.id || 'system';

        if (!Array.isArray(staffData) || staffData.length === 0) {
          span.setStatus({ code: 2, message: 'Invalid import data' });
          res.status(400).json({
            success: false,
            errorCode: 'INVALID_IMPORT_DATA',
            message: 'Import data must be a non-empty array'
          });
          return;
        }

        span.setAttribute('importCount', staffData.length);

        const importedStaff = await this.staffService.bulkImportStaff(staffData, userId);

        res.status(201).json({
          success: true,
          data: importedStaff,
          message: `${importedStaff.length} staff members imported successfully`
        });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('CONTROLLER_STAFF_BULK_IMPORT_ERROR', {
          error: error.message,
          importCount: req.body?.length || 0
        });
        
        const statusCode = error.message.includes('Invalid data') ? 400 : 500;
        
        res.status(statusCode).json({
          success: false,
          errorCode: 'STAFF_BULK_IMPORT_ERROR',
          message: error.message || 'Failed to import staff members'
        });
      } finally {
        span.end();
      }
    });
  }
}