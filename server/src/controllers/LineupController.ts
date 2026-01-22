import { Request, Response, NextFunction } from 'express';
import { LineupService } from '../services/LineupService';

export class LineupController {
  private lineupService: LineupService;

  constructor() {
    this.lineupService = new LineupService();
  }

  /**
   * Create match lineup
   * @api POST /lineups
   * @apiName API-LINEUP-001
   * @apiGroup Lineups
   * @srsRequirement REQ-PUB-02, REQ-ADM-03
   */
  createLineup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const player = await this.lineupService.createLineup(req.body);
      res.status(201).json(player);
    } catch (error) {
      next(error);
    }
  };

  getLineupPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const player = await this.lineupService.getLineupById(req.params.id);
      res.status(200).json(player);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get lineup for fixture
   * @api GET /lineups/fixture/:fixtureId
   * @apiName API-LINEUP-002
   * @apiGroup Lineups
   * @srsRequirement REQ-PUB-02
   */
  getLineupByFixture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lineup = await this.lineupService.getFixtureLineup(req.params.fixtureId);
      res.status(200).json(lineup);
    } catch (error) {
      next(error);
    }
  };

  getStartersByFixture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { starters } = await this.lineupService.getDetailedFixtureLineup(req.params.fixtureId);
      res.status(200).json(starters);
    } catch (error) {
      next(error);
    }
  };

  getSubstitutesByFixture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { substitutes } = await this.lineupService.getDetailedFixtureLineup(req.params.fixtureId);
      res.status(200).json(substitutes);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update lineup
   * @api PUT /lineups/:id
   * @apiName API-LINEUP-003
   * @apiGroup Lineups
   * @srsRequirement REQ-ADM-03
   */
  updateLineupPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const player = await this.lineupService.updateLineup(req.params.id, req.body);
      res.status(200).json(player);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete lineup
   * @api DELETE /lineups/:id
   * @apiName API-LINEUP-004
   * @apiGroup Lineups
   * @srsRequirement REQ-ADM-03
   */
  deleteLineupPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.lineupService.deleteLineup(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  batchUpdateLineup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lineup = await this.lineupService.replaceFixtureLineup(
        req.params.fixtureId,
        req.body
      );
      res.status(200).json(lineup);
    } catch (error) {
      next(error);
    }
  };
}