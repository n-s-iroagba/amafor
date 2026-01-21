// src/utils/ApiResponse.ts
import { Response } from 'express';

export interface ApiResponseOptions {
  message?: string;
  data?: any;
  errors?: any;
  statusCode?: number;
}

export class ApiResponse {
  static success(res: Response, options: ApiResponseOptions = {}) {
    const { message = 'Success', data = null, statusCode = 200 } = options;
    
    res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res: Response, options: ApiResponseOptions = {}) {
    const { message = 'An error occurred', errors = null, statusCode = 500 } = options;
    
    res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }

  static paginated(
    res: Response,
    data: any[],
    total: number,
    page: number,
    limit: number,
    message = 'Data fetched successfully'
  ) {
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