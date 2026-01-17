"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryValidation = exports.updateStaffValidation = exports.createStaffValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createStaffValidation = [
    (0, express_validator_1.body)('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 150 }).withMessage('Name must be between 2 and 150 characters'),
    (0, express_validator_1.body)('role')
        .notEmpty().withMessage('Role is required')
        .isLength({ min: 2, max: 100 }).withMessage('Role must be between 2 and 100 characters'),
    (0, express_validator_1.body)('bio')
        .notEmpty().withMessage('Bio is required')
        .isLength({ min: 10, max: 2000 }).withMessage('Bio must be between 10 and 2000 characters'),
    (0, express_validator_1.body)('initials')
        .optional()
        .isLength({ max: 10 }).withMessage('Initials cannot exceed 10 characters'),
    (0, express_validator_1.body)('imageUrl')
        .optional()
        .isURL().withMessage('Image URL must be a valid URL'),
    (0, express_validator_1.body)('category')
        .optional()
        .isIn(['coaching', 'medical', 'administrative', 'technical', 'scouting'])
        .withMessage('Invalid category'),
    (0, express_validator_1.body)('qualifications')
        .optional()
        .isArray().withMessage('Qualifications must be an array'),
    (0, express_validator_1.body)('yearsOfExperience')
        .optional()
        .isInt({ min: 0, max: 60 }).withMessage('Years of experience must be between 0 and 60')
];
exports.updateStaffValidation = [
    (0, express_validator_1.param)('id')
        .isUUID().withMessage('Invalid staff ID'),
    (0, express_validator_1.body)('name')
        .optional()
        .isLength({ min: 2, max: 150 }).withMessage('Name must be between 2 and 150 characters'),
    (0, express_validator_1.body)('role')
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('Role must be between 2 and 100 characters'),
    (0, express_validator_1.body)('bio')
        .optional()
        .isLength({ min: 10, max: 2000 }).withMessage('Bio must be between 10 and 2000 characters'),
    (0, express_validator_1.body)('initials')
        .optional()
        .isLength({ max: 10 }).withMessage('Initials cannot exceed 10 characters'),
    (0, express_validator_1.body)('imageUrl')
        .optional()
        .isURL().withMessage('Image URL must be a valid URL'),
    (0, express_validator_1.body)('category')
        .optional()
        .isIn(['coaching', 'medical', 'administrative', 'technical', 'scouting'])
        .withMessage('Invalid category'),
    (0, express_validator_1.body)('qualifications')
        .optional()
        .isArray().withMessage('Qualifications must be an array'),
    (0, express_validator_1.body)('yearsOfExperience')
        .optional()
        .isInt({ min: 0, max: 60 }).withMessage('Years of experience must be between 0 and 60')
];
exports.queryValidation = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('category')
        .optional()
        .isIn(['coaching', 'medical', 'administrative', 'technical', 'scouting'])
        .withMessage('Invalid category'),
    (0, express_validator_1.query)('minExperience')
        .optional()
        .isInt({ min: 0 }).withMessage('Minimum experience must be a positive integer'),
    (0, express_validator_1.query)('maxExperience')
        .optional()
        .isInt({ min: 0 }).withMessage('Maximum experience must be a positive integer'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['name', 'role', 'yearsOfExperience', 'createdAt'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc')
];
//# sourceMappingURL=academyStaffSchema.js.map