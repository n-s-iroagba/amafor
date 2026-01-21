import { Request, Response, NextFunction } from 'express';
import { LineupService } from '../services/LineupService';

export class LineupController {
  private lineupService: LineupService;

  constructor() {
    this.lineupService = new LineupService();
  }

  createLineupPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const player = await this.lineupService.createLineupPlayer(req.body);
      res.status(201).json(player);
    } catch (error) {
      next(error);
    }
  };

  getLineupPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const player = await this.lineupService.getLineupPlayerById(parseInt(req.params.id));
      res.status(200).json(player);
    } catch (error) {
      next(error);
    }
  };

  getLineupByFixture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lineup = await this.lineupService.getLineupByFixture(parseInt(req.params.fixtureId));
      res.status(200).json(lineup);
    } catch (error) {
      next(error);
    }
  };

  getStartersByFixture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const starters = await this.lineupService.getStartersByFixture(parseInt(req.params.fixtureId));
      res.status(200).json(starters);
    } catch (error) {
      next(error);
    }
  };

  getSubstitutesByFixture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const substitutes = await this.lineupService.getSubstitutesByFixture(parseInt(req.params.fixtureId));
      res.status(200).json(substitutes);
    } catch (error) {
      next(error);
    }
  };

  updateLineupPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const player = await this.lineupService.updateLineupPlayer(parseInt(req.params.id), req.body);
      res.status(200).json(player);
    } catch (error) {
      next(error);
    }
  };

  deleteLineupPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.lineupService.deleteLineupPlayer(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  batchUpdateLineup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lineup = await this.lineupService.batchUpdateLineup(
        parseInt(req.params.fixtureId),
        req.body
      );
      res.status(200).json(lineup);
    } catch (error) {
      next(error);
    }
  };
}