"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const asyncHandler_1 = require("./asyncHandler");
// Validation middleware
const validate = (schema) => (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const errors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
            });
        }
        else {
            next(error);
        }
    }
});
exports.validate = validate;
//# sourceMappingURL=validate.js.map