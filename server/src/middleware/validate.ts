import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from './asyncHandler';

// Validation middleware
export const validate = (schema: z.ZodSchema<any>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      console.error('--- VALIDATION ERROR CAUGHT ---');
      console.error(error);

      if (error instanceof z.ZodError || (error as any).name === 'ZodError') {
        const zodError = error as any;
        const issues = zodError.errors || zodError.issues || [];
        const errors = issues.map((err: any) => ({
          field: err.path ? err.path.join('.') : 'unknown',
          message: err.message,
        }));
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
      } else {
        next(error);
      }
    }
  });