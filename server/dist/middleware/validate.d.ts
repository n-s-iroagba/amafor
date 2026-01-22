import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
export declare const validate: (schema: z.ZodSchema<any>) => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map