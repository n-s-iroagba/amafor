import { Request, Response, NextFunction } from 'express';
import { MatchSummaryService } from '../services/MatchSummaryService';

export class MatchSummaryController {
  private matchSummaryService: MatchSummaryService;

  constructor() {
    this.matchSummaryService = new MatchSummaryService();
  }

  createMatchSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.matchSummaryService.createMatchSummary(req.body);
      res.status(201).json(summary);
    } catch (error) {
      next(error);
    }
  };

  getMatchSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.matchSummaryService.getMatchSummaryById(parseInt(req.params.id));
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  };

  getMatchSummaryByFixture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.matchSummaryService.getMatchSummaryByFixture(parseInt(req.params.fixtureId));
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  };

  updateMatchSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.matchSummaryService.updateMatchSummary(parseInt(req.params.id), req.body);
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  };

  deleteMatchSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.matchSummaryService.deleteMatchSummary(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}