import { Request, Response, NextFunction } from 'express';
import { FixtureImageService } from '../services/FixtureImageService';

export class FixtureImageController {
  private fixtureImageService: FixtureImageService;

  constructor() {
    this.fixtureImageService = new FixtureImageService();
  }

  /**
   * Upload match image
   * @api POST /match-gallery
   * @apiName API-GALLERY-001
   * @apiGroup Fixture Gallery
   * @srsRequirement REQ-PUB-07, REQ-ADM-03
   */
  createFixtureImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const image = await this.fixtureImageService.createFixtureImage(req.body.images);
      res.status(201).json(image);
    } catch (error) {
      next(error);
    }
  };

  getFixtureImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const image = await this.fixtureImageService.getFixtureImageById(req.params.id);
      res.status(200).json(image);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get images for fixture
   * @api GET /match-gallery/fixture/:fixtureId
   * @apiName API-GALLERY-002
   * @apiGroup Fixture Gallery
   * @srsRequirement REQ-PUB-07
   */
  getFixtureImagesByFixture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const images = await this.fixtureImageService.getFixtureImagesByFixture(req.params.fixtureId);
      res.status(200).json(images);
    } catch (error) {
      next(error);
    }
  };

  updateFixtureImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const image = await this.fixtureImageService.updateFixtureImage(req.params.id, req.body);
      res.status(200).json(image);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete image
   * @api DELETE /match-gallery/:id
   * @apiName API-GALLERY-003
   * @apiGroup Fixture Gallery
   * @srsRequirement REQ-ADM-03
   */
  deleteFixtureImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.fixtureImageService.deleteFixtureImage(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}