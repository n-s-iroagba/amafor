import { body, param, query } from 'express-validator';

export const createStaffValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 150 }).withMessage('Name must be between 2 and 150 characters'),
  
  body('role')
    .notEmpty().withMessage('Role is required')
    .isLength({ min: 2, max: 100 }).withMessage('Role must be between 2 and 100 characters'),
  
  body('bio')
    .notEmpty().withMessage('Bio is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Bio must be between 10 and 2000 characters'),
  
  body('initials')
    .optional()
    .isLength({ max: 10 }).withMessage('Initials cannot exceed 10 characters'),
  
  body('imageUrl')
    .optional()
    .isURL().withMessage('Image URL must be a valid URL'),
  
  body('category')
    .optional()
    .isIn(['coaching', 'medical', 'administrative', 'technical', 'scouting'])
    .withMessage('Invalid category'),
  
  body('qualifications')
    .optional()
    .isArray().withMessage('Qualifications must be an array'),
  
  body('yearsOfExperience')
    .optional()
    .isInt({ min: 0, max: 60 }).withMessage('Years of experience must be between 0 and 60')
];

export const updateStaffValidation = [
  param('id')
    .isUUID().withMessage('Invalid staff ID'),
  
  body('name')
    .optional()
    .isLength({ min: 2, max: 150 }).withMessage('Name must be between 2 and 150 characters'),
  
  body('role')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Role must be between 2 and 100 characters'),
  
  body('bio')
    .optional()
    .isLength({ min: 10, max: 2000 }).withMessage('Bio must be between 10 and 2000 characters'),
  
  body('initials')
    .optional()
    .isLength({ max: 10 }).withMessage('Initials cannot exceed 10 characters'),
  
  body('imageUrl')
    .optional()
    .isURL().withMessage('Image URL must be a valid URL'),
  
  body('category')
    .optional()
    .isIn(['coaching', 'medical', 'administrative', 'technical', 'scouting'])
    .withMessage('Invalid category'),
  
  body('qualifications')
    .optional()
    .isArray().withMessage('Qualifications must be an array'),
  
  body('yearsOfExperience')
    .optional()
    .isInt({ min: 0, max: 60 }).withMessage('Years of experience must be between 0 and 60')
];

export const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('category')
    .optional()
    .isIn(['coaching', 'medical', 'administrative', 'technical', 'scouting'])
    .withMessage('Invalid category'),
  
  query('minExperience')
    .optional()
    .isInt({ min: 0 }).withMessage('Minimum experience must be a positive integer'),
  
  query('maxExperience')
    .optional()
    .isInt({ min: 0 }).withMessage('Maximum experience must be a positive integer'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'role', 'yearsOfExperience', 'createdAt'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];