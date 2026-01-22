import { Request, Response, NextFunction } from 'express';
import { TrialistService, CreateTrialistData, UpdateTrialistData } from '../services/TrialistService';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../utils/errors';




const trialistService = new TrialistService();



export const trialistController = {
  /**
   * Submit trial application
   * @api POST /trialists
   * @apiName API-TRIALIST-001
   * @apiGroup Trialists
   * @srsRequirement REQ-ACA-01, REQ-ACA-02
   */
  createTrialist: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {


    const trialistData: CreateTrialistData = {
      ...req.body,
      dob: new Date(req.body.dob),
      height: req.body.height ? parseInt(req.body.height) : undefined,
      weight: req.body.weight ? parseInt(req.body.weight) : undefined,
      videourl: req.body.videourl

    };

    const trialist = await trialistService.createTrialist(trialistData);

    res.status(201).json({
      success: true,
      message: 'Trialist created successfully',
      data: trialist,
    });
  }),

  /**
   * Get all trialists with pagination and filters
   * @api GET /trialists
   * @apiName API-TRIALIST-002
   * @apiGroup Trialists
   * @srsRequirement REQ-ACA-03
   */
  getAllTrialists: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {
      status,
      position,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const filters = {
      ...(status && { status: status as string }),
      ...(position && { position: position as string }),
      ...(search && { search: search as string }),
    };

    const options = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'ASC' | 'DESC',
    };

    const result = await trialistService.getAllTrialists(filters, options);

    res.status(200).json({
      success: true,
      message: 'Trialists retrieved successfully',
      data: result.trialists,
      meta: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit: options.limit,
      },
    });
  }),

  /**
   * Get trialist by ID
   * @api GET /trialists/:id
   * @apiName API-TRIALIST-003
   * @apiGroup Trialists
   * @srsRequirement REQ-ACA-03
   */
  getTrialistById: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const trialist = await trialistService.getTrialistById(id);

    res.status(200).json({
      success: true,
      message: 'Trialist retrieved successfully',
      data: trialist,
    });
  }),

  /**
   * Update trialist
   * @api PUT /trialists/:id
   * @apiName API-TRIALIST-004
   * @apiGroup Trialists
   * @srsRequirement REQ-ACA-03
   */
  updateTrialist: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const updateData: UpdateTrialistData = {
      ...req.body,
      ...(req.body.dob && { dob: new Date(req.body.dob) }),
      ...(req.body.height && { height: parseInt(req.body.height) }),
      ...(req.body.weight && { weight: parseInt(req.body.weight) }),
      videoFile: files?.videoFile?.[0],
      cvFile: files?.cvFile?.[0],
    };

    const trialist = await trialistService.updateTrialist(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Trialist updated successfully',
      data: trialist,
    });
  }),

  /**
   * Delete trialist
   * @api DELETE /trialists/:id
   * @apiName API-TRIALIST-005
   * @apiGroup Trialists
   * @srsRequirement REQ-ACA-03
   */
  deleteTrialist: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await trialistService.deleteTrialist(id);

    res.status(200).json({
      success: true,
      message: 'Trialist deleted successfully',
    });
  }),

  /**
   * Update trialist status
   * @api PATCH /trialists/:id/status
   * @apiName API-TRIALIST-006
   * @apiGroup Trialists
   * @srsRequirement REQ-ACA-03
   */
  updateStatus: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['PENDING', 'REVIEWED', 'INVITED', 'REJECTED'].includes(status)) {
      throw new AppError('Invalid status value', 400);
    }

    const trialist = await trialistService.updateTrialistStatus(id, status);

    res.status(200).json({
      success: true,
      message: 'Trialist status updated successfully',
      data: trialist,
    });
  }),

  /**
   * Search trialists
   * @api GET /trialists/search
   * @apiName API-TRIALIST-007
   * @apiGroup Trialists
   * @srsRequirement REQ-ACA-03
   */
  searchTrialists: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { keyword } = req.query;

    if (!keyword || typeof keyword !== 'string') {
      throw new AppError('Search keyword is required', 400);
    }

    const trialists = await trialistService.searchTrialists(keyword);

    res.status(200).json({
      success: true,
      message: 'Trialists retrieved successfully',
      data: trialists,
      count: trialists.length,
    });
  }),

  /**
   * Get trialist statistics
   * @api GET /trialists/stats
   * @apiName API-TRIALIST-008
   * @apiGroup Trialists
   * @srsRequirement REQ-ACA-03
   */
  getStatistics: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const statistics = await trialistService.getTrialistStatistics();

    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: statistics,
    });
  }),
};