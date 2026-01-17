import { Request, Response, NextFunction } from 'express';
export declare class AcademyStaffController {
    private staffService;
    constructor();
    createStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
    getStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
    getStaffStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    searchStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
    getStaffByCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    bulkImportStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=AcademyStaffController.d.ts.map