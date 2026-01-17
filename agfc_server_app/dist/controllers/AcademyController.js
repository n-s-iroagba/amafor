"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademyController = void 0;
const services_1 = require("../services");
class AcademyController {
    constructor() {
        this.getAcademyNews = async (req, res, next) => {
            try {
                const news = await this.academyService.getNews(req.query);
                res.status(200).json({
                    success: true,
                    data: news
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.registerTrialist = async (req, res, next) => {
            try {
                // Public endpoint
                const application = await this.academyService.submitApplication(req.body);
                res.status(201).json({
                    success: true,
                    message: 'Trial application submitted successfully',
                    data: { applicationId: application.id }
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.listApplications = async (req, res, next) => {
            try {
                const applications = await this.academyService.listApplications(req.query);
                res.status(200).json({
                    success: true,
                    results: applications.length,
                    data: applications
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateApplicationStatus = async (req, res, next) => {
            try {
                const { id } = req.params;
                const { status, notes } = req.body;
                const adminId = req.user.id;
                const result = await this.academyService.updateStatus(id, status, notes, adminId);
                res.status(200).json({
                    success: true,
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.academyService = new services_1.AcademyService();
    }
}
exports.AcademyController = AcademyController;
//# sourceMappingURL=AcademyController.js.map