import { Request, Response, NextFunction } from 'express';
import { FixtureStatisticsService } from '../services/FixtureStatisticsService';

export class MatchSummaryController {
    private fixtureStatisticsService: FixtureStatisticsService;

    constructor() {
        this.fixtureStatisticsService = new FixtureStatisticsService();
    }

    createMatchSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const summary = await this.fixtureStatisticsService.createFixtureStatistics(req.params.fixtureId, req.body);
            res.status(201).json({ success: true, data: summary });
        } catch (error) {
            next(error);
        }
    };

    getMatchSummaryByFixture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const summary = await this.fixtureStatisticsService.getFixtureStatisticsByFixture(req.params.fixtureId, true);
            res.status(200).json({ success: true, data: summary });
        } catch (error) {
            next(error);
        }
    };

    getMatchSummaryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const summary = await this.fixtureStatisticsService.getFixtureStatisticsById(req.params.id, true);
            res.status(200).json({ success: true, data: summary });
        } catch (error) {
            next(error);
        }
    };

    updateMatchSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const summary = await this.fixtureStatisticsService.updateFixtureStatistics(req.params.id, req.body);
            res.status(200).json({ success: true, data: summary });
        } catch (error) {
            next(error);
        }
    };

    deleteMatchSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.fixtureStatisticsService.deleteFixtureStatistics(req.params.id);
            res.status(204).json({ success: true });
        } catch (error) {
            next(error);
        }
    };
}
