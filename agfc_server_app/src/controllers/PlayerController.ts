import { Request, Response, NextFunction } from 'express';
import { PlayerService } from '../services'; 
import { structuredLogger } from '../utils';

export class PlayerController {
  private playerService: PlayerService;

  constructor() {
    this.playerService = new PlayerService();
  }

  public createPlayer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const creatorId = (req as any).user.id; 
      const player = await this.playerService.createPlayer(req.body, creatorId);
      
      res.status(201).json({
        success: true,
        data: player
      });
    } catch (error) {
      next(error);
    }
  };

  public getPlayerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const viewerId = (req as any).user?.id;
      
      const player = await this.playerService.getPlayerProfile(id, viewerId);

      if (!player) throw new Error('Player not found');

      res.status(200).json({
        success: true,
        data: player
      });
    } catch (error) {
      next(error);
    }
  };

  public listPlayers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const players = await this.playerService.listPlayers(req.query);

      res.status(200).json({
        success: true,
        results: players.length,
        data: players
      });
    } catch (error) {
      next(error);
    }
  };

  public updateStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const adminId = (req as any).user.id;

      const updatedPlayer = await this.playerService.updatePlayerStats(id, req.body, adminId);

      res.status(200).json({
        success: true,
        data: updatedPlayer
      });
    } catch (error) {
      next(error);
    }
  };

  public generateScoutReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const scoutId = (req as any).user.id;

      const report = await this.playerService.generateScoutReport(id, scoutId);

      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error) {
      next(error);
    }
  };
}