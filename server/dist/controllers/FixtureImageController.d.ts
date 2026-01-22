import { Request, Response, NextFunction } from 'express';
export declare class FixtureImageController {
    private fixtureImageService;
    constructor();
    /**
     * Upload match image
     * @api POST /match-gallery
     * @apiName API-GALLERY-001
     * @apiGroup Fixture Gallery
     * @srsRequirement REQ-PUB-07, REQ-ADM-03
     */
    createFixtureImage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getFixtureImage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get images for fixture
     * @api GET /match-gallery/fixture/:fixtureId
     * @apiName API-GALLERY-002
     * @apiGroup Fixture Gallery
     * @srsRequirement REQ-PUB-07
     */
    getFixtureImagesByFixture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateFixtureImage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Delete image
     * @api DELETE /match-gallery/:id
     * @apiName API-GALLERY-003
     * @apiGroup Fixture Gallery
     * @srsRequirement REQ-ADM-03
     */
    deleteFixtureImage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=FixtureImageController.d.ts.map