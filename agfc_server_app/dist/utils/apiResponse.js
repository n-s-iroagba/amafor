"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, options = {}) {
        const { message = 'Success', data = null, statusCode = 200 } = options;
        res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }
    static error(res, options = {}) {
        const { message = 'An error occurred', errors = null, statusCode = 500 } = options;
        res.status(statusCode).json({
            success: false,
            message,
            errors,
            timestamp: new Date().toISOString()
        });
    }
    static paginated(res, data, total, page, limit, message = 'Data fetched successfully') {
        const totalPages = Math.ceil(total / limit);
        res.status(200).json({
            success: true,
            message,
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            timestamp: new Date().toISOString()
        });
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=apiResponse.js.map