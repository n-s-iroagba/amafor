"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoutController = void 0;
const ScoutService_1 = require("../services/ScoutService");
class ScoutController {
    constructor() {
        this.listReports = async (req, res, next) => {
            try {
                const reports = await this.scoutService.getReports(req.query);
                res.status(200).json({ success: true, data: reports });
            }
            catch (error) {
                next(error);
            }
        };
        this.getReport = async (req, res, next) => {
            try {
                const { id } = req.params;
                const report = await this.scoutService.getReportById(id);
                if (!report) {
                    res.status(404).json({ success: false, message: 'Report not found' });
                    return;
                }
                res.status(200).json({ success: true, data: report });
            }
            catch (error) {
                next(error);
            }
        };
        this.createReport = async (req, res, next) => {
            try {
                const report = await this.scoutService.createReport(req.body);
                res.status(201).json({ success: true, data: report });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteReport = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this.scoutService.deleteReport(id);
                res.status(200).json({ success: true, message: 'Report deleted' });
            }
            catch (error) {
                next(error);
            }
        };
        this.submitApplication = async (req, res, next) => {
            try {
                const application = await this.scoutService.submitApplication(req.body);
                res.status(201).json({ success: true, data: application });
            }
            catch (error) {
                next(error);
            }
        };
        this.scoutService = new ScoutService_1.ScoutService();
    }
}
exports.ScoutController = ScoutController;
//# sourceMappingURL=ScoutController.js.map