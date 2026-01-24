
import { Request, Response, NextFunction } from 'express';
import { LeagueService } from '../services';

export class LeagueController {
    private leagueService: LeagueService;

    constructor() {
        this.leagueService = new LeagueService();
    }

    public listLeagues = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const leagues = await this.leagueService.getAllLeagues();
            res.status(200).json({ success: true, data: leagues });
        } catch (error) {
            next(error);
        }
    };

    public getLeague = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const league = await this.leagueService.getLeagueById(id);
            if (!league) {
                res.status(404).json({ success: false, message: 'League not found' });
                return;
            }
            res.status(200).json({ success: true, data: league });
        } catch (error) {
            next(error);
        }
    };

    public createLeague = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const league = await this.leagueService.createLeague(req.body);
            res.status(201).json({ success: true, data: league });
        } catch (error) {
            next(error);
        }
    };

    public updateLeague = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const league = await this.leagueService.updateLeague(id, req.body);
            res.status(200).json({ success: true, data: league });
        } catch (error) {
            next(error);
        }
    };

    public deleteLeague = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await this.leagueService.deleteLeague(id);
            res.status(200).json({ success: true, message: 'League deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    public getLeaguesWithTables = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.leagueService.getLeaguesWithTables();
            res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    };

    public getLeagueTable = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = await this.leagueService.getLeagueWithTable(id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    };
}
