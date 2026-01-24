"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trialistController = void 0;
const TrialistService_1 = require("../services/TrialistService");
const asyncHandler_1 = require("../middleware/asyncHandler");
const errors_1 = require("../utils/errors");
const trialistService = new TrialistService_1.TrialistService();
exports.trialistController = {
    /**
     * Submit trial application
     * @api POST /trialists
     * @apiName API-TRIALIST-001
     * @apiGroup Trialists
     * @srsRequirement REQ-ACA-01, REQ-ACA-02
     */
    createTrialist: (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
        const trialistData = {
            ...req.body,
            dob: new Date(req.body.dob),
            height: req.body.height ? parseInt(req.body.height) : undefined,
            weight: req.body.weight ? parseInt(req.body.weight) : undefined,
            videoUrl: req.body.videoUrl, // Correction: lowercase 'videourl' was in original file, standardizing to camelCase
            guardianName: req.body.guardianName,
            guardianPhone: req.body.guardianPhone,
            guardianEmail: req.body.guardianEmail,
            consentEmail: req.body.consentEmail,
            consentSmsWhatsapp: req.body.consentSmsWhatsapp,
            guardianConsent: req.body.guardianConsent
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
    getAllTrialists: (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
        const { status, position, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
        const filters = {
            ...(status && { status: status }),
            ...(position && { position: position }),
            ...(search && { search: search }),
        };
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: sortBy,
            sortOrder: sortOrder,
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
    getTrialistById: (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
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
    updateTrialist: (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
        const { id } = req.params;
        const files = req.files;
        const updateData = {
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
    deleteTrialist: (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
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
    updateStatus: (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
        const { id } = req.params;
        const { status } = req.body;
        if (!status || !['PENDING', 'REVIEWED', 'INVITED', 'REJECTED'].includes(status)) {
            throw new errors_1.AppError('Invalid status value', 400);
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
    searchTrialists: (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
        const { keyword } = req.query;
        if (!keyword || typeof keyword !== 'string') {
            throw new errors_1.AppError('Search keyword is required', 400);
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
    getStatistics: (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
        const statistics = await trialistService.getTrialistStatistics();
        res.status(200).json({
            success: true,
            message: 'Statistics retrieved successfully',
            data: statistics,
        });
    }),
};
//# sourceMappingURL=TrialistController.js.map