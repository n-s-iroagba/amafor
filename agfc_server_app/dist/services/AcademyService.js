"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademyService = void 0;
const repositories_1 = require("../repositories"); // Assuming Generic Repository
const AuditService_1 = require("./AuditService");
const utils_1 = require("../utils");
class AcademyService {
    constructor() {
        this.academyRepository = new repositories_1.AcademyRepository();
        this.auditService = new AuditService_1.AuditService();
    }
    async getNews(filters) {
        return utils_1.tracer.startActiveSpan('service.AcademyService.getNews', async (span) => {
            try {
                return await this.academyRepository.findNews(filters);
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
        return utils_1.tracer.startActiveSpan('service.AcademyService.submitApplication', async (span) => {
            try {
                const application = await this.academyRepository.createApplication({
                    ...data,
                    status: 'PENDING',
                    appliedAt: new Date()
                });
                utils_1.structuredLogger.business('TRIAL_APPLICATION_SUBMITTED', 0, 'public_user', { applicationId: application.id });
                return application;
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
    async listApplications(filters) {
        return utils_1.tracer.startActiveSpan('service.AcademyService.listApplications', async (span) => {
            try {
                return await this.academyRepository.findApplications(filters);
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
    async updateStatus(applicationId, status, notes, adminId) {
        return utils_1.tracer.startActiveSpan('service.AcademyService.updateStatus', async (span) => {
            try {
                const [affected, updatedApps] = await this.academyRepository.updateApplication(applicationId, {
                    status,
                    notes,
                    reviewedBy: adminId,
                    reviewedAt: new Date()
                });
                if (!affected)
                    throw new Error('Application not found');
                await this.auditService.logAction({
                    userId: adminId,
                    userEmail: 'admin',
                    userType: 'admin',
                    action: 'UPDATE_STATUS',
                    entityType: 'ACADEMY_APP',
                    entityId: applicationId,
                    entityName: `Application ${applicationId}`,
                    changes: [{ field: 'status', newValue: status }],
                    ipAddress: '0.0.0.0',
                    metadata: { notes }
                });
                utils_1.structuredLogger.business('TRIAL_STATUS_CHANGED', 0, adminId, { applicationId, status });
                return updatedApps[0];
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
exports.AcademyService = AcademyService;
//# sourceMappingURL=AcademyService.js.map