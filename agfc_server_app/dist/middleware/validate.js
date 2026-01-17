"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
// Validation middleware
const validate = (schema) => asyncHandler(async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
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