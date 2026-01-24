"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoutService = void 0;
const ScoutReportRepository_1 = require("../repositories/ScoutReportRepository");
const ScoutApplicationRepository_1 = require("../repositories/ScoutApplicationRepository");
const PlayerRepository_1 = require("../repositories/PlayerRepository");
const errors_1 = require("../utils/errors");
const utils_1 = require("../utils");
class ScoutService {
    constructor() {
        this.scoutReportRepository = new ScoutReportRepository_1.ScoutReportRepository();
        this.scoutApplicationRepository = new ScoutApplicationRepository_1.ScoutApplicationRepository();
        this.playerRepository = new PlayerRepository_1.PlayerRepository();
    }
    async getReports(filters) {
        return utils_1.tracer.startActiveSpan('service.ScoutService.getReports', async (span) => {
            try {
                const reports = await this.scoutReportRepository.findAll(filters);
                // Enrich with player data if needed, or rely on frontend to fetch player details
                // For now, let's return reports. Ideally we'd join with Players.
                return reports;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getReportById(id) {
        return utils_1.tracer.startActiveSpan('service.ScoutService.getReportById', async (span) => {
            try {
                return await this.scoutReportRepository.findById(id);
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async deleteReport(id) {
        return utils_1.tracer.startActiveSpan('service.ScoutService.deleteReport', async (span) => {
            try {
                const deleted = await this.scoutReportRepository.delete(id);
                return deleted > 0;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    // Generate and save a report
    async createReport(data) {
        return utils_1.tracer.startActiveSpan('service.ScoutService.createReport', async (span) => {
            try {
                // Verify player exists
                const player = await this.playerRepository.findById(data.playerId);
                if (!player)
                    throw new errors_1.AppError('Player not found', 404);
                return await this.scoutReportRepository.create(data);
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async submitApplication(data) {
        return utils_1.tracer.startActiveSpan('service.ScoutService.submitApplication', async (span) => {
            try {
                return await this.scoutApplicationRepository.create(data);
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.ScoutService = ScoutService;
//# sourceMappingURL=ScoutService.js.map