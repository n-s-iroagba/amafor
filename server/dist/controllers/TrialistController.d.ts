import { Request, Response, NextFunction } from 'express';
export declare const trialistController: {
    /**
     * Submit trial application
     * @api POST /trialists
     * @apiName API-TRIALIST-001
     * @apiGroup Trialists
     * @srsRequirement REQ-ACA-01, REQ-ACA-02
     */
    createTrialist: (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Get all trialists with pagination and filters
     * @api GET /trialists
     * @apiName API-TRIALIST-002
     * @apiGroup Trialists
     * @srsRequirement REQ-ACA-03
     */
    getAllTrialists: (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Get trialist by ID
     * @api GET /trialists/:id
     * @apiName API-TRIALIST-003
     * @apiGroup Trialists
     * @srsRequirement REQ-ACA-03
     */
    getTrialistById: (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Update trialist
     * @api PUT /trialists/:id
     * @apiName API-TRIALIST-004
     * @apiGroup Trialists
     * @srsRequirement REQ-ACA-03
     */
    updateTrialist: (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Delete trialist
     * @api DELETE /trialists/:id
     * @apiName API-TRIALIST-005
     * @apiGroup Trialists
     * @srsRequirement REQ-ACA-03
     */
    deleteTrialist: (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Update trialist status
     * @api PATCH /trialists/:id/status
     * @apiName API-TRIALIST-006
     * @apiGroup Trialists
     * @srsRequirement REQ-ACA-03
     */
    updateStatus: (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Search trialists
     * @api GET /trialists/search
     * @apiName API-TRIALIST-007
     * @apiGroup Trialists
     * @srsRequirement REQ-ACA-03
     */
    searchTrialists: (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Get trialist statistics
     * @api GET /trialists/stats
     * @apiName API-TRIALIST-008
     * @apiGroup Trialists
     * @srsRequirement REQ-ACA-03
     */
    getStatistics: (req: Request, res: Response, next: NextFunction) => void;
};
//# sourceMappingURL=TrialistController.d.ts.map