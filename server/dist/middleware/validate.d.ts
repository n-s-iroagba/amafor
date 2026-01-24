import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
export declare const validate: (schema: z.ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map