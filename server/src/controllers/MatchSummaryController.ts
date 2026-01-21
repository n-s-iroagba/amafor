import { Request, Response, NextFunction } from 'express';
import { FixtureSummaryService } from '../services/FixtureSummaryService';

export class FixtureSummaryController {
  private matchSummaryService: FixtureSummaryService;

  constructor() {
    this.matchSummaryService = new FixtureSummaryService();
  }

  createFixtureSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.matchSummaryService.createFixtureSummary(req.body);
      res.status(201).json(summary);
    } catch (error) {
      next(error);
    }
  };

  getFixtureSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.matchSummaryService.getFixtureSummaryById(parseInt(req.params.id));
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  };

  getFixtureSummaryByFixture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.matchSummaryService.getFixtureSummaryByFixture(parseInt(req.params.fixtureId));
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  };

  updateFixtureSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.matchSummaryService.updateFixtureSummary(parseInt(req.params.id), req.body);
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  };

  deleteFixtureSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.matchSummaryService.deleteFixtureSummary(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}