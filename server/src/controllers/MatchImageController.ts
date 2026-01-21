import { Request, Response, NextFunction } from 'express';
import { FixtureImageService } from '../services/FixtureImageService';

export class FixtureImageController {
  private matchImageService: FixtureImageService;

  constructor() {
    this.matchImageService = new FixtureImageService();
  }

  createFixtureImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const image = await this.matchImageService.createFixtureImage(req.body.images);
      res.status(201).json(image);
    } catch (error) {
      next(error);
    }
  };

  getFixtureImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const image = await this.matchImageService.getFixtureImageById(parseInt(req.params.id));
      res.status(200).json(image);
    } catch (error) {
      next(error);
    }
  };

  getFixtureImagesByFixture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const images = await this.matchImageService.getFixtureImagesByFixture(parseInt(req.params.fixtureId));
      res.status(200).json(images);
    } catch (error) {
      next(error);
    }
  };

  updateFixtureImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const image = await this.matchImageService.updateFixtureImage(parseInt(req.params.id), req.body);
      res.status(200).json(image);
    } catch (error) {
      next(error);
    }
  };

  deleteFixtureImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.matchImageService.deleteFixtureImage(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}