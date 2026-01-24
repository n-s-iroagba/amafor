
import { ScoutReportRepository } from '../repositories/ScoutReportRepository';
import { ScoutApplicationRepository } from '../repositories/ScoutApplicationRepository';
import { PlayerRepository } from '../repositories/PlayerRepository';
import { AppError } from '../utils/errors';
import { structuredLogger, tracer } from '../utils';

export class ScoutService {
    private scoutReportRepository: ScoutReportRepository;
    private scoutApplicationRepository: ScoutApplicationRepository;
    private playerRepository: PlayerRepository;

    constructor() {
        this.scoutReportRepository = new ScoutReportRepository();
        this.scoutApplicationRepository = new ScoutApplicationRepository();
        this.playerRepository = new PlayerRepository();
    }

    public async getReports(filters: any): Promise<any[]> {
        return tracer.startActiveSpan('service.ScoutService.getReports', async (span) => {
            try {
                const reports = await this.scoutReportRepository.findAll(filters);
                // Enrich with player data if needed, or rely on frontend to fetch player details
                // For now, let's return reports. Ideally we'd join with Players.
                return reports;
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    public async getReportById(id: string): Promise<any> {
        return tracer.startActiveSpan('service.ScoutService.getReportById', async (span) => {
            try {
                return await this.scoutReportRepository.findById(id);
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    public async deleteReport(id: string): Promise<boolean> {
        return tracer.startActiveSpan('service.ScoutService.deleteReport', async (span) => {
            try {
                const deleted = await this.scoutReportRepository.delete(id);
                return deleted > 0;
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    // Generate and save a report
    public async createReport(data: any): Promise<any> {
        return tracer.startActiveSpan('service.ScoutService.createReport', async (span) => {
            try {
                // Verify player exists
                const player = await this.playerRepository.findById(data.playerId);
                if (!player) throw new AppError('Player not found', 404);

                return await this.scoutReportRepository.create(data);
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    public async submitApplication(data: any): Promise<any> {
        return tracer.startActiveSpan('service.ScoutService.submitApplication', async (span) => {
            try {
                return await this.scoutApplicationRepository.create(data);
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }
}
