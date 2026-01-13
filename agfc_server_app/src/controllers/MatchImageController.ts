import { Request, Response, NextFunction } from 'express';
import { MatchImageService } from '../services/MatchImageService';

export class MatchImageController {
  private matchImageService: MatchImageService;

  constructor() {
    this.matchImageService = new MatchImageService();
  }

  createMatchImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const image = await this.matchImageService.createMatchImage(req.body.images);
      res.status(201).json(image);
    } catch (error) {
      next(error);
    }
  };

  getMatchImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const image = await this.matchImageService.getMatchImageById(parseInt(req.params.id));
      res.status(200).json(image);
    } catch (error) {
      next(error);
    }
  };

  getMatchImagesByFixture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const images = await this.matchImageService.getMatchImagesByFixture(parseInt(req.params.fixtureId));
      res.status(200).json(images);
    } catch (error) {
      next(error);
    }
  };

  updateMatchImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const image = await this.matchImageService.updateMatchImage(parseInt(req.params.id), req.body);
      res.status(200).json(image);
    } catch (error) {
      next(error);
    }
  };

  deleteMatchImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.matchImageService.deleteMatchImage(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}