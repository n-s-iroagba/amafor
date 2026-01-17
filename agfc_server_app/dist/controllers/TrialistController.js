"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trialistController = exports.uploadTrialistFiles = void 0;
const trialist_service_1 = require("../services/trialist.service");
const asyncHandler_1 = require("../middleware/asyncHandler");
const AppError_1 = require("../utils/AppError");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const trialistService = new trialist_service_1.TrialistService();
// File upload middleware configuration
exports.uploadTrialistFiles = uploadMiddleware_1.upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'cvFile', maxCount: 1 },
]);
exports.trialistController = {
    // Create trialist
    createTrialist: (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
        const files = req.files;
        const trialistData = {
            ...req.body,
            dob: new Date(req.body.dob),
            height: req.body.height ? parseInt(req.body.height) : undefined,
            weight: req.body.weight ? parseInt(req.body.weight) : undefined,
            videoFile: files?.videoFile?.[0],
            cvFile: files?.cvFile?.[0],
        };
        const trialist = await trialistService.createTrialist(trialistData);
        res.status(201).json({
            success: true,
            message: 'Trialist created successfully',
            data: trialist,
        });
    }),
    // Get all trialists with pagination and filters
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
    // Get single trialist
    getTrialistById: (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
        const { id } = req.params;
        const trialist = await trialistService.getTrialistById(id);
        res.status(200).json({
            success: true,
            message: 'Trialist retrieved successfully',
            data: trialist,
        });
    }),
    // Update trialist
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
    // Delete trialist
    deleteTrialist: (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
        const { id } = req.params;
        await trialistService.deleteTrialist(id);
        res.status(200).json({
            success: true,
            message: 'Trialist deleted successfully',
        });
    }),
    // Update trialist status
    updateStatus: (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
        const { id } = req.params;
        const { status } = req.body;
        if (!status || !['PENDING', 'REVIEWED', 'INVITED', 'REJECTED'].includes(status)) {
            throw new AppError_1.AppError('Invalid status value', 400);
        }
        const trialist = await trialistService.updateTrialistStatus(id, status);
        res.status(200).json({
            success: true,
            message: 'Trialist status updated successfully',
            data: trialist,
        });
    }),
    // Search trialists
    searchTrialists: (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
        const { keyword } = req.query;
        if (!keyword || typeof keyword !== 'string') {
            throw new AppError_1.AppError('Search keyword is required', 400);
        }
        const trialists = await trialistService.searchTrialists(keyword);
        res.status(200).json({
            success: true,
            message: 'Trialists retrieved successfully',
            data: trialists,
            count: trialists.length,
        });
    }),
    // Get statistics
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