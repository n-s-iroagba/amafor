import { AcademyStaffService, CreateStaffDTO, StaffFilters, UpdateStaffDTO } from '@services/AcademyStaffService';
import logger from '@utils/logger';
import tracer from '@utils/tracer';
import { Request, Response, NextFunction } from 'express';

export class AcademyStaffController {
  private staffService: AcademyStaffService;

  constructor() {
    this.staffService = new AcademyStaffService();
  }

  /**
   * Add academy staff
   * @api POST /academy-staff
   * @apiName API-STAFF-001
   * @apiGroup Academy Staff
   * @srsRequirement REQ-ACA-05
   */
  async createStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    return tracer.startActiveSpan('controller.AcademyStaffController.createStaff', async (span) => {
      try {
        // Validation handled by middleware

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

  /**
   * Get staff details
   * @api GET /academy-staff/:id
   * @apiName API-STAFF-003
   * @apiGroup Academy Staff
   * @srsRequirement REQ-ACA-05
   */
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

  /**
   * List academy staff
   * @api GET /academy-staff
   * @apiName API-STAFF-002
   * @apiGroup Academy Staff
   * @srsRequirement REQ-ACA-05
   */
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
          data: {
            data: result.data,
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            hasNext: result.hasNext,
            hasPrev: result.hasPrevious,
            limit: filters.limit
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

  /**
   * Update staff
   * @api PUT /academy-staff/:id
   * @apiName API-STAFF-004
   * @apiGroup Academy Staff
   * @srsRequirement REQ-ACA-05
   */
  async updateStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    return tracer.startActiveSpan('controller.AcademyStaffController.updateStaff', async (span) => {
      try {
        const { id } = req.params;
        const data: UpdateStaffDTO = req.body;
        const userId = (req as any).user?.id || 'system';

        // Validation handled by middleware

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

  /**
   * Remove staff
   * @api DELETE /academy-staff/:id
   * @apiName API-STAFF-005
   * @apiGroup Academy Staff
   * @srsRequirement REQ-ACA-05
   */
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


}