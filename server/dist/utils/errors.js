"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = exports.InternalServerError = exports.UnauthorizedError = exports.ForbiddenError = exports.BadRequestError = exports.ValidationError = exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.ValidationError = ValidationError;
class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class ForbiddenError extends AppError {
    constructor(message, code) {
        super(message, 403);
        this.code = code;
    }
}
exports.ForbiddenError = ForbiddenError;
class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class InternalServerError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
class DatabaseError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}
exports.DatabaseError = DatabaseError;
//# sourceMappingURL=errors.js.map