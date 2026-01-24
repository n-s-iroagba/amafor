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
      if (error instanceof z.ZodError) {
        const zodError = error as any;
        const errors = zodError.errors.map((err: any) => ({
          field: err.path.join('.'),
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