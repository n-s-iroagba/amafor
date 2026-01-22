import { Request, Response, NextFunction } from 'express';
export declare class AcademyStaffController {
    private staffService;
    constructor();
    /**
     * Add academy staff
     * @api POST /academy-staff
     * @apiName API-STAFF-001
     * @apiGroup Academy Staff
     * @srsRequirement REQ-ACA-05
     */
    createStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get staff details
     * @api GET /academy-staff/:id
     * @apiName API-STAFF-003
     * @apiGroup Academy Staff
     * @srsRequirement REQ-ACA-05
     */
    getStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * List academy staff
     * @api GET /academy-staff
     * @apiName API-STAFF-002
     * @apiGroup Academy Staff
     * @srsRequirement REQ-ACA-05
     */
    getAllStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update staff
     * @api PUT /academy-staff/:id
     * @apiName API-STAFF-004
     * @apiGroup Academy Staff
     * @srsRequirement REQ-ACA-05
     */
    updateStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Remove staff
     * @api DELETE /academy-staff/:id
     * @apiName API-STAFF-005
     * @apiGroup Academy Staff
     * @srsRequirement REQ-ACA-05
     */
    deleteStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=AcademyStaffController.d.ts.map