
import { Request, Response, NextFunction } from 'express';
import { ScoutService } from '../services/ScoutService';

export class ScoutController {
    private scoutService: ScoutService;

    constructor() {
        this.scoutService = new ScoutService();
    }

    public listReports = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reports = await this.scoutService.getReports(req.query);
            res.status(200).json({ success: true, data: reports });
        } catch (error) {
            next(error);
        }
    };

    public getReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const report = await this.scoutService.getReportById(id);
            if (!report) {
                res.status(404).json({ success: false, message: 'Report not found' });
                return;
            }
            res.status(200).json({ success: true, data: report });
        } catch (error) {
            next(error);
        }
    };

    public createReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const report = await this.scoutService.createReport(req.body);
            res.status(201).json({ success: true, data: report });
        } catch (error) {
            next(error);
        }
    };

    public deleteReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await this.scoutService.deleteReport(id);
            res.status(200).json({ success: true, message: 'Report deleted' });
        } catch (error) {
            next(error);
        }
    };

    public submitApplication = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const application = await this.scoutService.submitApplication(req.body);
            res.status(201).json({ success: true, data: application });
        } catch (error) {
            next(error);
        }
    };
}
